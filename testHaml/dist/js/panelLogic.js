var panelDiv = document.getElementById("panel");
var myPanel = new jsgl.Panel(panelDiv);

// var painting = myPanel.createImage();
// // painting.setUrl('dist/img/starry-night.jpg');
// //painting.setUrl('../img/small-ball.png');
// var origWidth = painting.getWidth();
// var origHeight = painting.getHeight();
// scaleImage(5);
// //Image is loaded asynchronously, so scaleImage keeps calling itself every DELAY milliseconds until image is loaded
// function scaleImage(DELAY) {
//     window.setTimeout(function () {
//         origWidth = painting.getWidth();
//         origHeight = painting.getHeight();
//         if (origWidth == 0 || origHeight == 0) { //image not yet loaded
//             scaleImage();
//             return;
//         }
//         //At this point, raw image has been loaded with original dimensions

//         //Find width and height of the div the panel is contained in
//         panelWidth = panelDiv.style.width;
//         panelWidth = panelWidth.substring(0, panelWidth.length - 2);
//         panelWidth = parseInt(panelWidth);
//         panelHeight = panelDiv.style.height;
//         panelHeight = panelHeight.substring(0, panelHeight.length - 2);
//         panelHeight = parseInt(panelHeight);

//         //Determine if the width needs to be shrunk more or the height, but don't expand either dimension
//         widthScaling = panelWidth / origWidth;
//         heightScaling = panelHeight / origHeight;
//         scalingFactor = Math.min(widthScaling, heightScaling);
//         if (scalingFactor >= 1) {
//             scalingFactor = 1; // Do not zoom on low quality image
//         }

//         painting.setWidth(origWidth * scalingFactor);
//         painting.setHeight(origHeight * scalingFactor);

//         myPanel.addElement(painting);

//     }, DELAY);
// }

var logic = {
	x1 : 0,
	x2 : 0,
	y1 : 0,
	y2 : 0,
	listOfRects : [],
	curRect : null,
	isMousePressed : false,
	drawingFill : null,
	placedFill : null,
	highlightedFill : null
};
logic.drawingFill = new jsgl.fill.SolidFill();
logic.drawingFill.setOpacity(0.5);
logic.placedFill = new jsgl.fill.SolidFill();
logic.placedFill.setOpacity(0.3);
logic.highlightedFill = new jsgl.fill.SolidFill();
logic.highlightedFill.setOpacity(0.3);
logic.highlightedFill.setColor("yellow");


//TODO: deal with negative dimensions

setDrawingMode();

function setDrawingMode() {
	for (rect in logic.listOfRects) {
		removeHighlightingListenersFromElement(logic.listOfRects[rect]);
		addDrawingListenersToElement(logic.listOfRects[rect]); //allows user to overlap other rectangles when drawing
	}
	addDrawingListenersToElement(myPanel);
}

function setHighlightingMode() {
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
	console.log(elem);
    elem.addMouseOverListener(highlightedListener);  //highlights on hover
    elem.addMouseOutListener(unhighlightedListener); //unhighlights when no longer hovering
}

function removeHighlightingListenersFromElement(elem) {
    elem.removeMouseOverListener(highlightedListener);
    elem.removeMouseOutListener(unhighlightedListener);
}

function highlightedListener(e) {
	var rect = e.getSourceElement();
    rect.setFill(logic.highlightedFill);
}

function unhighlightedListener(e) {
	var rect = e.getSourceElement();
    rect.setFill(logic.placedFill);
}

function drawing_mouseDownListener(e) {
    logic.isMousePressed = true;
    logic.x1 = e.getX();
    logic.y1 = e.getY();
    logic.curRect = myPanel.createRectangle();
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
        logic.curRect.setWidth(logic.x2 - logic.x1);
        logic.curRect.setHeight(logic.y2 - logic.y1);
    }
}

function drawing_mouseUpListener(e) {
    if (logic.isMousePressed) {
		// document.getElementById("form").innerText = logic.x1 + ", " + logic.y1;
        logic.curRect.setFill(logic.placedFill); //change the fill when placed
        logic.listOfRects.push(logic.curRect); //add to list of placed rects

        setHighlightingMode(); //only drawing a single rect while in drawing mode. then switch back to highlighting mode
    }
    logic.isMousePressed = false;
}
