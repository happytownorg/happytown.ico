pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/crowdsale/Crowdsale.sol';
import "./HappytownToken.sol";

contract HappytownCrowdsale is Crowdsale, Ownable {

    bool public isFinalized = false;

    event Finalized();

    address companyWallet;
    address teamWallet;
    address bountyWallet;

    uint256 startTimeRound1;
    uint256 startTimeRound2;
    uint256 startTimeRound3;
    uint256 startTimeIco;
    uint256 endTime;

    // overridden: Crowdsale
    function HappytownCrowdsale(uint256 _startTimeRound1,
                                uint256 _startTimeRound2,
                                uint256 _startTimeRound3,
                                uint256 _startTimeIco,
                                uint256 _endTime,
                                uint256 _rate,
                                address _miltisigWallet,
                                address _companyWallet,
                                address _teamWallet,
                                address _bountyWallet)
        public
        Crowdsale(_startTimeRound1, _endTime, _rate, _miltisigWallet)
    {
        require(_companyWallet != address(0));
        require(_teamWallet != address(0));
        require(_bountyWallet != address(0));
        companyWallet = _companyWallet;
        teamWallet = _teamWallet;
        bountyWallet = _bountyWallet;
        startTimeRound1 = _startTimeRound1;
        startTimeRound2 = _startTimeRound2;
        startTimeRound3 = _startTimeRound3;
        startTimeIco = _startTimeIco;
        endTime = _endTime;
    }

    // overridden: Crowdsale.createTokenContract()
    function createTokenContract()
      internal
      returns (MintableToken)
    {
        return new HappytownToken();
    }

    // overridden: Crowdsale.buyTokens(address beneficiary) payable
    function buyTokens(address beneficiary)
      public
      payable
    {
        require(beneficiary != address(0));
        require(validPurchase());

        uint256 weiAmount = msg.value;
        uint256 tokens = weiAmount.mul(rate);
        
        uint256 tokensWithBonus = tokens.add(getBonus(tokens));

        // update state
        weiRaised = weiRaised.add(tokensWithBonus);

        // send token
        token.mint(beneficiary, tokensWithBonus);
        TokenPurchase(msg.sender,
                      beneficiary,
                      weiAmount,
                      tokens);
        
        forwardFunds();
    }
    
    // calculate token amount to be created with bonus at pre-ico
    function getBonus(uint256 _tokens) internal view returns (uint256) {

        uint256 bonusTokens = 0;

        if ( now >= startTimeRound1 && now <= endTime) {
                if ( now >= startTimeRound1 && now < startTimeRound2 ) {
                    bonusTokens = _tokens.div(4); // 25% bonus
                }
                if ( now >= startTimeRound2 && now < startTimeRound3 ) {
                    bonusTokens = _tokens.div(10); // 10% bonus
                }
                if ( now >= startTimeRound3 && now < startTimeIco ) {
                    bonusTokens = _tokens.div(20); // 5% bonus
                }
        }

        return bonusTokens;
    }

    // Finalize crowdsale
    function Finalize() onlyOwner public {

        require(!isFinalized);
        require(hasEnded());

        uint256 restrictedTokens;

        // issued tokens
        uint256 issuedTokenSupply = token.totalSupply();

        // company tokens 
        restrictedTokens = issuedTokenSupply.mul(10).div(90);
        token.mint(companyWallet, restrictedTokens);
        // team tokens
        restrictedTokens = issuedTokenSupply.mul(8).div(92);
        token.mint(teamWallet, restrictedTokens);
        // bounty tokens
        restrictedTokens = issuedTokenSupply.mul(2).div(98);
        token.mint(bountyWallet, restrictedTokens);

        token.finishMinting();

        Finalized();
        isFinalized = true;
    }
}
