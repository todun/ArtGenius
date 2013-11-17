panelDiv = document.getElementById("panel");
myPanel = new jsgl.Panel(panelDiv);

painting = myPanel.createImage();
painting.setUrl('dist/img/starry-night.jpg');
//painting.setUrl('../img/small-ball.png');
origWidth = painting.getWidth();
origHeight = painting.getHeight();
scaleImage(5);
//Image is loaded asynchronously, so scaleImage keeps calling itself every DELTA milliseconds until image is loaded
function scaleImage(DELTA) {
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
	  
  }, DELTA);
}
var x1, y1;
var rect;
var isMousePressed = false;
//TODO: deal with negative dimensions

addListenersToElement(painting);

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
	fill = new jsgl.fill.SolidFill();
	fill.setOpacity(0.4);
	rect.setFill(fill);
	myPanel.addElement(rect);
}

function mouseMoveListener(e) {
	if (isMousePressed) {
		var x2 = e.getX();
		var y2 = e.getY();
		rect.setWidth(x2 - x1);
		rect.setHeight(y2 - y1);
	}
}

function mouseUpListener(e) {
	isMousePressed = false;
}