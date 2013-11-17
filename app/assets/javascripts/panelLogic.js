function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getImageId() {
    var id = parseInt(window.location.pathname.split("/")[2]);
    return id;
}

var isDrawing = false;
var toggleMode = null; //is defined below

$(document).ready(function () {
    var panelDiv = document.getElementById("panel");
    if (!panelDiv) {
    	return;
    }
    var myPanel = new jsgl.Panel(panelDiv);

    var logic = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
        mode: null,
        listOfRects: [],
        curRect: null,
        isMousePressed: false,
        drawingFill: null,
        placedFill: null,
        highlightedFill: null
    };
    logic.drawingFill = new jsgl.fill.SolidFill();
    logic.drawingFill.setOpacity(0.5);
    logic.placedFill = new jsgl.fill.SolidFill();
    logic.placedFill.setOpacity(0.3);
    logic.highlightedFill = new jsgl.fill.SolidFill();
    logic.highlightedFill.setOpacity(0.3);
    logic.highlightedFill.setColor("yellow");

    loadExistingRects();

    setHighlightingMode();
    // setDrawingMode();

    function loadExistingRects() {
        for (rect in comments) {
            var comment = comments[rect];
            var obj = myPanel.createRectangle();
            obj.setX(comment.x1);
            obj.setY(comment.y1);
            obj.setWidth(comment.x2 - comment.x1);
            obj.setHeight(comment.y2 - comment.y1);
            obj.id = comment.id;
            obj.setFill(logic.placedFill);
            logic.listOfRects.push(obj);
            myPanel.addElement(obj)
        }
    }

    toggleMode = function() {
      if(isDrawing){
        setHighlightingMode();
      } else {
        setDrawingMode();
      }
      isDrawing = !isDrawing;
    }
    
    function setDrawingMode() {
      console.log("drawing");
        logic.mode = "drawing";
        for (rect in logic.listOfRects) {
            removeHighlightingListenersFromElement(logic.listOfRects[rect]);
            addDrawingListenersToElement(logic.listOfRects[rect]); //allows user to overlap other rectangles when drawing
        }
        addDrawingListenersToElement(myPanel);
    }

    function setHighlightingMode() {
      console.log("highlighting");
        logic.mode = "highlighting";
        removeDrawingListenersFromElement(myPanel);
        for (rect in logic.listOfRects) {
            addHighlightingListenersToElement(logic.listOfRects[rect]); //each rect will highlight when hovered over
            removeDrawingListenersFromElement(logic.listOfRects[rect]);
        }
    }

    function addDrawingListenersToElement(elem) {
        elem.addMouseDownListener(drawing_mouseDownListener);
        elem.addMouseMoveListener(drawing_mouseMoveListener);
        elem.addMouseUpListener(drawing_mouseUpListener);
    }

    function removeDrawingListenersFromElement(elem) {
        elem.removeMouseDownListener(drawing_mouseDownListener);
        elem.removeMouseMoveListener(drawing_mouseMoveListener);
        elem.removeMouseUpListener(drawing_mouseUpListener);
    }

    function addHighlightingListenersToElement(elem) {
        elem.addMouseOverListener(highlightedListener); //highlights on hover
        elem.addMouseOutListener(unhighlightedListener); //unhighlights when no longer hovering
    }

    function removeHighlightingListenersFromElement(elem) {
        elem.removeMouseOverListener(highlightedListener);
        elem.removeMouseOutListener(unhighlightedListener);
    }

    function highlightedListener(e) {
        var rect = e.getSourceElement();
        rect.setFill(logic.highlightedFill);
        var id = rect.id;
        $.get("/comments/"+id+".js",function(data){
        });
    }

    function unhighlightedListener(e) {
        var rect = e.getSourceElement();
        rect.setFill(logic.placedFill);
    }

    function drawing_mouseDownListener(e) {
        logic.isMousePressed = true;
        logic.x1 = e.getX();
        logic.y1 = e.getY();
	    if (!logic.curRect) {
	    	logic.curRect = myPanel.createRectangle();
	    } else {
	    	logic.curRect.setWidth(0);
	    	logic.curRect.setHeight(0);
	    }
        addDrawingListenersToElement(logic.curRect);
        logic.curRect.setX(logic.x1);
        logic.curRect.setY(logic.y1);
        logic.curRect.setFill(logic.drawingFill);
        myPanel.addElement(logic.curRect);
    }

    function drawing_mouseMoveListener(e) {
        if (logic.isMousePressed) {
            logic.x2 = e.getX();
            logic.y2 = e.getY();
            updateDimensionsOfRect(logic.curRect);
        }
    }

    function updateDimensionsOfRect(rect) {
        var xLoc = logic.x1 < logic.x2 ? logic.x1 : logic.x2;
        var yLoc = logic.y1 < logic.y2 ? logic.y1 : logic.y2;
        var width = Math.abs(logic.x2 - logic.x1);
        var height = Math.abs(logic.y2 - logic.y1);
        rect.setX(xLoc);
        rect.setY(yLoc);
        rect.setWidth(width);
        rect.setHeight(height);
    }

    function drawing_mouseUpListener(e) {
        if (logic.isMousePressed) {
            logic.x1 = logic.curRect.getX();
            logic.y1 = logic.curRect.getY();
            logic.x2 = logic.x1 + logic.curRect.getWidth();
            logic.y2 = logic.y1 + logic.curRect.getHeight();
            logic.curRect.setFill(logic.placedFill); //change the fill when placed

            // logic.listOfRects.push(logic.curRect); //add to list of placed rects
            // setHighlightingMode(); //only drawing a single rect while in drawing mode. then switch back to highlighting mode

            console.log(logic.x1);
            console.log(logic.y1);
            console.log(logic.x2);
            console.log(logic.y2);
            var imageId = getImageId();
            // var redir = window.location.origin + "/comments/new?x1=" + logic.x1 + "&x2=" + logic.x2 + "&y1=" + logic.y1 + "&y2=" + logic.y2 + "&img=" + imageId;
            $.get("/comments/new.js?x1="+ logic.x1 + "&x2=" + logic.x2 + "&y1=" + logic.y1 + "&y2=" + logic.y2 + "&img=" + imageId+"", function (data) {});

        }
        logic.isMousePressed = false;
    }
});
