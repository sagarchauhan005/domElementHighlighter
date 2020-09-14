(function(window, document) {

    window.domElementHighlighter = (function(window, document) {

        let inspector, srcElement;
        let opt = {
            elemId: "domElementHighlighter",
            visible : "domElementHighlighterVisible",
            closeBtnContainer: "domCloseHighlighterCont",
            closeBtn: "domCloseHighlighterBtn",
            highlightStyle : ".domElementHighlighterVisible {box-shadow : 0 0 0 9999px rgba(0, 0, 0, 0.5);} " +
                "#domCloseHighlighterCont{display:none; top: 20px; position: fixed; color: white; right: 52px; " +
                "cursor: pointer; font-size: 25px; line-height:0; background-color: rgba(0, 0, 0, 0.8); padding: 10px 20px 10px 20px; border-radius:10px;}",
            border: "2px solid red",
            transitionSpeed: 50,
            ignoreElem: [ "head",  "meta",  "link",  "style",  "title",  "script"],  //elements to ignore

        };

        let addStyle = function (styles) {
            var css = document.createElement('style'); /* Create style document */
            css.type = 'text/css';
            if (css.styleSheet)
                css.styleSheet.cssText = styles;
            else
                css.appendChild(document.createTextNode(styles));
            document.getElementsByTagName("head")[0].appendChild(css); /* Append style to the tag name */
        }

        let events = { //define all the events
            click : "click",
            mouseover : "mouseover",
            mouseenter : "mouseenter",
            mouseup : "mouseup",
            mouseleave : "mouseleave",
            mousedown : "mousedown",
            keyUp: "keyup"
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
                "cursor : " + "pointer;" +
                "z-index : 2147483647;" +
                "position :absolute;" +
                "border : " + opt.border;
        };

        let closeHighlight = function(){
            document.removeEventListener(events.mouseover,freezeDomEvent, true);
            document.getElementById(opt.elemId).classList.remove(opt.visible);
            document.getElementById(opt.closeBtnContainer).style.display="none";
        };

        let setUpInspector = function() {
            inspector = document.createElement("div");  //inspector elem
            inspector.id = opt.elemId;
            inspector.style = getInspectorDesign(); //get inspector design
            document.getElementsByTagName("body")[0].prepend(inspector); // append to body

            let inspectorOverlay = document.createElement("div");  //inspector elem
            inspectorOverlay.innerHTML = '<p>Press Esc to close</p>';
            inspectorOverlay.id = opt.closeBtnContainer;
            document.getElementById(opt.elemId).append(inspectorOverlay); // append to body

            addStyle(opt.highlightStyle);
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

        const getCssSelectorShort = (el) => {
            let path = [], parent;
            while (parent = el.parentNode) {
                path.unshift(`${el.tagName}:nth-child(${[].indexOf.call(parent.children, el)+1})`);
                el = parent;
            }
            console.log('%c Unique css selector for the clicked element is : ', 'color: red');
            console.log(`${path.join(' > ')}`.toLowerCase());
            console.log("---------------------------------------------------------------------");
        };

        let highlightActiveElem = function (e){
            srcElement = e.srcElement;
            document.getElementById(opt.closeBtnContainer).style.display="block";
            document.getElementById(opt.elemId).classList.add(opt.visible);
            document.addEventListener(events.mouseover,freezeDomEvent, true);
            getCssSelectorShort(srcElement); //Log the unique css selector
            e.stopPropagation();
            e.preventDefault();
        };

        let cloneElem = function (elem){
            var new_element = elem.cloneNode(true);
            elem.parentNode.replaceChild(new_element, elem);
            return new_element;
        }

        let keyPress = function (e) {
            if (e.key === "Escape"){
                closeHighlight();
            }
        }

        let attachListeners = function (type) {
            let query = getQuery();
            let allNodes = document.querySelectorAll(query);
            for (let i = 0; i < allNodes.length; i++) {  //loop each node to bind the listener
                let elem = allNodes[i];
                if (type === actions.stop) {
                    elem.removeEventListener(events.mouseover, eventEmitter);
                    elem.removeEventListener(events.click, highlightActiveElem);
                } else if (type === actions.start) {
                    elem.addEventListener(events.mouseover, eventEmitter);
                    elem.addEventListener(events.click, highlightActiveElem);
                }
            }

            if(actions.stop){  //removes the keyup listener
                document.removeEventListener(events.keyUp,keyPress)
            }

        }

        let removeDefaultHandlers = function () {
            let query = getQuery();
            let allNodes = document.querySelectorAll(query);
            for (let i = 0; i < allNodes.length; i++) {  //loop each node to bind the listener
                cloneElem(allNodes[i]);
            }
        };


        let handleCloseByEscape = function () {
            document.addEventListener(events.keyUp, keyPress);
        }

        let init = function(type) { // initiate the library
            let action = (type) ? actions.start : actions.stop;
            removeDefaultHandlers();
            setUpInspector();
            attachListeners(action);
            handleCloseByEscape();
        };

        return {  //expose the function
            init: init,
        };

    })(window, document);

})(window, document);






