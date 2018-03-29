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

// TRC Ninja Front-End (trcninja-fe) - Proposal Details
// By elberethzone / https://www.dash.org/forum/members/elbereth.175/

var trcninjaversion = '1.0.1';
var tableVotes = null;
var tableSuperBlocks = null;
var trcoutputregexp = /^[a-z0-9]{64}$/;
var trcbudgetregexp = /^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890 .,;_\-/:?@()]+$/;
var proposalname = '';
var proposalhash = '';
var latestblock = null;
var currentbudget = null;
var currentbudgetprojection = null;
var currentstats = null;

$.fn.dataTable.ext.errMode = 'throw';

if (typeof trcninjatestnet === 'undefined') {
  var trcninjatestnet = 0;
}
if (typeof trcninjatestnethost !== 'undefined') {
  if (window.location.hostname == trcninjatestnethost) {
    trcninjatestnet = 1;
    $('a[name=menuitemexplorer]').attr("href", "https://"+trcninjatestnetexplorer);
  }
}

if (typeof trcninjacoin === 'undefined') {
  var trcninjacoin = ['',''];
}
if (typeof trcninjaaddressexplorer === 'undefined') {
  var trcninjaaddressexplorer = [[],[]];
}
if (typeof trcninjaaddressexplorer[0] === 'undefined') {
  trcninjaaddressexplorer[0] = [];
}
if (typeof trcninjaaddressexplorer[1] === 'undefined') {
  trcninjaaddressexplorer[1] = [];
}

if (typeof trcninjamndetailvin === 'undefined') {
    var trcninjamndetailvin = [[],[]];
}
if (typeof trcninjamndetailvin[0] === 'undefined') {
    trcninjamndetailvin[0] = [];
}
if (typeof trcninjamndetailvin[1] === 'undefined') {
    trcninjamndetailvin[1] = [];
}

if (typeof trcninjaaddressexplorer === 'undefined') {
    var trcninjaaddressexplorer = [[],[]];
}
if (typeof trcninjaaddressexplorer[0] === 'undefined') {
    trcninjaaddressexplorer[0] = [];
}
if (typeof trcninjaaddressexplorer[1] === 'undefined') {
    trcninjaaddressexplorer[1] = [];
}

if (typeof trcninjatxexplorer === 'undefined') {
    var trcninjatxexplorer = [[],[]];
}
if (typeof trcninjatxexplorer[0] === 'undefined') {
    trcninjatxexplorer[0] = [];
}
if (typeof trcninjatxexplorer[1] === 'undefined') {
    trcninjatxexplorer[1] = [];
}

