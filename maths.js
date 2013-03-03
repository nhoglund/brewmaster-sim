
// fit a line to two points
exports.fit_line = function (a, b) {
	var slope = (b.y - a.y) / (b.x - a.x);
	var base = a.y - slope * a.x;
	return {base: base, slope: slope}
}
