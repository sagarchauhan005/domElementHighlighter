(function(window, document) {

    window.domElementHighlighter = (function(window, document) {

        let inspector;
        let opt = {
            elemId: "domElementHighlighter",
            overlay : "domElementHighlighter-overlay",
            backgroundColor: "rgba(255,0,0,0.5)",
            transitionSpeed: 50,
            ignoreElem: [ "head",  "meta",  "link",  "style",  "title",  "script"]  //elements to ignore
        };

        let events = { //define all the events
            click : "click",
            mouseover : "mouseover",
            mouseenter : "mouseenter",
            mouseup : "mouseup",
            mouseleave : "mouseleave",
            mousedown : "mousedown",
        }

        let actions = {  //actions to take
            start  : "start",
            stop : "stop",
        }

        let getQuery = function() {
            let query = "*";
            let ignore = opt.ignoreElem;
            let ignoreLen = ignore.length;
            if (ignoreLen) { // add ignore elements into query
                for (let i = 0; i < ignoreLen; i++) {
                    query += ":not(" + ignore[i] + ")";
                }
            }
            return query;
        };

        let getInspectorDesign = function(top, left, width, height) {
            return "transition : all " + opt.transitionSpeed + "ms;" +
                "top :" + (top || 0) + "px;" +
                "left :" + (left || 0) + "px;" +
                "width : " + (width || 0) + "px;" +
                "height: " + (height || 0) + "px;" +
                "pointer-events : " + "none;" +
                "z-index : 9999999999;" +
                "position :absolute;" +
                "background-color : " + opt.backgroundColor;
        };

        let getOverlayDesign = function() {
            return "display:none; background: rgba(0,0,0,0.9); z-index: 99; position:absolute; top:0; left:0; right:0; bottom:0;";
        };

        let getHighlightDesign = function() {
            return "display:none; background: rgba(0,0,0,0.9); z-index: 99; position:absolute; top:0; left:0; right:0; bottom:0;";
        };


        let setUpInspector = function() {
            inspector = document.createElement("div");  //inspector elem
            inspector.id = opt.elemId;
            inspector.style = getInspectorDesign(); //get inspector design
            document.getElementsByTagName("body")[0].appendChild(inspector); // append to body

            inspector = document.createElement("style");  //inspector elem
            inspector.id = opt.overlay;
            inspector.style = getOverlayDesign(); //get inspector design
            document.getElementsByTagName("body")[0].appendChild(inspector); // append to body

        };

        let eventEmitter = function(event) {
            let target = event.target;  //active node
            if (target.id === opt.elemId) return;  //ignore itself

            let pos = target.getBoundingClientRect(); //get information
            let scrollTop = window.scrollY || document.documentElement.scrollTop; // get Scroll
            let width = pos.width;
            let height = pos.height;
            let top = Math.max(0, pos.top + scrollTop);
            let left = pos.left;

            let inspectorStyles = getInspectorDesign(top, left, width, height); //get inspector style
            inspector.setAttribute("style", inspectorStyles); //assign the style
        };

        let freezeDomEvent = function (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        let removeDomEvents = function (elem){
            var el = elem, elClone = el.cloneNode(true);
            el.parentNode.replaceChild(elClone, el);
        }

        let highlightElement = function (e){
            console.log(e.target.classList);
            e.stopPropagation();
            e.preventDefault();
        }

        let attachListeners = function (type) {
            let query = getQuery();
            let allNodes = document.querySelectorAll(query);
            for (let i = 0; i < allNodes.length; i++) {  //loop each node to bind the listener
                if (type === actions.stop) {
                    allNodes[i].removeEventListener(events.mouseover, eventEmitter);
                } else if (type === actions.start) {
                    allNodes[i].addEventListener(events.mouseover, eventEmitter);
                    allNodes[i].addEventListener(events.click, highlightElement);
                    allNodes[i].addEventListener(events.mousedown, freezeDomEvent);
                    allNodes[i].addEventListener(events.mouseenter, freezeDomEvent);
                    allNodes[i].addEventListener(events.mouseleave, freezeDomEvent);
                    allNodes[i].addEventListener(events.mouseup, freezeDomEvent);
                }
            }
        }


        let init = function() { // initiate the library
            setUpInspector();
            attachListeners(actions.start);
        };

        return {  //expose the function
            init: init,
        };

    })(window, document);

})(window, document);
