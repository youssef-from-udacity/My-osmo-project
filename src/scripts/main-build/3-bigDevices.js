function bigDevice() {
    var menugame = $("#menu-game");
    var collectVideos = $("video");
    collectVideos.each(function(i, element) {
        selectedvideos.push(element);
        selectedElements.push(element);
    });
    // check if menu game is expanded
    function isMenugameExpanded() {
        if (menugame.attr("aria-expanded") === "true") {
            return true;
        } else {
            return false;
        }
    }
    //pause or play a video to start menugame animation
    menugame.click(function() {
        if (isMenugameExpanded()) {
            lock = false;
            scrolledElements();
        } else {
            lock = true;
            $(selectedElements).each(function() {
                $(this).data("controle")("pause");
            });
        }
    });
}

// load the iframe
function loadIframe() {
    $("iframe").each(function(i, element) {
        element.setAttribute("src", element.getAttribute("data-src"));
        $("#palyButton").show();
    });
}