function budgetdetailsRefresh(useHash){
  console.log("DEBUG: budgetdetailsRefresh starting");
  $('#budgetinfoLR').html( '<i class="fa fa-spinner fa-pulse"></i> Refreshing <i class="fa fa-spinner fa-pulse"></i>' );
  var query = '/api/governanceproposals?testnet='+trcninjatestnet;
  if (useHash) {
    query += '&proposalshashes=["'+encodeURIComponent(proposalhash)+'"]';
  }
  else {
    query += '&proposalsnames=["'+encodeURIComponent(proposalname)+'"]';
  }
    console.log("DEBUG: REST query="+query);
  $.getJSON( query, function( data ) {
   var date = new Date();
   var n = date.toDateString();
   var time = date.toLocaleTimeString();
   var result = "";

   console.log("DEBUG: REST api /budgets query responded!");

   if ((!data.hasOwnProperty("data")) || (!data.data.hasOwnProperty("governanceproposals")) || (!Array.isArray(data.data.governanceproposals)) || (data.data.governanceproposals.length == 0)) {
       result = 'Unknown budget';
    $('#budgetid').text(result+" ("+proposalname+")");
    $('#budgethash').text(result+" ("+proposalhash+")");
       $('#budgethash1').text("???");
       $('#budgethash2').text("???");
       $('#budgethash3').text("???");
       $('#budgethash4').text("???");
       $('#budgetfee').text(result);
       $('#budgeturl').text(result);
    $('#budgetblockstart').text(result);
    $('#budgetblockend').text(result);
    $('#budgetmonthlyamount').text(result);
    $('#budgettotalamount').text(result);
    $('#budgetremainingpayments').text(result);
    $('#budgettotalpayments').text(result);
    $('#budgetpubkey').text(result);
    $('#budgetstatus').text(result);
       $('#budgetlastpaid').text(result);
       $('#budgetyes').text(result);
       $('#budgetno').text(result);
       $('#budgetabstain').text(result);
       $('#budgetyesremaining').text(result);
       $('#budgetlastseen').text(result);
       $('#budgetfirstseen').text(result);
   }
   else {

       currentbudget = data.data.governanceproposals[0];
       currentstats = data.data.stats;
       $('#budgetid').text( data.data.governanceproposals[0].Name );
       $('#budgethash').text( data.data.governanceproposals[0].Hash );
       $('#budgethash1').text( data.data.governanceproposals[0].Hash );
       $('#budgethash2').text( data.data.governanceproposals[0].Hash );
       $('#budgethash3').text( data.data.governanceproposals[0].Hash );
       $('#budgethash4').text( data.data.governanceproposals[0].Hash );
       $('#budgethash5').text( data.data.governanceproposals[0].Hash );
       $('#budgethash6').text( data.data.governanceproposals[0].Hash );

       proposalname = data.data.governanceproposals[0].Name;
       proposalhash = data.data.governanceproposals[0].Hash;
       var outtxt = "";
       if (trcninjatxexplorer[trcninjatestnet].length > 0) {
           var ix = 0;
           for ( var i=0, ien=trcninjatxexplorer[trcninjatestnet].length ; i<ien ; i++ ) {
               if (ix == 0) {
                   outtxt += '<a href="'+trcninjatxexplorer[trcninjatestnet][0][0].replace('%%a%%',data.data.governanceproposals[0].CollateralHash)+'">'+data.data.governanceproposals[0].CollateralHash+'</a>';
               }
               else {
                   outtxt += '<a href="'+trcninjatxexplorer[trcninjatestnet][i][0].replace('%%a%%',data.data.governanceproposals[0].CollateralHash)+'">['+ix+']</a>';
               }
               ix++;
           }
       }
       else {
           outtxt = data.data.governanceproposals[0].CollateralHash;
       }
       $('#budgetfee').html( outtxt );

       var url = data.data.governanceproposals[0].URL;
       if (url.indexOf("://") == -1) {
           url = "http://"+url;
       }
       $('#budgeturl').html( '<a href="'+url+'">'+data.data.governanceproposals[0].URL+'</a> - <a href="https://services.terracoin.io/p/'+encodeURI(data.data.governanceproposals[0].Name)+'"><img src="/static/terracoin-services-64x64.png" height=16" width="16"></a>' );
       var dateConv = new Date(data.data.governanceproposals[0].EpochStart*1000);
       $('#budgetblockstart').text( dateConv.toLocaleDateString()+' '+dateConv.toLocaleTimeString() );
       var dateConv = new Date(data.data.governanceproposals[0].EpochEnd*1000);
       $('#budgetblockend').text( dateConv.toLocaleDateString()+' '+dateConv.toLocaleTimeString() );

       var nextsuperblockdatetimestamp = data.data.stats.latestblock.BlockTime+(((data.data.stats.nextsuperblock.blockheight-data.data.stats.latestblock.BlockId)/686)*86400);
       var monthsleft = Math.round (( data.data.governanceproposals[0].EpochEnd - Math.max(data.data.governanceproposals[0].EpochStart,nextsuperblockdatetimestamp)) / 2592000);
       if (monthsleft < 0) {
           monthsleft = 0;
       }
       else if (monthsleft == 0) {
           if (currentbudget.EpochEnd >= nextsuperblockdatetimestamp) {
               monthsleft = 1;
           }
       }
       $('#budgetmonthlyamount').html( addCommas( data.data.governanceproposals[0].PaymentAmount.toFixed(3) )+' '+trcninjacoin[trcninjatestnet] + ' (<span id="budgetmonthlyamountusd">???</span> USD) (<span id="budgetmonthlyamounteur">???</span> EUR)');
       $('#budgettotalamount').html( addCommas( (data.data.governanceproposals[0].PaymentAmount*monthsleft).toFixed(3) )+' '+trcninjacoin[trcninjatestnet] + ' (<span id="budgettotalamountusd">???</span> USD) (<span id="budgettotalamounteur">???</span> EUR)' );
       $('#budgettotalpayments').html( '<i class="fa fa-spinner fa-pulse"></i>' );
       $('#budgetremainingpayments').text( monthsleft );
       $('#budgetyes').text( data.data.governanceproposals[0].Yes );
       $('#budgetno').text( data.data.governanceproposals[0].No );
       $('#budgetabstain').text( data.data.governanceproposals[0].Abstain );

       outtxt = "";
           if (trcninjaaddressexplorer[trcninjatestnet].length > 0) {
               var ix = 0;
               for ( var i=0, ien=trcninjaaddressexplorer[trcninjatestnet].length ; i<ien ; i++ ) {
                   if (ix == 0) {
                       outtxt += '<a href="'+trcninjaaddressexplorer[trcninjatestnet][0][0].replace('%%a%%',data.data.governanceproposals[0].PaymentAddress)+'">'+data.data.governanceproposals[0].PaymentAddress+'</a>';
                   }
                   else {
                       outtxt += '<a href="'+trcninjaaddressexplorer[trcninjatestnet][i][0].replace('%%a%%',data.data.governanceproposals[0].PaymentAddress)+'">['+ix+']</a>';
                   }
                   ix++;
               }
           }
           else {
               outtxt = data.data.governanceproposals[0].PaymentAddress;
           }
       $('#budgetpubkey').html( outtxt );

       var mnLimit = Math.floor(data.data.stats.totalmns * 0.1);
       var curPositive = data.data.governanceproposals[0].Yes - data.data.governanceproposals[0].No;
       var cls = "danger";
       if (curPositive < mnLimit) {
           $('#budgetyesremaining').text( "Need "+(mnLimit-curPositive)+" YES votes" );
       }
       else {
           $('#budgetyesremaining').text( "Already exceed 10% by "+(curPositive-mnLimit)+" YES votes" );
           cls = "success";
       }
       $('#budgetyesremaining').removeClass("danger").removeClass("success").addClass(cls);

       var result = "";
       if (data.data.governanceproposals[0].LastReported > 0) {
           result = deltaTimeStampHRlong(data.data.governanceproposals[0].LastReported,currenttimestamp())+" ago";
       }
       else {
           result = 'Just now ('+data.data.governanceproposals[0].LastReported+')';
       }
       var dateConv = new Date(data.data.governanceproposals[0].LastReported*1000);
       $('#budgetlastseen').text( result+' ['+dateConv.toLocaleDateString()+' '+dateConv.toLocaleTimeString()+']' );
       $('#budgetlastseen2').text( dateConv.toLocaleString()+' ('+result+')' );
       var result = "";
       if (data.data.governanceproposals[0].FirstReported > 0) {
           result = deltaTimeStampHRlong(data.data.governanceproposals[0].FirstReported,currenttimestamp())+" ago";
       }
       else {
           result = 'Just now ('+data.data.governanceproposals[0].FirstReported+')';
       }
       var dateConv = new Date(data.data.governanceproposals[0].FirstReported*1000);
       $('#budgetfirstseen').text( result+' ['+dateConv.toLocaleDateString()+' '+dateConv.toLocaleTimeString()+']' );

       result = "";
       cls = "";
       var checkBP = false;
       if ((currenttimestamp() - data.data.governanceproposals[0].LastReported) > 3600) {
           result = "Unlisted/Dropped";
           cls = "danger";
           $('#voteisover').show();
           $('#voteisover2').hide();
           $('#voteyes').hide();
           $('#voteno').hide();
           $('#voteabstain').hide();
       }
       else {
           if (data.data.governanceproposals[0].BlockchainValidity) {
               result = 'Valid';
               if (data.data.governanceproposals[0].CachedFunding) {
                   result += ' and funding. <i class="fa fa-spinner fa-pulse"></i>';
                   checkBP = true;
               }
               cls = "success";
           }
           else {
               result = "Invalid ("+data.data.governanceproposals[0].IsValidReason+")";
               cls = "warning";
           }

           $('#voteisover').hide();
           $('#voteisover2').hide();
           $('#voteyes').show();
           $('#voteno').show();
           $('#voteabstain').show();
       }
       $('#budgetstatus').html(result).removeClass("danger").removeClass("success").removeClass("warning").addClass(cls);;

       if (tableVotes !== null) {
           tableVotes.api().ajax.reload();
       }
       else {
           tableVotes = $('#votestable').dataTable({
               ajax: {
                   url: '/api/governanceproposals/votes?testnet=' + trcninjatestnet + '&proposalhash=' + encodeURIComponent(currentbudget.Hash),
                   dataSrc: 'data.governanceproposalvotes'
               },
               lengthMenu: [[50, 100, 250, 500, -1], [50, 100, 250, 500, "All"]],
               pageLength: 50,
               order: [[0, "desc"]],
               columns: [
                   {
                       data: null, render: function (data, type, row) {
                       var date = new Date(data.VoteTime * 1000);
                       if (type == 'sort') {
                           return date;
                       }
                       else {
                           return date.toLocaleDateString() + " " + date.toLocaleTimeString();
                       }
                   }
                   },
                   {
                       data: null, render: function (data, type, row) {
                       var outtxt = '';
                       if (type != 'sort') {
                           if ((trcninjamndetailvin[trcninjatestnet].length > 0) || (trcninjatxexplorer[trcninjatestnet].length > 0)) {
                               var ix = 0;
                               for (var i = 0, ien = trcninjamndetailvin[trcninjatestnet].length; i < ien; i++) {
                                   if (ix == 0) {
                                       outtxt += '<a href="' + trcninjamndetailvin[trcninjatestnet][0][0].replace('%%a%%', data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex) + '">' + data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex + '</a>';
                                   }
                                   else {
                                       outtxt += '<a href="' + trcninjamndetailvin[trcninjatestnet][i][0].replace('%%a%%', data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex) + '">[' + ix + ']</a>';
                                   }
                                   ix++;
                               }
                               for (var i = 0, ien = trcninjatxexplorer[trcninjatestnet].length; i < ien; i++) {
                                   if (ix == 0) {
                                       outtxt += '<a href="' + trcninjatxexplorer[trcninjatestnet][0][0].replace('%%a%%', data.MasternodeOutputHash) + '">' + data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex + '</a>';
                                   }
                                   else {
                                       outtxt += '<a href="' + trcninjatxexplorer[trcninjatestnet][i][0].replace('%%a%%', data.MasternodeOutputHash) + '">[' + ix + ']</a>';
                                   }
                                   ix++;
                               }
                           }
                           else {
                               outtxt = data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex;
                           }
                       }
                       else {
                           outtxt = data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex;
                       }
                       return outtxt;
                   }
                   },
                   {data: "VoteValue"},
                   {
                       data: null, render: function (data, type, row) {
                       return data.VoteHash;
                   }
                   }
               ],
               createdRow: function (row, data, index) {
                   if (data.VoteValue == "YES") {
                       $('td', row).eq(2).css({"background-color": "#d6e9c6", "color": "#3c763d"});
                   }
                   else if (data.VoteValue == "ABSTAIN") {
                       $('td', row).eq(2).css({"background-color": "#fcf8e3", "color": "#8a6d3b"});
                   }
                   else {
                       $('td', row).eq(2).css({"background-color": "#f2dede", "color": "#a94442"});
                   }
               }
           });
       }

       $('#budgetlastpaid').html( '<i class="fa fa-spinner fa-pulse"></i> Calculating... <i class="fa fa-spinner fa-pulse"></i>' );
       if (tableSuperBlocks !== null) {
           tableSuperBlocks.api().ajax.reload();
       }
       else {
           tableSuperBlocks = $('#superblockstable').dataTable({
               ajax: {
                   url: '/api/blocks/superblocks?testnet=' + trcninjatestnet + '&proposalshash=["' + encodeURIComponent(currentbudget.Hash) + '"]',
                   dataSrc: 'data.superblocks'
               },
               lengthMenu: [[50, 100, 250, 500, -1], [50, 100, 250, 500, "All"]],
               pageLength: 50,
               order: [[0, "desc"]],
               columns: [
                   { data: null, render: function ( data, type, row ) {
                       if (type == 'sort') {
                           return data.BlockTime;
                       }
                       else {
                           return timeSince((currenttimestamp() - data.BlockTime));
                       }

                   } },
                   { data: null, render: function ( data, type, row ) {
                       var outtxt = data.BlockId;
                       if (type != 'sort') {
                           if (trcninjablockexplorer[trcninjatestnet].length > 0) {
                               outtxt = '<a href="'+trcninjablockexplorer[trcninjatestnet][0][0].replace('%%b%%',data.BlockHash)+'">'+data.BlockId+'</a>';
                           }
                       }
                       return outtxt;
                   } },
                   { data: null, render: function ( data, type, row ) {
                       var outtxt = data.BlockPoolPubKey;
                       if (data.PoolDescription) {
                           outtxt = data.PoolDescription;
                       }
                       return outtxt;
                   } },
                   { data: null, render: function ( data, type, row ) {
                       if (type == "sort") {
                           return data.SuperBlockPaymentAmount;
                       } else {
                           return addCommas(data.SuperBlockPaymentAmount.toFixed(3))+" "+trcninjacoin[trcninjatestnet];
                       }
                   }
                   }
               ],
               createdRow: function (row, data, index) {
               }
           });
       }
  }

   $('#budgetinfoLR').text( date.toLocaleString() );
      refreshFiatValues();
      if (checkBP) {
          refreshBudgetProjection(useHash);
      }
   console.log("DEBUG: auto-refresh starting");
   setTimeout(budgetdetailsRefresh, 300000);
  });
};

