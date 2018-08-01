var navbarHeight;
var height;

function getHeight() {
    navbarHeight = $("#navbar-fixed-top").height();
    height = $(window).height();
}
getHeight();
$(window).on('resize', getHeight);

// check if element is in view port
$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop() + (height / 4) + navbarHeight;
    var viewportBottom = viewportTop + (height / 2) - navbarHeight;


    return elementBottom > viewportTop &&
        elementBottom < viewportBottom ||
        elementTop > viewportTop &&
        elementTop < viewportBottom ||
        elementTop < viewportTop &&
        elementBottom > viewportBottom;
};

// to play or pause a video
function pauseOrPlayVideo(element) {
    return function(state) {
        if (state === 'pause') {
            element.get(0).pause();
        } else {
            element.get(0).play();
        }
    };
}

var streamingElement = selectedElements[0];
var ticking = false;
var delay = false;
var isScrolling;

$(window).on('resize scroll', function() {
    // pause all videos before checking if they are in the veiwport
    if (!delay) {
        $(streamingElement).data("controle")("pause");
        delay = true;
        window.setTimeout(function() {
            delay = false
        }, 400);
    }

    window.clearTimeout(isScrolling);
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                scrolledElements();
                ticking = false;
            });
            ticking = true;
        }

    }, 400);
});
// append the funciton pauseOrPlayVideo to each video node data
$(selectedvideos).each(function(index) {
    var element = $(this);
    element.data("controle", pauseOrPlayVideo(element));
    selectedElements.push(element);
});
// if scrolled elements is within view port play oe pause them otherwise
function scrolledElements() {
    $(selectedElements).each(function(index) {
        var element = $(this);
        if (element.isInViewport() && !lock) {
            element.data("controle")("play");
            streamingElement = element;
            return false;
        } else {
            element.data("controle")("pause");
        }
    });
}
