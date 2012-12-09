var la = require('la');



module.exports['sum sync'] = function(beforeExit, assert){
	var one = la(1);
	var two = la(2);
	var sum = la(one, two, function(one, two, cb){
		cb(null, one + two);
	});

	sum.get(function(err, value){
		assert.ifError(err);
		assert.equal(value, 3);
	});

}


module.exports['sum sync 2'] = function(beforeExit, assert){
	var one = la(1);
	var two = la(2);
	var sum = la(one, two, function(one, two, cb){
		cb(null, one + two);
	});

	sum.get(function(err, value){
		assert.ifError(err);
		assert.equal(value, 3);
	});

	one.set(3)

	sum.get(function(err, value){
		assert.ifError(err);
		assert.equal(value, 5);
	});

}





module.exports['sum sync 3'] = function(beforeExit, assert){
	var firstValue = la(1);
	var secondValue = la(2);

	var countFirst = 0;
	var countSecond = 0;
	var countThird = 0;
	
	var firstDependency = la(firstValue, function(first, cb){
		countFirst++;
		cb(null, first);
	});
	var secondDependency = la(secondValue, function(second, cb){
		countSecond++;
		cb(null, second);
	});
	var thirdDependency = la(firstDependency, secondDependency, function(first, second, cb){
		countThird++;
		cb(null, first + second);
	});

	thirdDependency.get(function(err, value){
		assert.ifError(err);
		assert.equal(value, 3);
	});
	assert.equal(countFirst, 1);
	assert.equal(countSecond, 1);
	assert.equal(countThird, 1);


	firstValue.set(3);
	thirdDependency.get(function(err, value){
		assert.ifError(err);
		assert.equal(value, 5);
	});
	assert.equal(countFirst, 2);
	assert.equal(countSecond, 1);
	assert.equal(countThird, 2);


	secondValue.set(5);
	thirdDependency.get(function(err, value){
		assert.ifError(err);
		assert.equal(value, 8);
	});
	assert.equal(countFirst, 2);
	assert.equal(countSecond, 2);
	assert.equal(countThird, 3);


	secondValue.set(5);
	thirdDependency.get(function(err, value){
		assert.ifError(err);
		assert.equal(value, 8);
	});
	assert.equal(countFirst, 2);
	assert.equal(countSecond, 2);
	assert.equal(countThird, 3);

	
	secondValue.set(7);
	thirdDependency.get(function(err, value){
		assert.ifError(err);
		assert.equal(value, 10);
	});
	assert.equal(countFirst, 2);
	assert.equal(countSecond, 3);
	assert.equal(countThird, 4);


}






