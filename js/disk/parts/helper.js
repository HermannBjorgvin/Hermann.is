// parts/helper

// Various helper functions for grid arithmatic and what not

define([
	'jquery',
	'underscore'
], function($, _){

	var gridHelper = {};

	// Test if object is working
	gridHelper.test = function(){
		console.log('Beware, this is just a test');
	};

	// Return a random unit vector
	gridHelper.unitVector = function(){
		var radian = Math.random() * 2 * Math.PI - Math.PI;

		return {
			x: Math.cos(radian),
			y: Math.sin(radian)
		};
	};

	// Help with grid coordinates
	gridHelper.grid = {
		// Return X from index
		getXFromIndex: function(index, width){
			return index % width;
		},
		// Return Y from index
		getYFromIndex: function(index, width){
			return Math.floor(index / width);
		},
		getIndexFromCoords: function(x, y, gridSize, width){
			return (
				Math.floor(y / gridSize) * width +
				Math.floor(x / gridSize)
			);
		}
	};

	gridHelper.pythagorasDistance = function(coords1, coords2){
		return Math.sqrt(
			Math.pow(coords1.x - coords2.x, 2) +
			Math.pow(coords1.y - coords2.y, 2)
		);
	};

	gridHelper.cellConstructor = function(x, y, index, parent, level){
		this.x = x;
		this.y = y;
		this.index = index;
		this.parent = parent;
		this.active = true;
		this.level = level;
	}

	gridHelper.getNeighboorsFromIndex = function(index, width, height){
		var neighboorsArray = [];

		// If statements for:
		
		// Top Left
		// Top
		// Top Right

		// Left
		// Right

		// Bottom Left
		// Bottom
		// Bottom Right

		// Top neighboors			
		neighboorsArray.push(index - width);

			// Top Left
			neighboorsArray.push(index - width - 1);
		
			// Top Right
			neighboorsArray.push(index - width + 1);

		// Left
		neighboorsArray.push(index - 1);

		// Right
		neighboorsArray.push(index + 1);

		// Bottom
		neighboorsArray.push(index + width);

			// Bottom Left
			neighboorsArray.push(index + width - 1);
		
			// Bottom Right
			neighboorsArray.push(index + width + 1);

		return neighboorsArray;
	}

	return gridHelper;
});
