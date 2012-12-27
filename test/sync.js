var ValueFuture = require('../lib/ValueFuture');
var LazyFuture = require('../lib/LazyFuture');



module.exports['sum sync'] = function(beforeExit, assert){
	var one = new ValueFuture(1);
	var two = new ValueFuture(2);
	var sum = new LazyFuture(one, two, function(one, two, cb){
		cb(one + two);
	});

	sum.get(function(value){
		assert.equal(value, 3);
	});

}


module.exports['sum sync alt'] = function(beforeExit, assert){
	var one = new ValueFuture(1);
	var two = new ValueFuture(2);
	var sum = new LazyFuture([one, two], function(futures, cb){
		cb(futures[0] + futures[1]);
	});

	sum.get(function(value){
		assert.equal(value, 3);
	});

}


module.exports['sum sync 2'] = function(beforeExit, assert){
	var one = new ValueFuture(1);
	var two = new ValueFuture(2);
	var sum = new LazyFuture(one, two, function(one, two, cb){
		cb(one + two);
	});

	sum.get(function(value){
		assert.equal(value, 3);
	});

	one.set(3)

	sum.get(function(value){
		assert.equal(value, 5);
	});

	one.dispose();
	two.dispose();
	sum.dispose();
}





module.exports['sum sync 3'] = function(beforeExit, assert){
	var firstValue = new ValueFuture(1);
	var secondValue = new ValueFuture(2);

	var countFirst = 0;
	var countSecond = 0;
	var countThird = 0;
	
	var firstDependency = new LazyFuture(firstValue, function(first, cb){
		countFirst++;
		cb(first);
	});
	var secondDependency = new LazyFuture(secondValue, function(second, cb){
		countSecond++;
		cb(second);
	});
	var thirdDependency = new LazyFuture(firstDependency, secondDependency, function(first, second, cb){
		countThird++;
		cb(first + second);
	});

	thirdDependency.get(function(value){
		assert.equal(value, 3);
	});
	assert.equal(countFirst, 1);
	assert.equal(countSecond, 1);
	assert.equal(countThird, 1);


	firstValue.set(3);
	thirdDependency.get(function(value){
		assert.equal(value, 5);
	});
	assert.equal(countFirst, 2);
	assert.equal(countSecond, 1);
	assert.equal(countThird, 2);


	secondValue.set(5);
	thirdDependency.get(function(value){
		assert.equal(value, 8);
	});
	assert.equal(countFirst, 2);
	assert.equal(countSecond, 2);
	assert.equal(countThird, 3);


	secondValue.set(5);
	thirdDependency.get(function(value){
		assert.equal(value, 8);
	});
	assert.equal(countFirst, 2);
	assert.equal(countSecond, 2);
	assert.equal(countThird, 3);

	
	secondValue.set(7);
	thirdDependency.get(function(value){
		assert.equal(value, 10);
	});
	assert.equal(countFirst, 2);
	assert.equal(countSecond, 3);
	assert.equal(countThird, 4);

	firstValue.dispose();
	secondValue.dispose();

	firstDependency.dispose();
	secondDependency.dispose();
	thirdDependency.dispose();
}






