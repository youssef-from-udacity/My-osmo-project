// for smallDevices
function smallDevice(){
    loadPhotos();
    var navbar = $("#navigation-btn");
    var selectCarousel = $(".carousel");
    var collectVideos = $("video:not(#main-video)");
    collectVideos.each(function(i,element){selectedvideos.push(element);});

    function carouselControl(state){
        if(state==='pause'){selectCarousel.carousel('pause');}
            else{selectCarousel.carousel('cycle');}
    }

    selectCarousel.data("controle", carouselControl);
    selectedElements.push(selectCarousel);

    function isSidebarExpanded(){
        if (navbar.attr("aria-expanded")==="false"){
            return false; }
            else {
                return true;}
     }
    //stop carousel animation to start sidebar animation in small devices
    function ifSidebarIsExpanded() {
        if (isSidebarExpanded()) {
            lock = false;
            scrolledElements();
        } else {
            lock = true;
            $(selectedElements).each(function() {
                $(this).data("controle")("pause");
            });
        }
    }
    navbar.click(function(){ifSidebarIsExpanded();});
}

// preload and cash images if width<769px:
function loadPhotos(){
    var str ="dist/img/carousel/";
    var imageSrcs = ["fc91528.11.jpg","5a9c369.8.jpg","/1a08d30.9.jpg","/7672e35.3.jpg","/aacc1f5.4.jpg","b34dcc2.1.jpg","d420e48.10.jpg","d802fa5.5.jpg","faf188e.2.jpg","6095cbc.7.jpg"];
    var images = [];
    preloadImages(imageSrcs, images, callmeBack);
    function callmeBack(){
        console.log("hey images preloaded hi5");
    }
    function preloadImages(srcs, imgs, callback) {
        srcs.forEach(function(url) {
            _load(url,imgs,callback);
        });
    }
    function _load(url,imgs,callback){
        var img = new Image();
        img.onload = function() {
            callback();
        };
        img.src = str+url;
        imgs.push(img);
    }
}
