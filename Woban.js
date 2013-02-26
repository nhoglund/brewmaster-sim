var monk = require('./monk').monk;

var attrs = {
	strength: 183,
	agility: 14046,
	stamina: 23937,
	intellect: 260,
	spirit: 272
};

var ratings = {
	haste: 3123,
	hit: 2837,
	crit: 4901,
	expertise: 3169,
	armor: 17920,
	dodge: 320,
	parry: 0,
	mastery: 2436
};

exports.Woban = monk({attrs: attrs, ratings: ratings});