var character = function (init)
{
	init = init || {};

	var attrs = init.attrs || {};
	attrs.strength = attrs.strength || 0;
	attrs.agility = attrs.agility || 0;
	attrs.stamina = attrs.stamina || 0;
	attrs.intellect = attrs.intellect || 0;
	attrs.spirit = attrs.spirit || 0;

	var ratings = init.ratings || {};
	ratings.haste = ratings.haste || 0;
	ratings.hit = ratings.hit || 0;
	ratings.expertise = ratings.expertise || 0;
	ratings.crit = ratings.crit || 0;
	ratings.armor = ratings.armor || 0;
	ratings.dodge = ratings.dodge || 0;
	ratings.parry = ratings.parry || 0;
	ratings.mastery = ratings.mastery || 0;
	ratings.pvp_power = ratings.pvp_power || 0;
	ratings.resilience = ratings.resilience || 0;

	var stats = {};
	stats.hit        = ratings.hit       / 34000;
	stats.haste      = ratings.haste     / 42500;
	stats.crit       = ratings.crit      / 60000;
	stats.expertise  = ratings.expertise / 34000;
	stats.dodge      = ratings.dodge     / 88500;
	stats.pvp_power  = ratings.pvp_power / 26500;
	stats.resilience = 1 - Math.pow(0.99, ratings.resilience / 310);
	stats.haste      = 1 + ratings.haste / 42500;
	stats.parry      = ratings.parry     / 88500;
	
	return {attrs: init.attrs, ratings: ratings, stats: stats};
}

exports.character = character;