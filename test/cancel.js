var la = require('la');

module.exports['cancel1'] = function(beforeExit, assert){
	var first = la(1);
	
	var second = la(first, function(first, cb){
		setTimeout(function(){
			cb(null, first + 1);
		}, 1000);
	});
	
	var third = la(first, second, function(first, second, cb){
		setTimeout(function(){
			cb(null, first + second);
		}, 1000);
	});

	first.get(asyncAssert(1));

	third.get(function(err, value){
		//assert.equal(err, la.CancelException);
	});

	first.set(5);

	function asyncAssert(expect){
		return function(err, actual){
			if(err) throw err;
			assert.equal(expect, actual);
		};
	}

};


