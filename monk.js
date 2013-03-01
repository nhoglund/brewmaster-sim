var character = require('./character').character;

var stance = {
	STURDY_OX: "Stance of the Sturdy Ox",
	FIERCE_TIGER: "Stance of the Fierce Tiger"
};

function monk (init) {
	init = init || {};
	var sim = init.sim;

	var ch = character(init);
	var attrs = ch.attrs;
	var ratings = ch.ratings;
	var stats = ch.stats;

	var leather_specialization = true;
	var swift_reflexes = true;
	var two_handed_weapon = true;

	var stagger_modifier = 0;

	function crit_from_agility (agi) {
		var x1 = 13378;
		var x2 = 14046;
		var y1 = 0.1810;
		var y2 = 0.1863;
		var base = ((x2 * y1) - (x1 * y2)) / (x2 - x1);
		return agi * (y1 - base) / x1 + base;
	};

	var that = {};
	that.stance = init.stance;

	that.attrs = attrs;
	that.ratings = ratings;
	that.stats = stats;

	function max_health () {
		return Math.floor(146403 + attrs.stamina * 14);
	};

	function parry () {
		var parry_chance = stats.parry;
		if (swift_reflexes) {
			parry_chance += 0.05;
		}
	};
	
	function dodge () {
		return 0;
	};

	var vengeance = 0;
	var vengeance_expires = 0;
	var health = max_health();
	
	function update_vengeance () {
		if (sim.time() >= vengeance_expiry) {
			vengeance = 0;
		}
	};
	
	function damage(attacker, damage_taken) {
		// Vengeance algorithm:
		// http://wow.joystiq.com/2012/08/07/vengeance-no-longer-capped-for-tanks/
		if (Math.random() < parry() + dodge()) {
			// Avoid the strike
			
			if (attacker.level() >= level - 3) {
				// Avoidance will not count against you. Avoiding an attack will extend
				// the current Vengeance stack back to 20 sec (as if you were hit again
				// for the same DPS).
				vengeance_expiry = sim.time() + 20;	
			}
		}
		else {
			// TODO: does this run if the first boss attack is avoided?
			var equilibrium = damage_taken / 1.5;			
			if (vengeance < equilibrium / 2) {
				vengeance = equilibrium / 2;
			}
	
			vengeance = 0.05 * damage_taken + vengeance * (vengeance_expires - sim.time()) / 20;
		}
		
		sim.in(20, update_vengeance);
	};

	that.mastery = function () {
		return Math.floor((4 + ratings.mastery * 0.000835) * 100) / 100;
	}

	// Stagger amount (0 - 1)
	that.stagger = function () {
		var base = 0.2;
		var from_mastery = Math.floor(that.mastery() * 10) / 1000;
		return base + from_mastery + stagger_modifier;
	};

	that.max_health = max_health;
	
	that.haste = function () {
		var factor = stats.haste;
		if (two_handed_weapon) {
			factor *= 1.4;
		}
		return factor;
	}

	that.crit = function () {
		var from_rating = that.stats.crit;
		var agi = that.attrs.agility;
		var from_agi = crit_from_agility(agi);
		var sum = from_rating + from_agi;
		return sum;
	};	that.max_health = function () {
		return Math.floor(146403 + attrs.stamina * 14);
	};

	that.parry = parry;
	that.dodge = dodge;
	
	that.blackout_kick = function (target) {
		stagger_modifier += 0.2;
		parry += 0.2;

		sim.in(6, function () {stagger_modifier -= 0.2;});
		sim.in(6, function () {parry -= 0.2;});
	};

	return that;
}

exports.monk = monk;
exports.stance = stance;