function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getImageId(){
  var id = parseInt(window.location.pathname.split("/")[2]);
  return id;
}

$(document).ready(function() {
var panelDiv = document.getElementById("panel");
if(!panelDiv){return;}
console.log(panelDiv);
var myPanel = new jsgl.Panel(panelDiv);
/*
var painting = myPanel.createImage();
painting.setUrl('dist/img/starry-night.jpg');
//painting.setUrl('../img/small-ball.png');
var origWidth = painting.getWidth();
var origHeight = painting.getHeight();
scaleImage(5);
//Image is loaded asynchronously, so scaleImage keeps calling itself every DELAY milliseconds until image is loaded
function scaleImage(DELAY) {
  window.setTimeout(function() {
	  origWidth = painting.getWidth();
	  origHeight = painting.getHeight();
	  if (origWidth == 0 || origHeight == 0) { //image not yet loaded
		scaleImage();
		return;
	  }
	  //At this point, raw image has been loaded with original dimensions
	  
	  //Find width and height of the div the panel is contained in
	  panelWidth = panelDiv.style.width;
	  panelWidth = panelWidth.substring(0, panelWidth.length - 2);
	  panelWidth = parseInt(panelWidth);
	  panelHeight = panelDiv.style.height;
	  panelHeight = panelHeight.substring(0, panelHeight.length - 2);
	  panelHeight = parseInt(panelHeight);
	  
	  //Determine if the width needs to be shrunk more or the height, but don't expand either dimension
	  widthScaling = panelWidth / origWidth;
	  heightScaling = panelHeight / origHeight;
	  scalingFactor = Math.min(widthScaling, heightScaling);
	  if (scalingFactor >= 1) {
		scalingFactor = 1; // Do not zoom on low quality image
	  }
	  
	  painting.setWidth(origWidth * scalingFactor);
	  painting.setHeight(origHeight * scalingFactor);
		  
	  myPanel.addElement(painting);
	  
  }, DELAY);
}
*/
var x1, y1, x2, y2;
var listOfRects = [];
var rect;
var isMousePressed = false;
var drawingFill = new jsgl.fill.SolidFill();
drawingFill.setOpacity(0.5);
var placedFill = new jsgl.fill.SolidFill();
placedFill.setOpacity(0.3);
var highlightedFill = new jsgl.fill.SolidFill();
highlightedFill.setOpacity(0.3);
highlightedFill.setColor("yellow");

//TODO: deal with negative dimensions

addListenersToElement(myPanel);

function highlightedListener(e) {
	e.getSourceElement().setFill(highlightedFill);
}

function addListenersToElement(elem) {
	elem.addMouseDownListener(mouseDownListener);
	elem.addMouseMoveListener(mouseMoveListener);
	elem.addMouseUpListener(mouseUpListener);
}
function mouseDownListener(e) {
	isMousePressed = true;
	x1 = e.getX();
	y1 = e.getY();
	rect = myPanel.createRectangle();
	addListenersToElement(rect);
	rect.setX(x1);
	rect.setY(y1);
	rect.setFill(drawingFill);
	myPanel.addElement(rect);
}

function mouseMoveListener(e) {
	if (isMousePressed) {
		x2 = e.getX();
		y2 = e.getY();
		rect.setWidth(x2 - x1);
		rect.setHeight(y2 - y1);
	}
}

function mouseUpListener(e) {
	if (isMousePressed) {
		rect.setFill(placedFill);
		listOfRects.push(rect);
		rect.removeMouseDownListener(mouseDownListener);
		rect.addMouseDownListener(highlightedListener);
    console.log(x1);
    console.log(y1);
    console.log(x2);
    console.log(y2);
    var imageId = getImageId();
    var redir = window.location.origin+"/comments/new?x1="+x1+"&x2="+x2+"&y1="+y1+"&y2="+y2+"&img="+imageId;
    $.get("/comments/new.js", function(data){
    });
    //window.location.replace(redir);
	}
	isMousePressed = false;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

});
