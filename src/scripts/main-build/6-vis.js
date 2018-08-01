// main visibility API function
// use visibility API to check if current tab is active or not
// if not stop animation
var vis = (function(){
    var stateKey,
        eventKey,
        keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    };
})();
// check if current tab is active or not
vis(function(){

    if(vis()&&!lock){

        // tween resume() code goes here
        scrolledElements();
        setTimeout(function(){
                console.log("tab is visible and has focus");
            },300);

    } else {

        // tween pause() code goes here
        $(selectedElements).each(function() {
            $(this).data("controle")("pause");
        });
        console.log("tab is invisible and has blur");
    }
});
