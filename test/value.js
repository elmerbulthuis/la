var ValueFuture = require('../lib/ValueFuture');



module.exports['one'] = function(beforeExit, assert){
	var one = new ValueFuture(1);

	one.get(function(err, value){
		assert.equal(value, 1);
	});
}




module.exports['two'] = function(beforeExit, assert){
	var two = new ValueFuture(2);

	two.get(function(err, value){
		assert.equal(value, 2);
	});

	two.set(4);

	two.get(function(err, value){
		assert.equal(value, 4);
	});
}




module.exports['three'] = function(beforeExit, assert){
	var three = new ValueFuture(3);
	var eventCounters = {
		change: 0
	};
	
	Object.keys(eventCounters).forEach(function(key){
		three.on(key, function(){
			eventCounters[key]++;
		})
	});

	three.set(4);
	three.set(5);
	three.set(5);
	three.set(6);

	beforeExit(function(){
		assert.eql(eventCounters, {
			change: 3
		});
	});

}


