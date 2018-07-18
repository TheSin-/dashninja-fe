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

// TRC Ninja Front-End (trcninja-fe) - Masternode List (v2)
// By elberethzone / https://www.dash.org/forum/members/elbereth.175/

var trcninjaversion = '2.5.2';
var tableLocalNodes = null;
var tableBlockConsensus = null;
var tableMNList = null;
var chartMNVersions = null;
var trcversiondefault = "0.12.1.8";
var trcversion = trcversiondefault;
var trcversioncheck = trcversion;
var trcversionsemaphore = false;
var sentinelversiondefault = "1.0";
var sentinelversion = sentinelversiondefault;
var trcmaxprotocol = 0;

$.fn.dataTable.ext.errMode = 'throw';

if(typeof(Storage) !== "undefined") {
    if (sessionStorage.getItem("nexttrcversion") !== null) {
        sessionStorage.removeItem("nexttrcversion");
    }
}

if (typeof trcninjatestnet === 'undefined') {
    var trcninjatestnet = 0;
}
if (typeof trcninjatestnethost !== 'undefined') {
    if (window.location.hostname == trcninjatestnethost) {
        trcninjatestnet = 1;
        $('a[name=menuitemexplorer]').attr("href", "https://"+trcninjatestnetexplorer);
    }
}

if (typeof trcninjamndetail === 'undefined') {
    var trcninjamndetail = [[],[]];
}
if (typeof trcninjamndetail[0] === 'undefined') {
    trcninjamndetail[0] = [];
}
if (typeof trcninjamndetail[1] === 'undefined') {
    trcninjamndetail[1] = [];
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

if (typeof trcninjaqueryexplorer === 'undefined') {
    var trcninjaqueryexplorer = [[],[]];
}
if (typeof trcninjaqueryexplorer[0] === 'undefined') {
    trcninjaqueryexplorer[0] = [];
}
if (typeof trcninjaqueryexplorer[1] === 'undefined') {
    trcninjaqueryexplorer[1] = [];
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

function tableLocalNodesRefresh(){
    tableLocalNodes.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableLocalNodesRefresh, 60000);
};

function tableBlockConsensusRefresh(){
    tableBlockConsensus.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableLocalNodesRefresh, 150000);
};

function tableMNListRefresh(){
    tableMNList.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableMNListRefresh, 300000);
};

function mnpaymentsRefresh(){
    $.getJSON( "/api/masternodes/stats?testnet="+trcninjatestnet, function( data ) {
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#mnpaymentsLR').text( n + ' ' + time );
        $('#mnpayments').text( Math.round(data.data.MasternodeStatsTotal.MasternodeExpectedPayment*10000)/10000 );
        $('#mnpaymentsratio').text( (Math.round(data.data.MasternodeStatsTotal.RatioPayed*10000)/100)+ '%' );
        setTimeout(mnpaymentsRefresh, 300000);
    });
};

function displaytrcVersion(trcversion,sentinelversion) {
    if (trcversion != "?") {
        $('#msgalert').show();
    }
    else {
        $('#msgalert').hide();
    }
    $('#currenttrcversion').text( trcversion );
    $('#currentsentinelversion').text( sentinelversion );
}

function getLatesttrcVersion() {
    var currentdate = new Date();
    trcversion = sessionStorage.getItem("currenttrcversion");
    sentinelversion = sessionStorage.getItem("currentsentinelversion");
    var nextdate = sessionStorage.getItem("nexttrcversion");
    if ((( trcversion === null ) || (sentinelversion === null)
            || ( sessionStorage.getItem("nexttrcversion") === null )
            || ( sessionStorage.getItem("nexttrcversion") < currentdate.getTime() )) && (trcversionsemaphore == false)) {
        trcversionsemaphore = true;
        $.getJSON( "/trcninja-latestversion.json?nocache="+ (new Date()).getTime(), function( data ) {
            sessionStorage.setItem('currenttrcversion', data.version.string);
            sessionStorage.setItem('currentsentinelversion', data.sentinelversion.string);
            var currentdate = new Date();
            currentdate = new Date(currentdate.getTime() + 15*60000);
            sessionStorage.setItem('nexttrcversion', currentdate.getTime());
            trcversionsemaphore = false;
            displaytrcVersion(data.version.string,data.sentinelversion.string);
        });
        trcversion = trcversiondefault;
        sentinelversion = sentinelversiondefault;
    }
    else {
        if (trcversion === null) {
            trcversion = trcversiondefault;
        }
        if (sentinelversion === null) {
            sentinelversion = sentinelversiondefault;
        }
        displaytrcVersion(trcversion,sentinelversion);
    }
    if ((trcversion.length > 2) && (trcversion.substr(trcversion.length - 2) == ".0")) {
        trcversioncheck = trcversion.substr(0,trcversion.length-2);
    }
    else {
        trcversioncheck = trcversion;
    }
    return trcversioncheck;
};

