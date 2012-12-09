var la = require('la');



module.exports['model'] = function(beforeExit, assert){
	var model = {
		first: la(1)
		, second: la(2)
	};

	var first;
	var second;

	model.first.onValue(function(err, value){
		first = value;
	});
	model.second.onValue(function(err, value){
		second = value;
	});

	assert.equal(first, 1);
	assert.equal(second, 2);

	model.first.set(3);
	model.second.set(4);

	assert.equal(first, 3);
	assert.equal(second, 4);

};
