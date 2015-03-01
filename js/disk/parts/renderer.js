// parts/renderer

// Render the disk

define([
	'jquery',
	'underscore',
	'parts/helper'
], function($, _, Helper){

	/**************
		Private
	**************/

	var disk = [];

	var canvas = undefined;
	var ctx = undefined;

	var gridSize = undefined;
	var width = 0;
	var height = 0;

	// Render a checkered background for the canvas by the disk array
	var checkerCanvas = function(){
		for (var i = 0; i < disk.length; i++) {

			var gridX = Helper.grid.getXFromIndex(i, width);
			var gridY = Helper.grid.getYFromIndex(i, width);

			if (
				(gridX % 2 === 0 && gridY % 2 === 0) ||
				(gridX % 2 !== 0 && gridY % 2 !== 0)
			) {
				ctx.fillStyle = '#FAFAFA';
				ctx.fillRect(gridX * gridSize, gridY * gridSize, gridSize, gridSize);
			};
		};
	}

	var clearCanvas = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
	}

	// Render the fucking disk
	var renderDisk = function(){

		function getColor(numberOfColors, level){
		    
		    var color = "rgb(";
		    var frequency=5/numberOfColors;

		    var opacity = 0.3;

		    var r = Math.sin(frequency*level + 0) * (255 * opacity) + (255 - 255 * opacity);
		    var g = Math.sin(frequency*level + 2) * (255 * opacity) + (255 - 255 * opacity);
		    var b = Math.sin(frequency*level + 4) * (255 * opacity) + (255 - 255 * opacity);

			color = color + Math.floor(r) + ", " + Math.floor(g) + ", " + Math.floor(b) + ")"; 

		    return color; 
		}

		// Draw a line to parent cell
		for (var i = 0; i < disk.length; i++) {
			var cell = disk[i];

			if (cell !== undefined) {
				var gridX = Helper.grid.getXFromIndex(i, width);
				var gridY = Helper.grid.getYFromIndex(i, width);

				var parent = disk[cell.parent];

				if (parent !== undefined) {
					var parentGridX = Helper.grid.getXFromIndex(parent.index, width);
					var parentGridY = Helper.grid.getYFromIndex(parent.index, width);

					ctx.beginPath();

					// Rainbow stroke style based on cell level
					ctx.lineWidth = 1;
					// ctx.strokeStyle = '#DDD';
					ctx.strokeStyle = getColor(13, cell.level % 13);

					ctx.moveTo( // Cell coords
						gridX * gridSize + cell.x,
						gridY * gridSize + cell.y
					);
					ctx.lineTo( // Neighbooring cell coords
						parentGridX * gridSize + parent.x,
						parentGridY * gridSize + parent.y
					);
					ctx.stroke();
				};

			};
		};
		
		// Cell circle
		for (var i = 0; i < disk.length; i++) {
			var cell = disk[i];

			if (cell !== undefined) {
				var gridX = Helper.grid.getXFromIndex(i, width);
				var gridY = Helper.grid.getYFromIndex(i, width);
				
				ctx.beginPath();
				ctx.arc(gridX * gridSize + cell.x, gridY * gridSize + cell.y, 4, 0, 2 * Math.PI, false); // 3 is the best size
				ctx.lineWidth = 1;
				// ctx.strokeStyle = '#333';
				// ctx.strokeStyle = getColor(13, cell.level % 13);
				// ctx.stroke();

				ctx.fillStyle = getColor(13, cell.level % 13);
				ctx.fill();
			}
		};
	}

	var render = function(){
		clearCanvas();
		renderDisk();
	}

	/*************
		Public
	*************/

	var renderer = {};

	renderer.updateDisk = function(p_disk){
		disk = p_disk;
	}

	renderer.updateDimensions = function(p_width, p_height){
		width = p_width;
		height = p_height;
	}

	renderer.renderLoop = function(p_canvas, p_gridSize, p_width, p_height){
		canvas = document.getElementById(p_canvas);
		ctx = canvas.getContext('2d');
		gridSize = p_gridSize;
		this.updateDimensions(p_width, p_height);

		setInterval(function(){
			// Cinematic 20fps
			render();
		}, 1000/20);
	}

	renderer.renderOnce = function(p_canvas, p_gridSize, p_width, p_height){
		canvas = document.getElementById(p_canvas);
		ctx = canvas.getContext('2d');
		gridSize = p_gridSize;
		this.updateDimensions(p_width, p_height);

		render();
	}

	return renderer;
	
});