function getVoteLimit() {
    $.getJSON("/data/votelimit-" + trcninjatestnet+".json", function (data) {
        var cls = "panel-red";
        if (data.data.votelimit.nextvote.BlockTime == 0) {
            var datevotelimit = new Date(data.data.votelimit.nextsuperblock.BlockTime * 1000);
            $('#nextvotelimithr').text( "Too late! Superblock on "+datevotelimit.toLocaleString());
        }
        else {
            $('#nextvotelimithr').text(deltaTimeStampHRlong(data.data.votelimit.nextvote.BlockTime, currenttimestamp()));
            if ((data.data.votelimit.nextvote.BlockTime - currenttimestamp()) <= 86400) {
                cls = "panel-yellow";
            }
            else {
                cls = "panel-green";
            }
        }
        $('#nextvotepanel').removeClass("panel-green").removeClass("panel-red").removeClass("panel-yellow").addClass(cls);
    });
};


$(document).ready(function() {

    $('#trcninjajsversion').text(trcninjaversion).addClass("label-info").removeClass("label-danger");

    if (trcninjatestnet == 1) {
        $('#testnetalert').show();
    }

    if (typeof trcninjator !== 'undefined') {
        $('a[name=trcninjatorurl]').attr("href", "http://" + trcninjator + "/masternodes.html");
        $('span[name=trcninjatordisplay]').show();
    }

    if (typeof trcninjai2p !== 'undefined') {
        $('a[name=trcninjai2purl]').attr("href", "http://" + trcninjai2p + "/masternodes.html");
        $('span[name=trcninjai2pdisplay]').show();
    }

    getLatesttrcVersion();
    getVoteLimit();

    var pkutxt = '<ul>';
    var ix = 0;
    for (var i = 0, ien = trcninjamndetail[trcninjatestnet].length; i < ien; i++) {
        if (ix == 0) {
            pkutxt += '<li>[Link]';
        } else {
            pkutxt += '<li>[' + ix + ']';
        }
        pkutxt += ' ' + trcninjamndetail[trcninjatestnet][i][1] + "</li>";
        ix++;
    }
    for (var i = 0, ien = trcninjaaddressexplorer[trcninjatestnet].length; i < ien; i++) {
        if (ix == 0) {
            pkutxt += '<li>[Link]';
        } else {
            pkutxt += '<li>[' + ix + ']';
        }
        pkutxt += ' ' + trcninjaaddressexplorer[trcninjatestnet][i][1] + "</li>";
        ix++;
    }
    pkutxt += '</ul>';
    $("#pubkeyurllist").html(pkutxt);

    $('#localnodes').on('xhr.dt', function (e, settings, json) {
        var date = new Date(json.data.cache.time*1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#localnodesLR').text(n + ' ' + time);
        $('#localnodes').DataTable().column(1).search('^(?:(?!Disabled).)*$', true, false).draw();
        $('#localnodesLRHR').text( deltaTimeStampHRlong(json.data.cache.time, currenttimestamp())+" ago");
    });
    tableLocalNodes = $('#localnodes').dataTable({
        responsive: true,
        searching: false,
        dom: "Tfrtp",
        ajax: { url: "/data/nodesstatus-"+trcninjatestnet+".json",
            dataSrc: 'data.nodes' },
        "paging": false,
        columns: [
            {data: "NodeName"},
            {
                data: null, render: function (data, type, row) {
                if (data.NodeEnabled == 0) {
                    return '<img src="/static/status/daemon-disabled.png" width=16 height=16 /> Disabled';
                }
                else {
                    var iconurl = '<img src="/static/status/daemon-' + data.NodeProcessStatus + '.png" width=16 height=16 /> ';
                    if (data.NodeProcessStatus == 'running') {
                        return iconurl + 'Running';
                    } else if (data.NodeProcessStatus == 'stopped') {
                        return iconurl + 'Stopped';
                    } else if (data.NodeProcessStatus == 'notresponding') {
                        return iconurl + 'Not Responding';
                    } else {
                        return data.NodeProcessStatus;
                    }
                }
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeVersion;
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeProtocol;
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeBlocks;
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    if (type != 'sort') {
                        if (trcninjablockexplorer[trcninjatestnet].length > 0) {
                            outtxt += '<a href="' + trcninjablockexplorer[trcninjatestnet][0][0].replace('%%b%%', data.NodeLastBlockHash) + '">' + data.NodeLastBlockHash + '</a>';
                            for (var i = 1, ien = trcninjablockexplorer[trcninjatestnet].length; i < ien; i++) {
                                outtxt += '<a href="' + trcninjablockexplorer[trcninjatestnet][i][0].replace('%%b%%', data.NodeLastBlockHash) + '">[' + i + ']</a>';
                            }
                        }
                    }
                    else {
                        outtxt = data.NodeLastBlockHash;
                    }
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeConnections;
                }
                return outtxt;
            }
            }
        ]
    });
    setTimeout(tableLocalNodesRefresh, 60000);

    $('#blockconsensus').on('xhr.dt', function (e, settings, json) {
        var date = new Date(json.data.cache.time*1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#blockconsensusLR').text(n + ' ' + time);
        $('#blockconsensusLRHR').text( deltaTimeStampHRlong(json.data.cache.time, currenttimestamp())+" ago");
    });
    tableBlockConsensus = $('#blockconsensus').dataTable({
        dom: "Trtp",
        responsive: true,
        searching: false,
        ajax: { url: "/data/blocksconsensus-"+trcninjatestnet+".json",
            dataSrc: 'data.blocksconsensus' },
        "paging": false,
        "order": [[0, "desc"]],
        columns: [
            {data: "BlockID"},
            {
                data: null, render: function (data, type, row) {
                return (Math.round(data.Consensus * 10000) / 100) + '%';
            }
            },
            {
                data: null, render: function (data, type, row) {
                if (data.ConsensusPubKey == '') {
                    return "<i>None</i>";
                } else {
                    return data.ConsensusPubKey;
                }
            }
            },
            {
                data: null, render: function (data, type, row) {
                var str = '<ul>';
                var sstr = '';
                for (var col in data.Others) {
                    str += '<li>';
                    if (data.Others[col].Payee == '') {
                        str += '<i>None</i>';
                    } else {
                        str += data.Others[col].Payee;
                    }
                    str += ' (' + (Math.round(data.Others[col].RatioVotes * 10000) / 100) + '% - Nodes: ';
                    sstr = '';
                    for (var uname in data.Others[col].NodeNames) {
                        if (sstr != '') {
                            sstr += ' ';
                        }
                        sstr += data.Others[col].NodeNames[uname];
                    }
                    str += sstr + ')</li>'
                }
                ;
                return str + '</ul>';
            }
            }
        ],
        "createdRow": function (row, data, index) {
            if (data.Consensus == 1) {
                $('td', row).eq(1).css({"background-color": "#a5ddad"});
            } else {
                $('td', row).eq(1).css({"background-color": "#FF8F8F"});
            }
        }
    });
    setTimeout(tableBlockConsensusRefresh, 150000);

    chartMNVersions = $('#mnversions').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,//null,
            plotShadow: false
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Masternode version',
            data: [['Unknown', 100]]
        }]
    });

    $('#mnregexp').on('keyup click', function () {
        $('#mnlist').DataTable().search($('#mnregexp').val(), true, false).draw();
    });

    $('#mnregexp').val(getParameter("mnregexp"));

    $('#mnlist').on('xhr.dt', function ( e, settings, json ) {
        var date = new Date(json.data.cache.time*1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        var activeCount = 0;
        var uniqueIPs = [];
        $('#mnlistLR').text( n + ' ' + time);
        $('#mnlistLRHR').text( deltaTimeStampHRlong(json.data.cache.time, currenttimestamp())+" ago");
        var versioninfo = 'Unknown';
        var dataVersionCount = [];
        var mnregexp = $('#mnregexp').val();
        for ( var i=0, ien=json.data.masternodes.length ; i<ien ; i++ ) {
            if (parseInt(json.data.masternodes[i].MasternodeProtocol) > trcmaxprotocol) {
                trcmaxprotocol = parseInt(json.data.masternodes[i].MasternodeProtocol);
            }
            if (json.data.masternodes[i].ActiveCount > 0) {
                activeCount++;
            }
            if (uniqueIPs.indexOf(json.data.masternodes[i].MasternodeIP+":"+json.data.masternodes[i].MasternodePort) == -1) {
                uniqueIPs.push( json.data.masternodes[i].MasternodeIP+":"+json.data.masternodes[i].MasternodePort );
            }
            if ((json.data.masternodes[i].Portcheck != false) && json.data.masternodes[i].Portcheck.hasOwnProperty("SubVer")) {
                var patt = /^\/.*:([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+).*\/$/;
                if (patt.test(json.data.masternodes[i].Portcheck.SubVer)) {
                    var match = patt.exec(json.data.masternodes[i].Portcheck.SubVer);
                    versioninfo = match[1];
                }
                else if ((json.data.masternodes[i].Portcheck.SubVer.length > 11) && (json.data.masternodes[i].Portcheck.SubVer.substring(0,16) == '/Terracoin Core:') && (json.data.masternodes[i].Portcheck.SubVer.substring(json.data.masternodes[i].Portcheck.SubVer.length-1) == '/')) {
                    versioninfo = json.data.masternodes[i].Portcheck.SubVer.substring(11,json.data.masternodes[i].Portcheck.SubVer.indexOf('/',11));
                }
                else {
                    versioninfo = "Unknown";
                }
            }
            else {
                versioninfo = "Unknown";
            }
            versioninfo = versioninfo+" ("+json.data.masternodes[i].MasternodeProtocol+")";
            if (dataVersionCount.hasOwnProperty(versioninfo)) {
                dataVersionCount[versioninfo]++;
            }
            else {
                dataVersionCount[versioninfo] = 1;
            }
        }

        var dataSet = [];
        for (version in dataVersionCount) {
            if (dataVersionCount.hasOwnProperty(version)) {
                dataSet.push( [version, Math.round((dataVersionCount[version]/json.data.masternodes.length)*10000)/100] );
            }
        }
        chartMNVersions = $('#mnversions').highcharts();
        chartMNVersions.series[0].setData(dataSet,true);

        var inactiveCount = json.data.masternodes.length - activeCount;

        $('#mnactive').text( activeCount );
        $('#mninactive').text( inactiveCount );
        $('#mntotal').text( json.data.masternodes.length );
        $('#uniquemnips').text( uniqueIPs.length );

        if (mnregexp != "") {
            $('#mnlist').DataTable().search(mnregexp, true, false).draw();
        }
    } );
    tableMNList = $('#mnlist').dataTable( {
        ajax: { url: "/data/masternodeslistfull-"+trcninjatestnet+".json",
                dataSrc: 'data.masternodes' },
        lengthMenu: [ [50, 100, 250, 500, -1], [50, 100, 250, 500, "All"] ],
        processing: true,
        pageLength: 50,
        columns: [
            { data: null, render: function ( data, type, row ) {
                var outtxt = '';
                if (type != 'sort') {
                    if ((trcninjamndetailvin[trcninjatestnet].length > 0) || (trcninjatxexplorer[trcninjatestnet].length > 0)) {
                        var ix = 0;
                        for ( var i=0, ien=trcninjamndetailvin[trcninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+trcninjamndetailvin[trcninjatestnet][0][0].replace('%%a%%',data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex)+'">'+data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+trcninjamndetailvin[trcninjatestnet][i][0].replace('%%a%%',data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                        for ( var i=0, ien=trcninjatxexplorer[trcninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+trcninjatxexplorer[trcninjatestnet][0][0].replace('%%a%%',data.MasternodeOutputHash)+'">'+data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+trcninjatxexplorer[trcninjatestnet][i][0].replace('%%a%%',data.MasternodeOutputHash)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                    }
                    else {
                        outtxt = data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex;
                    }
                }
                else {
                    outtxt = data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex;
                }
                return outtxt;
            } },
            { data: null, render: function ( data, type, row) {
                var outtxt = '';
                if (type != 'sort') {
                    if ((trcninjamndetail[trcninjatestnet].length > 0) || (trcninjaaddressexplorer[trcninjatestnet].length > 0)) {
                        var ix = 0;
                        for ( var i=0, ien=trcninjamndetail[trcninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+trcninjamndetail[trcninjatestnet][0][0].replace('%%a%%',data.MasternodePubkey)+'">'+data.MasternodePubkey+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+trcninjamndetail[trcninjatestnet][i][0].replace('%%a%%',data.MasternodePubkey)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                        for ( var i=0, ien=trcninjaaddressexplorer[trcninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+trcninjaaddressexplorer[trcninjatestnet][0][0].replace('%%a%%',data.MasternodePubkey)+'">'+data.MasternodePubkey+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+trcninjaaddressexplorer[trcninjatestnet][i][0].replace('%%a%%',data.MasternodePubkey)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                    }
                    else {
                        outtxt = data.MasternodePubkey;
                    }
                }
                else {
                    outtxt = data.MasternodePubkey;
                }
                return outtxt;
            } },
            { data: null, render: function ( data, type, row ) {
                var mnip = "";
                if ( data.MasternodeIP == "::" ) {
                    mnip = data.MasternodeTor+".onion";
                }
                else {
                    mnip = data.MasternodeIP;
                }
                return mnip+':'+data.MasternodePort;
            } },
            { data: null, render: function ( data, type, row ) {
                var txt = "";
                if (data.Portcheck != false) {
                    txt = data.Portcheck.Result;
                    if ((data.Portcheck.Result == 'closed') || (data.Portcheck.Result == 'timeout')) {
                        txt = "Closed";
                    } else if (data.Portcheck.Result == 'unknown') {
                        txt = "Pending";
                    } else if ((data.Portcheck.Result == 'open') || (data.Portcheck.Result == 'rogue')) {
                        txt = "Open";
                    }
                    if (data.Portcheck.NextCheck < currenttimestamp()) {
                        if (txt != "Pending") {
                            txt = txt + ' (Re-check pending)';
                        }
                    }
                    else {
                        txt = txt + ' (' + deltaTimeStampHR(data.Portcheck.NextCheck,currenttimestamp())+')';
                    }
                }
                else {
                    txt = "<i>Unknown</i>";
                }
                return txt;
            } },
            { data: null, render: function ( data, type, row ) {
                var versioninfo = '<i>Unknown</i>';
                if ((data.Portcheck != false) && data.Portcheck.hasOwnProperty("SubVer")) {
                    var patt = /^\/.*:([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+).*\/$/;
                    if (patt.test(data.Portcheck.SubVer)) {
                        var match = patt.exec(data.Portcheck.SubVer);
                        versioninfo = match[1];
                    }
                    else if ((data.Portcheck.SubVer.length > 11) && (data.Portcheck.SubVer.substring(0,16) == '/Terracoin Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
                        versioninfo = data.Portcheck.SubVer.substring(11,data.Portcheck.SubVer.indexOf('/',11));
                    }
                }
                return versioninfo;
            } },
            { data: null, render: function ( data, type, row ) {
                return data.MasternodeProtocol;
            } },
            { data: null, render: function ( data, type, row) {
                var balance = parseFloat(data.Balance.Value);
                if (type == 'sort') {
                    return balance;
                }
                else {
                    var num = Math.round( balance * 1000 ) / 1000;
                    return addCommas( num.toFixed(3) );
                }
            } },
            { data: null, render: function ( data, type, row) {
                var lastpaid = parseInt(data.MasternodeLastPaid);
                if (lastpaid > 0) {
                    if (type == 'sort') {
                        return lastpaid;
                    }
                    else {
                        var outtxt = '';
                        outtxt = deltaTimeStampHR(lastpaid,currenttimestamp());
                        return outtxt;
                    }
                }
                else {
                    if (type == 'sort') {
                        return 0;
                    }
                    else {
                        return 'Never/Unknown';
                    }
                }
            } },
            { data: null, render: function ( data, type, row) {
                var activeseconds = parseInt(data.MasternodeActiveSeconds);
                if (type == 'sort') {
                    return activeseconds;
                } else if (activeseconds < 0) {
                    return 'Just now ('+activeseconds+')';
                }
                else {
                    return diffHR(activeseconds);
                }
            } },
            { data: null, render: function ( data, type, row) {
                if (type == 'sort') {
                    return data.MasternodeLastSeen;
                } else if (data.MasternodeLastSeen > 0) {
                    return deltaTimeStampHR(data.MasternodeLastSeen,currenttimestamp());
                } else {
                    return '';
                }
            } },
            { data: null, render: function ( data, type, row) {
                var activecount = parseInt(data.ActiveCount);
                var inactivecount = parseInt(data.InactiveCount);
                var unlistedcount = parseInt(data.UnlistedCount);
                var total = activecount+inactivecount+unlistedcount;
                var ratio = activecount / total;
                var result = ratio;
                if (type == 'sort') {
                    result =  ratio;
                } else {
                    if ( ratio == 1 ) {
                        result = 'Active';
                    } else if ( ratio == 0 ) {
                        result = 'Inactive';
                    } else if ( unlistedcount > 0 ) {
                        result = 'Partially Unlisted';
                    } else {
                        result = 'Partially Inactive';
                    }
                    result += ' ('+Math.round(ratio*100)+'%)';
                }
                return result;
            } },
        ],
        "createdRow": function ( row, data, index ) {
            trcversioncheck = getLatesttrcVersion();
            var color = '#FF8F8F';
            if ( data.Portcheck == false ) {
                color = '#8F8F8F';
            }
            else {
                if (( data.Portcheck.Result == 'open' ) || ( data.Portcheck.Result == 'rogue' )) {
                    color = '#a5ddad';
                } else if (data.Portcheck.Result == 'unknown') {
                    color = '#8F8F8F';
                }
            }
            $('td',row).eq(3).css({"background-color":color,"text-align": "center"});
            color = '#a5ddad';
            if ( data.Balance.Value < 1000 ) {
                color = '#FF8F8F';
            }
            $('td',row).eq(6).css({"background-color":color,"text-align": "right"});
            var versioninfo = "Unknown";
            if ((data.Portcheck != false) && data.Portcheck.hasOwnProperty("SubVer")) {
                var patt = /^\/.*:([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+).*\/$/;
                if (patt.test(data.Portcheck.SubVer)) {
                    var match = patt.exec(data.Portcheck.SubVer);
                    versioninfo = match[1];
                }
                else if ((data.Portcheck.SubVer.length > 11) && (data.Portcheck.SubVer.substring(0, 16) == '/Terracoin Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = data.Portcheck.SubVer.substring(11, data.Portcheck.SubVer.indexOf('/', 11));
                }
            }
            if ( versioninfo == "Unknown" ) {
                color = '#8F8F8F';
            }
            else if ( ( versioninfo.substring(0,5) == "0.10." ) || ( versioninfo.substring(0,7) == "0.11." ) ) {
                color = '#FF8F8F';
            }
            else if ( versioninfo == trcversioncheck ) {
                color = '#a5ddad';
            }
            else {
                color = '#FFFF8F';
            }
            $('td',row).eq(4).css({"background-color":color});
            var curprotocol = parseInt(data.MasternodeProtocol);
            if ( curprotocol < 70102 ) {
                color = '#FF8F8F';
            }
            else if ( curprotocol == trcmaxprotocol ) {
                color = '#a5ddad';
            }
            else {
                color = '#FFFF8F';
            }
            $('td',row).eq(5).css({"background-color":color,"text-align": "right"});
            var total = data.ActiveCount+data.InactiveCount+data.UnlistedCount;
            var activecount = parseInt(data.ActiveCount);
            var inactivecount = parseInt(data.InactiveCount);
            var unlistedcount = parseInt(data.UnlistedCount);
            var total = activecount+inactivecount+unlistedcount;
            var ratio = activecount / total;
            if (ratio == 1) {
                color = '#a5ddad';
            } else if (ratio == 0) {
                color = '#FF8F8F';
            } else if (ratio < 0.5) {
                color = '#ffcb8f';
            } else {
                color = '#FFFF8F';
            }
            $('td',row).eq(10).css({"background-color":color,"text-align": "center"});
        }
    } );
    var mnlistsize = getParameter("mnlistsize");
    if (mnlistsize != "") {
        $('#mnlist').DataTable().page.len(parseInt(mnlistsize));
    }


    setTimeout(tableMNListRefresh, 300000);

    //mnpaymentsRefresh();

});
