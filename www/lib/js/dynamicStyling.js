// Calculate aspect value
var AspectValue = getAspectValue();

// Initial adjustment
adjustDivWidth();
adjustMenuButtons();
adjustNavigationButtons();
adjustMapHeight();

function adjustDivWidth()
{
    var windowWidth = $(window).width();
    var Divs = document.getElementsByClassName("cDiv");
    if (windowWidth > 700)
    {
        for (var i = 0; i < Divs.length; i++)
        {
            Divs[i].style.width = "80%";//Math.round(windowWidth * 0.8) + "px";
        }
        document.getElementById("Head1").style.width = "80%";//Math.round(windowWidth * 0.8) + "px";
    }
    else
    {
        for (var i = 0; i < Divs.length; i++) {
            Divs[i].style.width = "100%";//windowWidth + "px";
        }
        document.getElementById("Head1").style.width = "100%";//windowWidth + "px";
    }

}

function getAspectValue() {
    var sSpan = document.createElement("span");
    sSpan.textContent = "wertzuiopasdfghjklyxcvbnm";
    document.body.appendChild(sSpan);
    var xWidth = Math.round(sSpan.offsetWidth / sSpan.textContent.length);
    console.log("x-Width: " + xWidth);
    sSpan.textContent = "QWERTZUIOPASDFGHJKLYXCVBNM";
    var XWidth = Math.round(sSpan.offsetWidth / sSpan.textContent.length);
    console.log("X-Width: " + XWidth);
    var XHeight = Math.round(sSpan.offsetHeight);
    console.log("X-Height: " + XHeight);
    var aspectValue = xWidth / XWidth;
    console.log("Aspect value: " + aspectValue);
    document.body.removeChild(sSpan);
    return aspectValue;
}

// Dynamic adjustment of font-size for menu buttons
function adjustMenuButtons ()
{
    // Check width of buttons:
    var Buttons = document.getElementsByClassName("menuButton");
    var maxLength = Buttons[0].textContent.length;
    for (var i = 0; i < Buttons.length; i++) {
        if (maxLength < Buttons[i].textContent.length) {
            maxLength = Buttons[i].textContent.length;
        }
    }
    var fS = Math.round((Buttons[0].offsetWidth - 15)* (1 / AspectValue) / maxLength); //Math.round(Buttons[0].offsetWidth * 1.7 / mLength);
    var newHeight = Math.round(Buttons[0].offsetWidth * (1 / AspectValue) / maxLength + 20);
    console.log("Fontsize after width check: " + fS);
    $(".menuButton").css("height", newHeight);
                        
    // Check height of buttons:
    var maxHeight = $(".menuButton").css("max-height").substring(0, ($(".menuButton").css("max-height").length - 2));
    var maxFontSize = maxHeight - 20;
    if (fS > maxFontSize) {
        fS = maxFontSize;
    }
    console.log("Fontsize after height check: " + fS);
    $(".menuButton").css("font-size", fS);
}

// Dynamic adjustment of font size for navigation buttons, titles and description
function adjustNavigationButtons()
{
    // Check width of buttons:
    var lButtons = document.getElementsByClassName("levelButton");
    var mLength = lButtons[0].textContent.length;
    for (var i = 0; i < lButtons.length; i++) {
        if (mLength < lButtons[i].textContent.length) {
            mLength = lButtons[i].textContent.length;
        }
    }
    var FS = Math.round((lButtons[0].offsetWidth - 15) * (1 / AspectValue) / mLength);
    var nHeight = Math.round(lButtons[0].offsetWidth * (1 / AspectValue) / mLength + 20);
    $(".levelButton").css("height", nHeight);
    console.log("FontSize after checking button width " + lButtons[0].offsetWidth + " is " + FS);

    // Check height of buttons:
    var mHeight = $(".levelButton").css("max-height").substring(0, ($(".levelButton").css("max-height").length - 2));
    var mFontSize = mHeight - 20;
    if (FS > mFontSize) {
        FS = mFontSize;
    }

    $(".levelButton").css("font-size", FS);
    console.log("FontSize after checking max font size " + mFontSize + " is " + FS);

    // Set font size for titles
    if (FS < 12) {
        $(".Title").css("font-size", 12);
    }
    else {
        $(".Title").css("font-size", FS + 2);
    }
    console.log("Font size of title is " + $(".Title").css("font-size"));

    // Set font size for description
    if (FS < 12) {
        $("#dDescription").css("font-size", 12);
    }
    else {
        $("#dDescription").css("font-size", FS + 2);
    }
    console.log("Font size of description is " + $("#dDescription").css("font-size"));
}

// Dynamic adjustment of the map size
function adjustMapHeight() {
    var mapCanvas = document.getElementById("map-canvas");
    var winH = $(window).height() / 2 | 0;
    mapCanvas.style.height = winH + "px";
    console.log("Window height: " + $(window).height() + ", window width: " + $(window).width() + ", map height: " + winH);
}

// Catch orientationchange event
window.addEventListener("orientationchange", function () {
    

    // Get current center of the map
    var coords = map.get("center");
    console.log("Map center coordinates " + coords);
    var latlng = coords.toString().split(",");

    // Adjust width and font sizes
    // Remember, which block is being shown
    var cDivs = document.getElementsByClassName("cDiv");
    var cDivShow;
    for (var i = 0; i < cDivs.length; i++) {
        if (cDivs[i].style.display == "block")
        {
            cDivShow = i;
        }
    }
    // Load all blocks to adjust
    for (var i = 0; i < cDivs.length; i++) {
        cDivs[i].style.display = "block";
        cDivs[i].style.visibility = "hidden";
    }
    // Adjust
    adjustDivWidth();
    adjustMenuButtons();
    adjustNavigationButtons();
    adjustMapHeight();
    if (coords != null) {
		console.log("coords has value " + coords);    
        // Update map
        google.maps.event.addDomListener(window, 'load', initialize(latlng[0], latlng[1], false));
        map.set("center", coords);
        marker.set("position", coords);
        console.log("Map has been changed!");
    }
    // Load block, which was being shown
    for (var i = 0; i < cDivs.length; i++) {
        if (i == cDivShow)
        {
            cDivs[i].style.display = "block";
            cDivs[i].style.visibility = "visible";
        }
        else {
            cDivs[i].style.display = "none";
            cDivs[i].style.visibility = "visible";
        }
    }           
}, false);