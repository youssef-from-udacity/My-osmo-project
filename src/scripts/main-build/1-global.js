var selectedElements = [];
var selectedvideos = [];
var lock = false;
var smallScreen = $(window).width() < 768;

// load appropriate function according to width of device
function appropriateDevice(){
    if (smallScreen) {
        smallDevice();
    }else{
        bigDevice();
        }
}
appropriateDevice();
modelForWorker();

var myModal = $("#myModal");

//pause animation to start modal
myModal.on("show.bs.modal", function() {
    lock = true;
    $(selectedElements).each(function() {
        $(this).data("controle")("pause");
    });
});

//change the modal opcaity to 1
myModal.on("shown.bs.modal", function() {
    $('.modal-backdrop.in').css('opacity', '1');
});

//pause a youtube video if modal is closed and then resume animation
myModal.on("hidden.bs.modal", function() {
    lock = false;
    $("#videoPlayer")[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    scrolledElements();
});
