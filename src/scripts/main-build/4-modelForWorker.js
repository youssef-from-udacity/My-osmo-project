function modelForWorker() {

    // setting web worker
    var worker = null;
    var workerUrl = "../../worker.js";
    // fallback for worker
    function createWorkerFallback(workerUrl) {
        try {
            var blob;
            try {
                blob = new Blob(["importScripts('" + workerUrl + "');"], {
                    "type": 'application/javascript'
                });
            } catch (e) {
                var blobBuilder = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
                blobBuilder.append("importScripts('" + workerUrl + "');");
                blob = blobBuilder.getBlob('application/javascript');
            }
            var url = window.URL || window.webkitURL;
            var blobUrl = url.createObjectURL(blob);
            worker = new Worker(blobUrl);
        } catch (e1) {
            //if it still fails, there is nothing much we can do
        }
        return worker;
    }
    try {
        worker = new Worker(workerUrl);
        worker.onerror = function(event) {
            event.preventDefault();
            worker = createWorkerFallback(workerUrl);
        };
    } catch (e) {
        worker = createWorkerFallback(workerUrl);
    }
    var i, obj = document.createElement('video');
    (obj.canPlayType('video/webm') !== "") ? i = 0: i = 1;

    // this is an array of object containing information about video
    var domVideos = selectedvideos.map(function(video, index) {
        var videoSrc = $(video).find("source").get(i);
        return {
            id: "video-" + index,
            src: videoSrc.getAttribute("data-src"),
            node: videoSrc,
            video: video
        };
    });

    // load videos through worker
    function videoWorkerLoad() {
        var lazyload = $(".lazyload");
        var count = 0;

        function removeLazyload() {
            // remove lazyload class each time untill videos finish
            //then remove the rest of lazyload classes
            $.each(lazyload, function(index, element) {
                if (count === 0) {
                    loadIframe();
                }
                $(element).removeClass("lazyload");
                count += 1;
                lazyload = lazyload.slice(1);
                if (count < postArr.length) {
                    return false;
                }
            });
        }

        worker.onmessage = function(e) {
            $.each(domVideos, function(index, value) {
                var id = e.data[0];
                var src = e.data[1];
                var node;

                // append src to loaded source and then load video
                if (value.id === id) {
                    node = value.node;
                    node.src = src;

                    $(value.video).get(0).load();
                    removeLazyload();
                }
            });
        };
        // object to post
        var postArr = $.each(domVideos, function(index, value) {
            value = {
                id: value.id,
                src: value.src
            };
        });
        // make a copy of postArr
        var postObj = JSON.parse(JSON.stringify(postArr));

        worker.postMessage(postObj);

        worker.onerror = function(error) {
            function WorkerException(message) {
                this.name = "WorkerException";
                this.message = message;
            }
            throw new WorkerException('worker error.');
        };
    }

    videoWorkerLoad();
}
modelForWorker();
