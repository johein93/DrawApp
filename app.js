$.fn.pureRGB = function(){
	return this.css("backgroundImage").replace("linear-gradient","").split("),")[1].replace("))",")");
}

var originalAvailableColors = ["#e74c3c","#2ecc71","#3f9edd"];

$("#availableColors li a img").each(function(item){
	$(this).css("background-image","linear-gradient("+originalAvailableColors[item]+","+originalAvailableColors[item]+")").attr("color-data",originalAvailableColors[item]);
});

$("body").on("click","a[target!=_blank]",function(e){
	e.preventDefault();
});



var color = $("#availableColors li.selected a img").pureRGB();

var $canvas = $('canvas');
var context = $canvas[0].getContext("2d");
var lastEvent;
var mouseDown = false;

$("#availableColors").on("click","li a",function(){
	$(this).parent("li").addClass("selected").siblings().removeClass("selected");
	color = $(this).find("img").pureRGB();
});

function changeColor(){
	var r = $("#r").val();
	var g = $("#g").val();
	var b = $("#b").val();
	$("#dispalyColor").css("background-color","rgb("+r+","+g+","+b+")");	
}

$("#addColor a").click(function(){
	// changeColor()
	$("#chooseColor").toggle();
});



$("#chooseColor #colorRanges input[type=range]").change(changeColor);

$("#chooseColor button").click(function(){
	$newColor = $("<li><a href=''><img src='images/color-bucket.png' alt=''></a></li>");
	$newColor.find('img').css("background-image","linear-gradient(" +$("#dispalyColor").css("background-color") +","+ $("#dispalyColor").css("background-color")+")");
	$newColor.insertBefore("#availableColors .clear");
	$newColor.find("a").click();
});




$canvas.mousedown(function(e){
	lastEvent = e;
	mouseDown = true;

}).mousemove(function(e){
	if(mouseDown){
		context.beginPath();
		context.moveTo(lastEvent.offsetX,lastEvent.offsetY);
		context.lineTo(e.offsetX,e.offsetY);
		context.strokeStyle = color;
		context.stroke();
		lastEvent = e;
	}
}).mouseup(function(){
	mouseDown = false;
}).mouseleave(function(){
	$canvas.mouseup();
});












