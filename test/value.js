var la = require('la');



module.exports['model'] = function(beforeExit, assert){
	var model = {
		first: la(1)
		, second: la(2)
	};

	var firstCount = 0;
	var secondCount = 0;
	var first;
	var second;

	model.first.onValue(function(err, value){
		firstCount++;
		first = value;
	});
	model.second.onValue(function(err, value){
		secondCount++;
		second = value;
	});

	assert.equal(first, 1);
	assert.equal(second, 2);

	model.first.set(3);
	model.second.set(4);

	assert.equal(first, 3);
	assert.equal(second, 4);

	model.first.set(5);
	assert.equal(first, 5);

	model.second.set(6);
	assert.equal(second, 6);

	assert.equal(firstCount, 3);
	assert.equal(secondCount, 3);


	model.first.set(5);
	model.second.set(5);

	assert.equal(firstCount, 3);
	assert.equal(secondCount, 4);

	assert.equal(first, 5);
	assert.equal(second, 5);

};
