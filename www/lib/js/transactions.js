// Info parameters
var windowHeight = $(window).height() + "px";

// Google map variables
var map;
var marker;
var loaded = false;

// View models

var Transactions = ko.observableArray();

var Positions = ko.observableArray();
// Variables, used in loading additional positions
var ProjectID;
var pageIndex = 2;
var inProgress = false;

var dPosition = ko.observableArray(); //{ ID: 109773, ImageUrl: "lib/img/img.png", Title: "1 Elektro-Heckenschere", Description: "Fabr. Bosch, Typ P80L, 220 V", Lat: "51.75688", Lng: "8.06687" }]);

function loadTransactions(cMode)
{    
    // Load Transactions
    // Method declaration: public void GetVerwertungList(int Mode, string Sprache, string Callback)
    $.jmsajaxurl = function (options) {
        var url = options.url;
        url += "/" + options.method;
        if (options.data) {
            var data = ""; for (var i in options.data) {
                if (data != "")
                    data += "&"; data += i + "=" +
                            msJSON.stringify(options.data[i]);
            }
            url += "?" + data; data = null; options.data = "{}";
        }
        return url;
    };

    var url = $.jmsajaxurl({
        url: "http://iratdev.symhosting.net/Frontend/Irat/Services/AppLoading.asmx",
        method: "GetVerwertungList",
        data: { Mode: cMode, Sprache: "de-DE" },
        jsoncallback: "Callback"
    });

    $.ajax({
        //cache: false,
        dataType: "jsonp",
        success: function (data) {
            var i = 0;
            while (data[i]) {
                Transactions.push(data[i]);
                i++;
            }
            console.log("Transactions were loaded!!!");
        },
        url: url + "&format=json"
    });

    // Hide TransactionsDiv
    document.getElementById("TransactionsDiv").style.display = "none";

    // Show transactionListDiv
    document.getElementById("transactionListDiv").style.display = "block";

}

// Catch scrolling of window
$(window).scroll(
    function () {
        if (!inProgress)
        {
            if (document.getElementById("positionListDiv").style.display == "block" && ($(window).scrollTop() + $(window).height()) >= ($(document).height() - 200))
            {
                console.log("The page " + pageIndex + " of positions is being loaded!");
                inProgress = true;

                // Load additional positions 
                $.jmsajaxurl = function (options) {
                    var url = options.url;
                    url += "/" + options.method;
                    if (options.data) {
                        var data = ""; for (var i in options.data) {
                            if (data != "")
                                data += "&"; data += i + "=" +
                                        msJSON.stringify(options.data[i]);
                        }
                        url += "?" + data; data = null; options.data = "{}";
                    }
                    return url;
                };

                var url = $.jmsajaxurl({
                    url: "http://iratdev.symhosting.net/Frontend/Irat/Services/AppLoading.asmx",
                    method: "GetPositionList",
                    data: { projectID: ProjectID, Sprache: "de-DE", PageIndex: pageIndex },
                    jsoncallback: "Callback"
                });

                $.ajax({
                    //cache: false,
                    dataType: "jsonp",
                    success: function (data) {
                        var i = 0;
                        while (data[i]) {
                            Positions.push(data[i]);
                            inProgress = false;
                            i++;
                        }
                        console.log("Positions were loaded!!!");
                    },
                    url: url + "&format=json"
                });
                pageIndex++;

                // Check, whether there are more additional positions

                if (true) {

                }
            }
        }
    });

