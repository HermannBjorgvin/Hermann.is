// app

define([
	'jquery',
	'underscore',
	'parts/helper'
], function($, _, Helper){
	var initialize = function(){

		var canvas = document.getElementById('disk');
		var ctx = canvas.getContext('2d');

        canvas.style.pointerEvents = "none";

		var minRadius = 30;
		var gridSize = minRadius * Math.SQRT1_2;

		var width = 0;
		var height = 0;

		var diskArray = [];

		// Main function, gets the canvas width and height and generates a disk from that
		function createDisk(){

            canvas.height = canvas.offsetHeight;
            canvas.width = canvas.offsetWidth;

			width = Math.ceil(canvas.width/gridSize);
			height = Math.ceil(canvas.height/gridSize);
			
			diskArray = new Array(width * height);
			diskArray[Math.round(0)] = { // seed
				x: 0,
				y: 0,
				active: true,
				index: Math.round(0),
				parent: undefined,
				level: 1
			};

			function newCandidate(){

				var activeCell = _.find(_.shuffle(diskArray), function(cell){
					if (cell !== undefined && cell.active === true){
						return true;
					}
					else{
						return false;
					};
				});

				if(activeCell !== undefined){
					var newCandidateCoords = undefined;
					var candidateIndex = undefined;

					// Test 30 candidates before declaring the cell inactive
					var candidateFound = _.find(_.range(30), function(iteration){
						
						// Create new candidate coords
						var unitVector = Helper.unitVector();
						var rand = Math.random() * minRadius + minRadius;

						var activeCellCoords = {
							x: Helper.grid.getXFromIndex(activeCell.index, width) * gridSize + activeCell.x,
							y: Helper.grid.getYFromIndex(activeCell.index, width) * gridSize + activeCell.y
						};

						var candidateCoords = {
							x: activeCellCoords.x + (unitVector.x * rand),  
							y: activeCellCoords.y + (unitVector.y * rand)
						};

						candidateIndex = Helper.grid.getIndexFromCoords(
							candidateCoords.x,
							candidateCoords.y,
							gridSize,
							width
						);

						if(
							diskArray[candidateIndex] === undefined &&
							candidateCoords.x >= 0 &&
							candidateCoords.x <= (width * gridSize) &&
							candidateCoords.y >= 0 &&
							candidateCoords.y <= (height * gridSize)
						){
							// Loop through neighboors and check if candidate placement is okay
							var placementIsOkay = _.find(Helper.getNeighboorsFromIndex(candidateIndex, width, height), function(neighboorIndex){

								var neighboor = diskArray[neighboorIndex];

								if (neighboor !== undefined) {
									var neighboorCoords = {
										x: Helper.grid.getXFromIndex(neighboorIndex, width) * gridSize + neighboor.x,
										y: Helper.grid.getYFromIndex(neighboorIndex, width) * gridSize + neighboor.y
									};

									if (
										neighboorCoords.x >= 0 &&
										neighboorCoords.x <= (width * gridSize) &&
										neighboorCoords.y >= 0 &&
										neighboorCoords.y <= (height * gridSize) || true
									) {
										var distance = Helper.pythagorasDistance(neighboorCoords, candidateCoords);
										
										if (distance < minRadius) {
											return true;
										}
										else{
											return false;
										};
									}
									else{
										return false;
									};
								}
								else{
									return false;
								};
							});

							if (placementIsOkay === undefined) {
								newCandidateCoords = candidateCoords;
								return true;
							}
							else{
								return false;
							};
						}
						else{
							return false;
						};
					});

					if (candidateFound !== undefined) {
						// add the new candidate to the array
						var newCell = new Helper.cellConstructor(
							(newCandidateCoords.x % gridSize),
							(newCandidateCoords.y % gridSize),
							candidateIndex,
							activeCell.index,
							activeCell.level + 1
						);
						
						diskArray[candidateIndex] = newCell;
					}
					else{
						diskArray[activeCell.index].active = false;
					};
				}
				else{
					// Exit
				};
			}

			// Run asynchronously alongside the rendering
			setInterval(function(){
				newCandidate();
			}, 1);
			// _.defer(function(){newCandidate();});
		}

		function resetDisk(){

            canvas.height = canvas.offsetHeight;
            canvas.width = canvas.offsetWidth;

			width = Math.ceil(canvas.width/gridSize);
			height = Math.ceil(canvas.height/gridSize);

			diskArray = new Array(width * height);
			diskArray[Math.round(0)] = { // seed
				x: 0,
				y: 0,
				active: true,
				index: Math.round(0),
				parent: undefined,
				level: 1
			};
		}

		// Render the fucking disk
		function renderDisk(){

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
			for (var i = 0; i < diskArray.length; i++) {
				var cell = diskArray[i];

				if (cell !== undefined) {
					var gridX = Helper.grid.getXFromIndex(i, width);
					var gridY = Helper.grid.getYFromIndex(i, width);

					var parent = diskArray[cell.parent];

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
			for (var i = 0; i < diskArray.length; i++) {
				var cell = diskArray[i];

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

		// Render a checkered background for the canvas by the disk array
		function checkerCanvas(){
			for (var i = 0; i < diskArray.length; i++) {
				
				var gridX = Helper.grid.getXFromIndex(i, width);
				var gridY = Helper.grid.getYFromIndex(i, width);

				if (
					(gridX % 2 === 0 && gridY % 2 === 0) ||
					(gridX % 2 !== 0 && gridY % 2 !== 0)
				) {
					ctx.fillStyle = '#EEE';
					ctx.fillRect(gridX * gridSize, gridY * gridSize, gridSize, gridSize);
				};
			};
		}

		function clearCanvas(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
		}

		// render the disk, targets 60fps
		function render(){
			// requestAnimationFrame(render);

			clearCanvas();
			// checkerCanvas();
			renderDisk();
		}
		setInterval(function(){
			// Cinematic 30fps
			render();
		}, 1000/20);

		createDisk();
        window.onresize = function(){
            resetDisk();
        };
	};

	return {
		initialize: initialize
	};
});