function refreshBudgetProjection(useHash) {
    console.log("DEBUG: refreshBudgetProjection starting");
    var query = '/api/budgetsprojection?testnet=' + trcninjatestnet+'&onlyvalid=1';
    query += '&budgethashes=["' + encodeURIComponent(currentbudget.Hash) + '"]';
    console.log("DEBUG: REST query=" + query);
    $.getJSON(query, function (data) {
        console.log("DEBUG: REST api /budgetsprojection query responded!");

        if ((data.hasOwnProperty("data")) && (data.data.hasOwnProperty("budgetsprojection")) && (Array.isArray(data.data.budgetsprojection)) && (data.data.budgetsprojection.length == 1) &&
            ((currenttimestamp() - data.data.budgetsprojection[0].LastReported) < 3600)) {
            $('#budgetstatus').html("Valid and expected next super block (" + addCommas(data.data.budgetsprojection[0].Alloted.toFixed(3)) + " " + trcninjacoin[trcninjatestnet] + ").");
        }
        else {
            $('#budgetstatus').html("Valid");
        }
    });
}

function refreshFiatValues() {

    if (currentbudget !== null) {
        $('#fiatTRCBTCval').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatTRCBTCwho').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatTRCBTCwhen').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatUSDBTCval').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatUSDBTCwho').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatUSDBTCwhen').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatEURBTCval').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatEURBTCwho').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatEURBTCwhen').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#budgetmonthlyamountusd').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#budgetmonthlyamounteur').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#budgettotalamountusd').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#budgettotalamounteur').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        var query = '/api/tablevars';
        $.getJSON( query, function( data ) {
            console.log("DEBUG: REST api /tablevars query reply!");
            if ((!data.hasOwnProperty("data")) || (!data.data.hasOwnProperty("tablevars")) || (data.data.tablevars === null)
            || (!data.data.tablevars.hasOwnProperty("btctrc")) || (!data.data.tablevars.hasOwnProperty("eurobtc"))
            || (!data.data.tablevars.hasOwnProperty("usdbtc"))) {
                $('#fiatTRCBTCval').text( '???' );
                $('#fiatTRCBTCwho').text( '???' );
                $('#fiatTRCBTCwhen').text( '???' );
                $('#fiatUSDBTCval').text( '???' );
                $('#fiatUSDBTCwho').text( '???' );
                $('#fiatUSDBTCwhen').text( '???' );
                $('#fiatEURBTCval').text( '???' );
                $('#fiatEURBTCwho').text( '???' );
                $('#fiatEURBTCwhen').text( '???' );
                $('#budgetmonthlyamountusd').text( '???' );
                $('#budgetmonthlyamounteur').text( '???' );
                $('#budgettotalamountusd').text( '???' );
                $('#budgettotalamounteur').text( '???' );
            }
            else {
                $('#fiatTRCBTCval').text( data.data.tablevars.btctrc.StatValue );
                $('#fiatTRCBTCwho').text( data.data.tablevars.btctrc.Source );
                var tmpDate = new Date(parseInt(data.data.tablevars.btctrc.LastUpdate)*1000);
                $('#fiatTRCBTCwhen').text( tmpDate.toLocaleString() );
                $('#fiatUSDBTCval').text( data.data.tablevars.usdbtc.StatValue );
                $('#fiatUSDBTCwho').text( data.data.tablevars.usdbtc.Source );
                tmpDate = new Date(parseInt(data.data.tablevars.usdbtc.LastUpdate)*1000);
                $('#fiatUSDBTCwhen').text( tmpDate.toLocaleString() );
                $('#fiatEURBTCval').text( data.data.tablevars.eurobtc.StatValue );
                $('#fiatEURBTCwho').text( data.data.tablevars.eurobtc.Source );
                tmpDate = new Date(parseInt(data.data.tablevars.eurobtc.LastUpdate)*1000);
                $('#fiatEURBTCwhen').text( tmpDate.toLocaleString() );

                var valBTC = currentbudget.PaymentAmount * parseFloat(data.data.tablevars.btctrc.StatValue);
                var valUSD = valBTC * parseFloat(data.data.tablevars.usdbtc.StatValue);
                var valEUR = valBTC * parseFloat(data.data.tablevars.eurobtc.StatValue);
                $('#budgetmonthlyamountusd').text( addCommas(valUSD.toFixed(2)) );
                $('#budgetmonthlyamounteur').text( addCommas(valEUR.toFixed(2)) );

                var nextsuperblockdatetimestamp = currentstats.latestblock.BlockTime+(((currentstats.nextsuperblock.blockheight-currentstats.latestblock.BlockId)/686)*86400);
                var monthsleft = Math.round (( currentbudget.EpochEnd - Math.max(currentbudget.EpochStart,nextsuperblockdatetimestamp)) / 2592000);
                if (monthsleft < 0) {
                    monthsleft = 0;
                }
                else if (monthsleft == 0) {
                    if (currentbudget.EpochEnd >= nextsuperblockdatetimestamp) {
                        monthsleft = 1;
                    }
                }

                valBTC = currentbudget.PaymentAmount*monthsleft * parseFloat(data.data.tablevars.btctrc.StatValue);
                valUSD = valBTC * parseFloat(data.data.tablevars.usdbtc.StatValue);
                valEUR = valBTC * parseFloat(data.data.tablevars.eurobtc.StatValue);
                $('#budgettotalamountusd').text( addCommas(valUSD.toFixed(2)) );
                $('#budgettotalamounteur').text( addCommas(valEUR.toFixed(2)) );

            }
        });
    }

}

