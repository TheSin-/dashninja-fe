/*
 This file is part of TRC Ninja.
 https://github.com/terracoin/trcninja-fe

 TRC Ninja is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 TRC Ninja is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with TRC Ninja.  If not, see <http://www.gnu.org/licenses/>.

 */

// Either indicate if we are we on testnet (=1) or on mainnet (=0)
//var trcninjatestnet = 0;
// OR indicate the hostname for testnet (if the hostname the page is running is equal to this, it will switch to testnet)
var trcninjatestnethost = 'test-overview.terracoin.io';
var trcninjatestnetexplorer = 'test-ninja.terracoin.io';

// Tor onion hostname
var trcninjator = 'hv5iyk4wg5sreieq.onion';
var trcninjatestnettor = '';
var trcninjai2p = '';
var trcninjatestneti2p = '';

// Coin logos
var trcninjacoin = ['TRC','tTRC'];

// URLs
// Block info
// ["https://explorer.dashninja.pl/block/%%b%%","elberethzone's Terracoin Blockchain Explorer"]
var trcninjablockexplorer = [[["https://insight.terracoin.io/block/%%b%%","Insight Terracoin Blockchain Explorer"],
                           ["https://explorer.terracoin.io/block/%%b%%","ABE Terracoin Blockchain Explorer"]],
                          [["https://test-insight.terracoin.io/block/%%b%%","Insight Testnet Terracoin Blockchain Explorer"]]];

// Address info
var trcninjamndetail = [[["/mndetails.html?mnpubkey=%%a%%","TRC Ninja Masternode Detail"],
                          ["https://services.terracoin.io/masternodes/%%a%%","Terracoin Services Masternode Monitoring"]],
                         [["/mndetails.html?mnpubkey=%%a%%","TRC Ninja Testnet Masternode Detail"]]];
var trcninjamndetailvin = [[["/mndetails.html?mnoutput=%%a%%","TRC Ninja Masternode Detail"]],
                            [["/mndetails.html?mnoutput=%%a%%","TRC Ninja Testnet Masternode Detail"]]];

// ["https://explorer.dashninja.pl/address/%%a%%","elberethzone's Terracoin Blockchain Explorer"],
var trcninjaaddressexplorer = [[["https://insight.terracoin.io/address/%%a%%","Insight Terracoin Blockchain Explorer"],
                           ["https://explorer.terracoin.io/address/%%a%%","ABE Terracoin Blockchain Explorer"]],
                          [["https://test-insight.terracoin.io/address/%%a%%","Insight Testnet Terracoin Blockchain Explorer"]]];
// ["http://explorer.dashninja.pl/tx/%%a%%","elberethzone's Terracoin Blockchain Explorer"],
var trcninjatxexplorer = [[["https://insight.terracoin.io/tx/%%a%%","Insight Terracoin Blockchain Explorer"],
                           ["https://explorer.terracoin.io/tx/%%a%%","ABE Terracoin Blockchain Explorer"]],
                          [["https://test-insight.terracoin.io/tx/%%a%%","Insight Testnet Terracoin Blockchain Explorer"]]];

// Search query
// ["https://explorer.dashninja.pl/search?q=%%q%%","elberethzone's Terracoin Blockchain Explorer"],
var trcninjaqueryexplorer = [[["https://insight.terracoin.io/query/%%q%%","Insight Terracoin Blockchain Explorer"],
                           ["https://explorer.terracoin.io/search?=%%q%%","ABE Terracoin Blockchain Explorer"]],
                          [["https://test-insight.terracoin.io/query/%%q%%","Insight Testnet Terracoin Blockchain Explorer"]]];

var trcninjamasternodemonitoring = ["/masternodes.html?mnregexp=%%p%%#mnversions","/masternodes.html?mnregexp=%%p%%#mnversions"];

var trcninjabudgetdetail = ["/budgetdetails.html?budgetid=%%b%%","/budgetdetails.html?budgetid=%%b%%"];

var trcninjagovernanceproposaldetail = ["/proposaldetails.html?proposalhash=%%b%%","/proposaldetails.html?proposalhash=%%b%%"];

// Blocks per day
var trcblocksperday = 686;
