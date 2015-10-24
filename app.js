// Dependencies
var fs = require('fs');


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
var burshSize = 1;
var photoData = null;

$canvas[0].width = parseInt($canvas.css('width'));
$canvas[0].height = parseInt($canvas.css('height'));


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



$("#menu #left a").click(function(e){
	var crase = e.currentTarget.className;
	switch(crase){
		case "decrase":
		burshSize = (burshSize != 1) ? burshSize-1 : 1;
		break;

		case "incrase":
		burshSize = (burshSize != 7) ? burshSize+1 : 7;
		break;
	}
})


function bindSavingToDisk () {
    var $saver  = $('#saver');
    $saver.change(function(){
        var filePath = this.value;
        fs.writeFile(filePath, photoData, 'base64', function (err) {
            if (err) { alert('There was an error saving the photo:',err.message); }
            photoData = null;
        });
    });
}
bindSavingToDisk();

$("#menu #right a").click(function(e){
	var action = e.currentTarget.className;
	switch(action){
		case "trash":
		context.clearRect(0,0,$canvas[0].width,$canvas[0].height);
		break;
		case "save":
		var $saver = $("#saver");
		$saver.attr('nwsaveas','FunDrawImage.png');
        photoData = $canvas[0].toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
		$saver.click();
		break;
	}
})





$canvas.mousedown(function(e){
	lastEvent = e;
	mouseDown = true;

}).mousemove(function(e){
	if(mouseDown){
		context.beginPath();
		context.moveTo(lastEvent.offsetX,lastEvent.offsetY);
		context.lineTo(e.offsetX,e.offsetY);
		context.lineWidth = burshSize;
		context.strokeStyle = color;
		context.stroke();
		lastEvent = e;
	}
}).mouseup(function(){
	mouseDown = false;
}).mouseleave(function(){
	$canvas.mouseup();
});