$(document).ready(function(){

  $('#trcninjajsversion').text( trcninjaversion );

  if (trcninjatestnet == 1) {
      $('#testnetalert').show();
  }

  proposalname = getParameter("proposalname");
  console.log("DEBUG: proposalname="+proposalname);
  proposalhash = getParameter("proposalhash");
  console.log("DEBUG: proposalhash="+proposalhash);

  if ((proposalname == "") && (proposalhash == "")) {
      proposalname = 'Need "proposalname" parameter';
      $('#budgetid').text(proposalname);
      proposalhash = 'Need "proposalhash" parameter';
      $('#budgethash').text(proposalhash);
  }
  else {
    if ((proposalname != "") && (proposalhash == "")) {
      if (!trcbudgetregexp.test(proposalname)) {
          proposalname = 'Invalid';
          $('#budgetid').text(proposalname);
      }
      else {
          budgetdetailsRefresh(false);
      }
    }
    else {
      if (!trcoutputregexp.test(proposalhash)) {
          proposalhash = 'Invalid';
          $('#budgethash').text( proposalhash );
      }
      else {
          budgetdetailsRefresh(true);
      }
    }
  }

  $('#votestable').on('xhr.dt', function ( e, settings, json ) {
        // Change the last refresh date
        var date = new Date();
        $('#votestableLR').text( date.toLocaleString() );
      } );

    $('#superblockstable').on('xhr.dt', function ( e, settings, json ) {
        latestblock = {BlockTime: 0, BlockId: -1};
        // Fill per version stats table
        var numblocks = 0;
        var totalamount = 0.0;
        for (var blockid in json.data.superblocks){
            if(!json.data.superblocks.hasOwnProperty(blockid)) {continue;}
            numblocks++;
            totalamount += json.data.superblocks[blockid].SuperBlockPaymentAmount;
            if (json.data.superblocks[blockid].BlockTime > latestblock.BlockTime) {
                latestblock = json.data.superblocks[blockid];
            }
        }
        $('#budgettotalpayments').text( numblocks+" - "+totalamount.toFixed(3)+' '+trcninjacoin[trcninjatestnet] );

        var nextsuperblockdatetimestamp = currentstats.latestblock.BlockTime+(((currentstats.nextsuperblock.blockheight-currentstats.latestblock.BlockId)/686)*86400);
        var monthsleft = Math.round (( currentbudget.EpochEnd - Math.max(currentbudget.EpochStart,nextsuperblockdatetimestamp)) / 2592000);

        if (monthsleft < 0) {
            monthsleft = 0;
        }
        else if (monthsleft == 0) {
            if (currentbudget.EpochEnd >= nextsuperblockdatetimestamp) {
                monthsleft = 1;
            }
        }
        var outtxt = monthsleft;
        var cls = "danger";

        if (monthsleft > 0) {
            outtxt += " - ";
            if ((currenttimestamp() - currentbudget.LastReported) > 3600) {
                outtxt += "Won't get future payments (unlisted)";
            }
            else {
                var mnLimit = Math.floor(currentstats.totalmns * 0.1);
                var curPositive = currentbudget.Yes - currentbudget.No;
                var blockheightshow = currentstats.nextsuperblock.blockheight;
                if (nextsuperblockdatetimestamp < currentbudget.EpochStart) {
                    var howmany = Math.round((currentbudget.EpochStart - nextsuperblockdatetimestamp)/2592000);
                    var howmany2 = (currentbudget.EpochStart - nextsuperblockdatetimestamp) % 2592000;
                    if (howmany2 > 0) {
                        howmany++;
                    }
                    nextsuperblockdatetimestamp += howmany*2592000;
                    blockheightshow += howmany+(686*30);
                }
                var datesuperblock = new Date(nextsuperblockdatetimestamp * 1000);
                if (curPositive > mnLimit) {
                    outtxt += "Next payment at super-block ";
                }
                else {
                    outtxt += "Next possible super-block ";
                }
                outtxt += blockheightshow + " (est. " + datesuperblock.toLocaleString() + ", " + deltaTimeStampHRlong(nextsuperblockdatetimestamp, currenttimestamp()) + " from now)";
                $('#voteisover').hide();
                $('#voteisover2').hide();
                $('#voteyes').show();
                $('#voteno').show();
                $('#voteabstain').show();
            }
        }
        else {
            $('#voteisover').hide();
            $('#voteisover2').show();
            $('#voteyes').hide();
            $('#voteno').hide();
            $('#voteabstain').hide();
        }
        $('#budgetremainingpayments').text( outtxt );

        outtxt = "";
        cls = "danger";
        if (latestblock.BlockId == -1) {
            outtxt = "Never";
        }
        else {
            if (trcninjablockexplorer[trcninjatestnet].length > 0) {
                outtxt = 'Block <a href="' + trcninjablockexplorer[trcninjatestnet][0][0].replace('%%b%%', latestblock.BlockHash) + '">' + latestblock.BlockId + '</a>';
            }
            var tmpDate = new Date(latestblock.BlockTime * 1000);
            outtxt += " on " + tmpDate.toLocaleString() + " (" + timeSince((currenttimestamp() - latestblock.BlockTime)) + ")";
            cls = "success";
        }

        $('#budgetlastpaid').html( outtxt ).removeClass("danger").removeClass("success").addClass(cls);
        $('#budgetlastpaid2').html( outtxt );

        // Change the last refresh date
        var date = new Date();
        $('#superblockstableLR').text( date.toLocaleString() );
    } );

});
