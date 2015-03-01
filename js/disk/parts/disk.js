// parts/disk

define([
	'jquery',
	'underscore',
	'parts/helper'
], function($, _, Helper){

	/**************
		Private
	**************/

	var disk = [];

	var minRadius = 30;
	var gridSize = minRadius * Math.SQRT1_2;

	var width = 0;
	var height = 0;

	var offsetWidth = 0;
	var offsetHeight = 0;

	var newCandidate = function(){

		var activeCell = _.find(_.shuffle(disk), function(cell){
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
					disk[candidateIndex] === undefined &&
					candidateCoords.x >= 0 &&
					candidateCoords.x <= (width * gridSize) &&
					candidateCoords.y >= 0 &&
					candidateCoords.y <= (height * gridSize)
				){
					// Loop through neighboors and check if candidate placement is okay
					var placementIsOkay = _.find(Helper.getNeighboorsFromIndex(candidateIndex, width, height), function(neighboorIndex){

						var neighboor = disk[neighboorIndex];

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
				
				disk[candidateIndex] = newCell;
			}
			else{
				disk[activeCell.index].active = false;
			};
		}
		else{
			// Exit
		};
	}

	/*************
		Public
	*************/

	var diskHandler = {};

	diskHandler.getDisk = function(){
		return disk;
	}

	diskHandler.resetDisk = function(p_minRadius, p_width, p_height, p_offsetHeight, p_offsetWidth){
		minRadius = p_minRadius;

		width = p_width;
		height = p_height;

		offsetHeight = p_offsetHeight;
		offsetWidth = p_offsetWidth;

		disk = new Array(width * height);
		disk[0] = { // seed
			x: 0,
			y: 0,
			active: true,
			index: Math.round(0),
			parent: undefined,
			level: 1
		};
	}

	diskHandler.newDisk = function(p_minRadius, p_width, p_height, p_offsetHeight, p_offsetWidth){
		minRadius = p_minRadius;

		width = p_width;
		height = p_height;

		offsetHeight = p_offsetHeight;
		offsetWidth = p_offsetWidth;

		disk = new Array(width * height);
		disk[0] = { // seed
			x: 0,
			y: 0,
			active: true,
			index: Math.round(0),
			parent: undefined,
			level: 1
		};

		// Start candidate finding loop
		setInterval(function(){
			newCandidate();
		}, 1);
	}

	return diskHandler;

});