function loadPositions(cTransaction)
{        
    // Load Positions
    // Method declaration: public void GetPositionList(int ProjectID, string Sprache, int PageIndex, string Callback)    
    ProjectID = ko.dataFor(cTransaction).ID;
    console.log(ProjectID);
    $.jmsajaxurl = function (options) {
        var url = options.url;
        url += "/" + options.method;
        if (options.data) {
            var data = ""; for (var i in options.data) {
                if (data != "")
                    data += "&"; data += i + "=" +
                            msJSON.stringify(options.data[i]);
            }
            url += "?" + data; data = null; options.data = "{}";
        }
        return url;
    };

    var url = $.jmsajaxurl({
        url: "http://iratdev.symhosting.net/Frontend/Irat/Services/AppLoading.asmx",
        method: "GetPositionList",
        data: { projectID: ProjectID, Sprache: "de-DE", PageIndex: 1 },
        jsoncallback: "Callback"
        });

    $.ajax({
        //cache: false,
        dataType: "jsonp",
        success: function (data) {
            var i = 0;
            while (data[i])
            {
                Positions.push(data[i]);
                i++;
            }
            console.log("Positions were loaded!!!");
        },
        url: url + "&format=json"
    });

    // Hide transactionListDiv
    document.getElementById("transactionListDiv").style.display = "none";

    // Show positionListDiv
    document.getElementById("positionListDiv").style.display = "block";
    
}

function loadPositionDetails(cPosition)
{    
    // Prepare latitude and longitude
    var LatLng = (ko.dataFor(cPosition).Location).split(",");

    // Prepare image url
    var imageUrl = (ko.dataFor(cPosition).ImageUrl).replace("size=m", "size=l");


    // Load position details
    dPosition.push({ ID: ko.dataFor(cPosition).ID, ImageUrl: imageUrl, Title: ko.dataFor(cPosition).Title, Description: ko.dataFor(cPosition).Description, Lat: LatLng[0], Lng: LatLng[1] });
    console.log(dPosition()[0].ID + " " + dPosition()[0].Title + " " + dPosition()[0].Description + " " + dPosition()[0].Lat + " " + dPosition()[0].Lng);
    console.log("Position details were loaded!");

    // Load map
    google.maps.event.addDomListener(window, 'load', initialize(LatLng[0], LatLng[1], loaded));
    if (!loaded)
    {
        loaded = true;
        console.log("loaded was set to true!");
    }    

    // Hide positionListDiv
    document.getElementById("positionListDiv").style.display = "none";
    
    // Show positionDiv       
    document.getElementById("positionDiv").style.display = "block";
}

// Initialize the map
function initialize(lat, lng, loaded)
{
    var coordinates = new google.maps.LatLng(lat, lng);
    console.log("loaded: " + loaded);
    if (!loaded)
    {
        console.log("Map is being loaded for the first time!");
        var mapOptions = {
            center: coordinates,
            zoom: 16,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        marker = new google.maps.Marker({
            position: coordinates,
            icon: 'lib/img/punkt.png',
            map: map,
            //title: "IRat"
        });
    }
    else
    {
        console.log("Map is being changed!");
        map.set("center", coordinates);
        marker.set("position", coordinates);
    }
    
}


function goToLevel(fromLevel,toLevel)
{
    console.log("dPosition: " + dPosition().length + " Positions: " + Positions().length + " Transactions: " + Transactions().length);
    switch (toLevel)
    {
        case 0:
            if (dPosition().length > 0)
            {
                dPosition.removeAll();
            }
            if (Positions().length > 0)
            {
                Positions.removeAll();
                pageIndex = 2;
            } 
            if (Transactions().length > 0)
            {
                Transactions.removeAll();
            } 
            document.getElementById(fromLevel).style.display = "none";
            document.getElementById("TransactionsDiv").style.display = "block";
            break;
        case 1:
            if (dPosition().length > 0)
            {
                dPosition.removeAll();
            }
            if (Positions().length > 0)
            {
                Positions.removeAll();
                pageIndex = 2;
            }
            if (Transactions().length > 0) {
                Transactions.push(Transactions.pop());
            } 
            document.getElementById(fromLevel).style.display = "none";
            document.getElementById("transactionListDiv").style.display = "block";
            break;
        case 2:
            if (dPosition().length > 0)
            {
                dPosition.removeAll();
            }     
            if (Positions().length > 0)
            {
                Positions.push(Positions.pop());
            } 
            document.getElementById(fromLevel).style.display = "none";
            document.getElementById("positionListDiv").style.display = "block";
            break;
        default:
    }
}
