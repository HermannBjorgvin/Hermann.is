// app

define([
	'jquery',
	'underscore',
	'parts/renderer',
	'parts/disk'
], function($, _, Renderer, Disk){
	var initialize = function(){

		var canvas = document.getElementById('disk');
		var ctx = canvas.getContext('2d');

        canvas.style.pointerEvents = 'none';

		var minRadius = 30;
		var gridSize = minRadius * Math.SQRT1_2;

		var width = 0;
		var height = 0;

		// canvas size calculcations
		function updateDimensions(){
            canvas.height = canvas.offsetHeight;
            canvas.width = canvas.offsetWidth;

			width = Math.ceil(canvas.width/gridSize);
			height = Math.ceil(canvas.height/gridSize);
		}

		updateDimensions();
        window.onresize = function(){
            updateDimensions();
			Disk.resetDisk(minRadius, width, height, canvas.height, canvas.width);
        };

		// Render loop at cinematic 20fps
		setInterval(function(){
			Renderer.updateDisk(Disk.getDisk());
			Renderer.renderOnce('disk', gridSize, width, height);
		}, 1000/20);

		Disk.newDisk(minRadius, width, height, canvas.height, canvas.width);
	};

	return {
		initialize: initialize
	};
});
