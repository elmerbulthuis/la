var la = require('la');



module.exports['sum async'] = function(beforeExit, assert){
	var one = la(1);
	var two = la(2);
	var sum = la(one, two, function(one, two, cb){
		setTimeout(function(){
			cb(null, one + two);
		}, 1000);
	});

	sum.get(function(err, value){
		assert.ifError(err);
		assert.equal(value, 3);
	});

}



module.exports['sum async 2'] = function(beforeExit, assert){
	var one = la(1);
	var two = la(2);

	var countOne = 0;
	var countTwo = 0;
	var countSum = 0;
	
	one = la(one, function(one, cb){
		countOne++;
		setTimeout(function(){
			cb(null, one);
		}, 1000);
	});
	two = la(two, function(two, cb){
		countTwo++;
		setTimeout(function(){
			cb(null, two);
		}, 1000);
	});
	var sum = la(one, two, function(one, two, cb){
		countSum++;
		setTimeout(function(){
			cb(null, one + two);
		}, 1000);
	});

	sum.get(function(err, value){
		assert.ifError(err);
		assert.equal(value, 3);
	});

	beforeExit(function(){
		assert.equal(countOne, 1);
		assert.equal(countTwo, 1);
		assert.equal(countSum, 1);
	});
}




