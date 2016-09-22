(function () {
	var lastTime = 0;
	if( !window.requestAnimationFrame ) {
		window.requestAnimationFrame = function (callback , element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0,16.7-(currTime-lastTime));
			var id = window.setTimeout(function () {
				callback(currTime + timeToCall)
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		}
	}

	if( !window.cancelAnimationFrame ){
		window.cancelAnimationFrame = function (id) {
			clearTimeOut(id);
		}
	}
})