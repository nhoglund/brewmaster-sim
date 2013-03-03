var assert = require('assert');
var monk_module = require('../monk');

var create_monk = monk_module.create_monk;
var stance = monk_module.stance;

assert.approx = function (a, b, n) {
	assert((Math.abs(a - b) / Math.abs(b)) < Math.pow(0.1, n ? n : 3), "" + a + " is approximately " + b);
}

describe('A Monk', function () {
	describe('with no stats', function () {
		var monk = create_monk();
		it('has 24% stagger', function () {
			assert.approx(monk.stagger(), 0.24);
		});
	});
	describe('with 2421 mastery rating', function () {
		var monk = create_monk({ratings: {mastery: 2421}});
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
			var monk = create_monk(init);
			it('has 411479 health', function () {
				assert.equal(monk.max_health(), 411479);
			});
		});
		describe('with 4182 haste rating', function () {
			var monk = create_monk({ratings: {haste: 4182}});
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
			var monk = create_monk(init);
			it('has 424723 health', function () {
				assert.equal(monk.max_health(), 424723);
			});
		});
		describe('with 23856 stamina', function () {
			var init = {};
			init.attrs = {
				stamina: 23856
			};
			var monk = create_monk(init);
			it('has 480387 health', function () {
				assert.equal(monk.max_health(), 480387);
			});
		});
		describe('with 3123 haste rating and weapon speed 3.6', function () {
			var monk = create_monk({ratings: {haste: 3123}, weapon_speed: 3.6});
			it('has 50.29% haste', function () {
				assert.approx(monk.haste(), 1.5029);
			});
			it('has a 10% chance to spawn a Gift of the Ox orb when doing a special attack', function () {	
				assert.equal(monk.gotox_chance(true, false), 0.1);
			});
			it('has a 21.6% chance to spawn a Gift fo the Ox orb when doing white damage', function () {
				assert.equal(monk.gotox_chance(false, false), 0.216);
			});
		});
		describe('with 14046 agility and 4901 crit rating', function () {
			var monk = create_monk({attrs: {agility: 14046}, ratings: {crit: 4901}});
			it('has 26.80% crit chance', function () {
				assert.approx(monk.crit(), 0.2680);
			});
		});
		describe('with 13378 agility and 4901 crit rating', function () {
			var monk = create_monk({attrs: {agility: 13378}, ratings: {crit: 4901}});
			it('has 26.27% crit chance', function () {
				assert.approx(monk.crit(), 0.2627);
			});
		});
		describe('with 14116 agility', function () {
			var monk = create_monk({attrs: {agility: 14116}});
			it('has 28565 attack power', function () {
				assert.equal(monk.attack_power(), 28565);
			});
			it('is healed 12067 from non-critical Gift of the Ox orbs', function () {
				// tooltip says 19279, but I get 12067, it appears the scaling factor has changed to 0.25 * AP
				assert.approx(monk.gotox_heal_size(), 12067);
			});
		});
		describe('with 14645 agility', function () {
			var monk = create_monk({attrs: {agility: 14645}});
			it('has 29623 attack power', function () {
				assert.equal(monk.attack_power(), 29623);
			});
		});
		describe('with 9815 agility', function () {
			var monk = create_monk({attrs: {agility: 9815}});
			it('is healed 9917 from non-critical Gift of the Ox orbs', function () {
				// tooltip says 14957, but I get 9917, it appears the scaling factor has changed to 0.25 * AP
				assert.approx(monk.gotox_heal_size(), 9917);
			});
		});
		describe('with 13604 agility', function () {
			var monk = create_monk({attrs: {agility: 13604}});
			it('guards for 82199', function () {
				assert.approx(monk.guard_size(), 82199, 2);
			});
		});
		describe('with 18295 agility', function () {
			var monk = create_monk({attrs: {agility: 18295}});
			it('guards for 120048', function () {
				assert.approx(monk.guard_size(), 120048);
			});
		});
	});
});
