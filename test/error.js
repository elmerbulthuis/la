var ValueFuture = require('../lib/ValueFuture');
var LazyFuture = require('../lib/LazyFuture');


module.exports['error event'] = function(beforeExit, assert){
	var counter = 0;
	var firstLa = new ValueFuture(1);
	var secondLa = new LazyFuture(firstLa, function(firstValue, cb){
		setTimeout(function(){
			cb('error!', firstValue);
		}, 10);
	}, true);


	beforeExit(function(){
		assert.equal(counter, 1);
	});

	secondLa.on('error', function(err){
		counter++;
		assert.equal('error!', err)
	});

	secondLa.get(function(err, value){
		assert.equal(value, 1);
	});
	secondLa.get(function(err, value){
		assert.equal(value, 1);
	});
	secondLa.get(function(err, value){
		assert.equal(value, 1);
	});

};


module.exports['error cb'] = function(beforeExit, assert){
	var counter = 0;
	var firstLa = new ValueFuture(1);
	var secondLa = new LazyFuture(firstLa, function(firstValue, cb){
		setTimeout(function(){
			cb('error!', firstLa);
		}, 10);
	}, true);

	beforeExit(function(){
		assert.equal(counter, 3);
	});

	secondLa.get(function(err, value){
		counter++;
		assert.equal('error!', err)
	});
	secondLa.get(function(err, value){
		counter++;
		assert.equal('error!', err)
	});
	secondLa.get(function(err, value){
		counter++;
		assert.equal('error!', err)
	});

};



module.exports['error both'] = function(beforeExit, assert){
	var counter = 0;
	var firstLa = new ValueFuture(1);
	var secondLa = new LazyFuture(firstLa, function(firstValue, cb){
		setTimeout(function(){
			cb('error!', firstLa);
		}, 10);
	}, true);


	beforeExit(function(){
		assert.equal(counter, 4);
	});

	secondLa.on('error', function(err){
		counter++;
		assert.equal('error!', err)
	});

	secondLa.get(function(err, value){
		counter++;
		assert.equal('error!', err)
	});
	secondLa.get(function(err, value){
		counter++;
		assert.equal('error!', err)
	});
	secondLa.get(function(err, value){
		counter++;
		assert.equal('error!', err)
	});

};

