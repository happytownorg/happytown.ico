pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/MintableToken.sol";

contract HappytownToken is MintableToken {

    string public constant name = "HappyTownToken";
    string public constant symbol = "HTT";
    uint8 public constant decimals = 18;    
}
