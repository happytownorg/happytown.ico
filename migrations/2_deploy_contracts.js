var HappytownCrowdsale = artifacts.require("./HappytownCrowdsale.sol");

var debug = true;
var showABI = true;
var showURL = true;
var showTIME = true;
var debugTIME = false;
var devWallet = false;

const BigNumber = web3.BigNumber;

const duration = {
  seconds: function(val) { return val},
  minutes: function(val) { return val * this.seconds(60) },
  hours:   function(val) { return val * this.minutes(60) },
  days:    function(val) { return val * this.hours(24) },
  weeks:   function(val) { return val * this.days(7) },
  years:   function(val) { return val * this.days(365)} 
};

module.exports = function(deployer, network, accounts) {
  return Deploy(deployer, network, accounts);
};

async function Deploy(deployer, network, accounts) {
  
  const _rate = 1000;

  var _multisigWallet;
  var _companyWallet;
  var _teamWallet;
  var _bountyWallet;
  
  var _startTimeRound1;
  var _startTimeRound2;
  var _startTimeRound3;
  var _startTimeIco;
  var _endTime;

  if (devWallet) {
    _multisigWallet = '0xA96811041dDFF5041ef3Db4AF35C6C0B082740a8';
    _companyWallet = '0x11D08ca3992f67414Fb5CB1B7B75Aa963D65e9F9';
    _teamWallet = '0xb2ed1C9C16E529f4184B3b83DF363c84fC5a87f6';
    _bountyWallet = '0x11B7Bf64632b1fea31c81c8DA7fcD1dC14019D25';
  }
  else {
    _multisigWallet = '0x63D6353f1F2c3ce1929F97bFFeded15d3e8C117A';
    _companyWallet = '0xb125B26CE1Ed76620765a1DD1A5473E4f2bF7265';
    _teamWallet = '0x4951A7dF4812a4F908EddE439202020A9adA89C6';
    _bountyWallet = '0x0Ce4184329B63F9fdc3E029D95c3646a08FAfAFd';
  }

  if (debugTIME) {
    _startTimeRound1 = latestTime() + duration.minutes(1);
    _startTimeRound2 = _startTimeRound1 + duration.minutes(10);
    _startTimeRound3 = _startTimeRound2 + duration.minutes(10);
    _startTimeIco = _startTimeRound3 + duration.minutes(10);
    _endTime =  _startTimeIco + duration.minutes(10);
  } else {
    _startTimeRound1 = 1521072000;  // 15.03.2018 00:00:00 GMT
    _startTimeRound2 = _startTimeRound1 + duration.days(7);
    _startTimeRound3 = _startTimeRound2 + duration.days(7);
    _startTimeIco = _startTimeRound3 + duration.days(7);
    _endTime =  _startTimeIco + duration.weeks(12);
  }
  
  return deployer.deploy(HappytownCrowdsale, _startTimeRound1, _startTimeRound2, _startTimeRound3, _startTimeIco, _endTime, _rate, 
                          _multisigWallet, _companyWallet, _teamWallet, _bountyWallet).then( async () => {
    const crowdsaleInstance = await HappytownCrowdsale.deployed();
    if (showTIME) console.log("----------------------------------------------------------------------------------------------");
    if (showTIME) console.log("HappytownCrowdsale startTimeRound1: ", _startTimeRound1);
    if (showTIME) console.log("HappytownCrowdsale startTimeRound2: ", _startTimeRound2);
    if (showTIME) console.log("HappytownCrowdsale startTimeRound3: ", _startTimeRound3);
    if (showTIME) console.log("HappytownCrowdsale startTimeIco: ", _startTimeIco);
    if (showTIME) console.log("HappytownCrowdsale endTime: ", _endTime);
    if (debug) console.log("----------------------------------------------------------------------------------------------");
    if (debug) console.log("HappytownCrowdsale address: ", crowdsaleInstance.address);
    if (debug) console.log("HappytownCrowdsale token: ", await crowdsaleInstance.token.call());
    if (showURL) console.log("HappytownCrowdsale URL: " + getEtherScanUrl(network, crowdsaleInstance.address, "address"));
    if (showABI) console.log("HappytownCrowdsale ABI: ", JSON.stringify(crowdsaleInstance.abi));
    if (debug) console.log("----------------------------------------------------------------------------------------------");
    if (debug) console.log("HappytownCompany address: ", _companyWallet);
    if (debug) console.log("HappytownTeam address: ", _teamWallet);
    if (debug) console.log("HappytownBounty address: ", _bountyWallet);
    if (debug) console.log("HappytownCrowdsale rate: ", _rate);
    if (debug) console.log("----------------------------------------------------------------------------------------------");
    if (debug) console.log("\n\n");
  })
}

function latestTime() {
  return web3.eth.getBlock('latest').timestamp;
}

function getEtherScanUrl(network, data, type) {
  var etherscanUrl;
  if (network == "rinkeby") {
      etherscanUrl = "https://" + network + ".etherscan.io";
  } else if (network == 'test') {
    etherscanUrl = "testrpc";
  } else {
      etherscanUrl = "https://etherscan.io";
  }
  if (type == "tx") {
      etherscanUrl += "/tx";
  } else if (type == "token") {
      etherscanUrl += "/token";
  } else if (type == "address") {
      etherscanUrl += "/address";
  }
  etherscanUrl = etherscanUrl + "/" + data;
  return etherscanUrl;
}
