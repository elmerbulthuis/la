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
	
	one = la(one, function(one, cb){
		setTimeout(function(){
			cb(null, one);
		}, 1000);
	});
	two = la(two, function(two, cb){
		setTimeout(function(){
			cb(null, two);
		}, 1000);
	});
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





