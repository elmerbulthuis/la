var ValueFuture = require('../lib/ValueFuture');
var LazyFuture = require('../lib/LazyFuture');



module.exports['sum async'] = function(beforeExit, assert){
	var one = new ValueFuture(1);
	var two = new ValueFuture(2);
	var sum = new LazyFuture(one, two, function(one, two, cb){
		setTimeout(function(){
			cb(null, one + two);
		}, 1000);
	});

	sum.get(function(value){
		assert.equal(value, 3);
	});

}



module.exports['sum async 2'] = function(beforeExit, assert){
	var one = new ValueFuture(1);
	var two = new ValueFuture(2);

	var countOne = 0;
	var countTwo = 0;
	var countSum = 0;
	
	one = new LazyFuture(one, function(one, cb){
		countOne++;
		setTimeout(function(){
			cb(null, one);
		}, 1000);
	});
	two = new LazyFuture(two, function(two, cb){
		countTwo++;
		setTimeout(function(){
			cb(null, two);
		}, 1000);
	});
	var sum = new LazyFuture(one, two, function(one, two, cb){
		countSum++;
		setTimeout(function(){
			cb(null, one + two);
		}, 1000);
	});

	sum.get(function(value){
		assert.equal(value, 3);
	});

	beforeExit(function(){
		assert.equal(countOne, 1);
		assert.equal(countTwo, 1);
		assert.equal(countSum, 1);
	});
}




