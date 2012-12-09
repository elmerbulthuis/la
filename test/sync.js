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





