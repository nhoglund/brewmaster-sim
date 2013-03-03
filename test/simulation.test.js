var assert = require('assert');
var create_simulation = require('../simulation').create_simulation;

describe('A Simulation', function () {
	describe('with a single one-shot action', function () {
		it('executes the action exactly once', function (done) {
			var sim = create_simulation();
			sim.at(10, done);
			sim.execute();
		});
		
		it('executes it at the right time', function (done) {
			var sim = create_simulation();
			sim.in(10, function () {
				assert.equal(sim.time(), 10);
				done();
			});
			sim.execute();
		});
	});
	
	describe('with an action chaining to another', function () {
		it('executes both actions', function (done) {
			var sim = create_simulation();
			sim.at(10, function () {
				sim.in(5, function () {
					done();
				});
			});
			sim.execute();
		});
		it('executes them at the right times', function (done) {
			var first_action = 0, second_action = 0
			var sim = create_simulation();
			sim.at(10, function () {
				first_action = sim.time();
				sim.in(5, function () {
					second_action = sim.time();
					assert.equal(first_action, 10);
					assert.equal(second_action, 15); 
					done();
				});
			});
			sim.execute();
		});
		it('stops executing actions when the stop function is called', function (done) {
			var first = false, second = false, third = false;
			var sim = create_simulation();
			sim.at(20, function () {
				third = true;
			});
			sim.at(10, function () {
				first = true;
				sim.in(5, function () {
					second = true;
				});
				sim.stop();
			});
			sim.execute();

			setTimeout(function () {
				assert(first, 'should execute the first action');
				assert(!second, 'should not execute the second action');
				assert(!third, 'should not execute the third action');
				done();
			}, 10);
		});
		it('executes all actions before returning from the execute function', function () {
			var sim = create_simulation();
			var executed = false;
			sim.at(10, function () {
				sim.at(15, function () {
					executed = true;
				});
			});
			sim.execute();
			assert(executed);
		});
	});
});
