var assert = require('assert');
var monk_class = require('../monk');

var Monk = monk_class.monk;
var stance = monk_class.stance;

assert.approx = function (a, b) {
	assert((Math.abs(a - b) / Math.abs(b)) < 0.001, "" + a + " is approximately " + b);
}

describe('A Monk', function () {
	describe('with no stats', function () {
		var monk = Monk();
		it('has 24% stagger', function () {
			assert.approx(monk.stagger(), 0.24);
		});
	});
	describe('with 2421 mastery rating', function () {
		var monk = Monk({ratings: {mastery: 2421}});
		it('has 6.02 mastery', function () {
			assert.equal(monk.mastery(), 6.02);
		});
	});
	describe('Windwalker', function () {
		describe('with 18934 stamina', function () {
			var init = {};
			init.attrs = {
				stamina: 18934
			};
			var monk = Monk(init);
			it('has 411479 health', function () {
				assert.equal(monk.health(), 411479);
			});
		});
		describe('with 4182 haste rating', function () {
			var monk = Monk({ratings: {haste: 4182}});
			it('has 53.78% haste', function () {
				assert.approx(monk.haste(), 1.5378);
			});
		});
	});
	describe('Brewmaster', function () {
		describe('with 19880 stamina', function () {
			var init = {};
			init.attrs = {
				stamina: 19880
			};
			var monk = Monk(init);
			it('has 424723 health', function () {
				assert.equal(monk.health(), 424723);
			});
		});
		describe('with 23856 stamina', function () {
			var init = {};
			init.attrs = {
				stamina: 23856
			};
			var monk = Monk(init);
			it('has 480387 health', function () {
				assert.equal(monk.health(), 480387);
			});
		});
		describe('with 3123 haste rating', function () {
			var monk = Monk({ratings: {haste: 3123}});
			it('has 50.29% haste', function () {
				assert.approx(monk.haste(), 1.5029);
			});
		});
		describe('with 14046 agility and 4901 crit rating', function () {
			var monk = Monk({attrs: {agility: 14046}, ratings: {crit: 4901}});
			it('has 26.80% crit chance', function () {
				assert.approx(monk.crit(), 0.2680);
			});
		});
		describe('with 13378 agility and 4901 crit rating', function () {
			var monk = Monk({attrs: {agility: 13378}, ratings: {crit: 4901}});
			it('has 26.27% crit chance', function () {
				assert.approx(monk.crit(), 0.2627);
			});
		});
	});
});
