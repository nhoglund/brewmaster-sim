var Heap = require('heap');

function simulation() {
	var that = {}
	var current_time = 0;
	var pending_actions = new Heap(function (a, b) {
		return a.time - b.time;
	});
	var stop = false;

	that.at = function (time, action) {
		pending_actions.push({time: time, action: action});
	}

	that.in = function (time, action) {
		that.at(current_time + time, action);
	}

	that.stop = function () {
		stop = true;
	}

	that.execute = function () {
		var item
		while (!stop && (item = pending_actions.pop())) {
			current_time = item.time;
			item.action();
		}
	}
	
	that.time = function () {
		return current_time;
	}

	return that;
}

exports.simulation = simulation;