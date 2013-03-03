var create_character = require('./character').create_character;

var stance = {
	STURDY_OX: "Stance of the Sturdy Ox",
	FIERCE_TIGER: "Stance of the Fierce Tiger"
};

function create_monk (init) {
	init = init || {};
	var sim = init.sim;

	var ch = create_character(init);
	var attrs = ch.attrs;
	var ratings = ch.ratings;
	var stats = ch.stats;

	var leather_specialization = true;
	var swift_reflexes = true;
	var two_handed_weapon = true;

	function haste () {
		var factor = stats.haste;
		if (two_handed_weapon) {
			factor *= 1.4;
		}
		return factor;
	}

	// The weapon speed without haste
	var weapon_speed_naked = init.weapon_speed || 0;
	
	function weapon_speed () {
		return weapon_speed_naked / haste();
	}

	var gotox_orbs = 0;

	// what is the chance from a damaging attack to spawn a Gift of the Ox orb?
	function gotox_chance (special, 		// is it a special attack?
						   tiger_strike)	// is it a tiger strike?
	{
		// Gift of the Ox
		var gotox_chance;
		if (special && !tiger_strike) {
			return 0.1;	// 10% chance to spawn an orb
		}
		else {
			return (two_handed_weapon ? 0.06 : 0.03) * weapon_speed_naked;
		}
	}

	function deal_damage (special, tiger_strike) {
		if (Math.random() < gotox_chance(special, tiger_strike)) {
			gotox_orbs++;
		}
	}
	
	var stagger_modifier = 0;

	function crit_from_agility (agi) {
		var x1 = 13378;
		var x2 = 14046;
		var y1 = 0.1810;
		var y2 = 0.1863;
		var base = ((x2 * y1) - (x1 * y2)) / (x2 - x1);
		return agi * (y1 - base) / x1 + base;
	};

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
	
	function damage(attacker, attack) {
		// Vengeance algorithm:
		// http://wow.joystiq.com/2012/08/07/vengeance-no-longer-capped-for-tanks/
		if (Math.random() < parry() + dodge()) {
			// Avoid the strike
			
			if (attacker.level >= level - 3) {
				// Avoidance will not count against you. Avoiding an attack will extend
				// the current Vengeance stack back to 20 sec (as if you were hit again
				// for the same DPS).
				vengeance_expiry = sim.time() + 20;	
			}
		}
		else {
			// TODO: does this run if the first boss attack is avoided?
			var attack_speed = attack.special ? attacker.auto_attack_speed : 60;
			var equilibrium = attack.damage / attack_speed;
			if (vengeance < equilibrium / 2) {
				vengeance = equilibrium / 2;
			}

			vengeance = 0.018 * attack.damage + vengeance * (vengeance_expires - sim.time()) / 20;
		}

		sim.in(20, update_vengeance);
	};

	function mastery () {
		return Math.floor((4 + ratings.mastery * 0.000835) * 100) / 100;
	}

	// Stagger amount (0 - 1)
	function stagger () {
		var base = 0.2;
		var from_mastery = Math.floor(mastery() * 10) / 1000;
		return base + from_mastery + stagger_modifier;
	};

	function crit () {
		var from_rating = stats.crit;
		var agi = attrs.agility;
		var from_agi = crit_from_agility(agi);
		var sum = from_rating + from_agi;
		return sum;
	};
	
	blackout_kick = function (target) {
		stagger_modifier += 0.2;
		parry += 0.2;

		sim.in(6, function () {stagger_modifier -= 0.2;});
		sim.in(6, function () {parry -= 0.2;});
	};

	var that = {
		stance: init.stance,
		attrs: attrs,
		ratings: ratings,
		stats: stats,
		max_health: max_health,
		haste: haste,
		parry: parry,
		dodge: dodge,
		gotox_chance: gotox_chance,
		mastery: mastery,
		stagger: stagger,
		crit: crit,
		blackout_kick: blackout_kick
	};



	return that;
}

exports.create_monk = create_monk;
exports.stance = stance;