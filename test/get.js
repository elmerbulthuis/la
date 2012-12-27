var ValueFuture = require('../lib/ValueFuture');
var DependencyFuture = require('../lib/DependencyFuture');


module.exports['countGet'] = function(beforeExit, assert){
	var count = 0;
	var firstLa = new ValueFuture(1);
	var secondLa = new DependencyFuture(firstLa, function(firstValue, cb){
		setTimeout(function(){
			cb(firstValue + firstValue);
		}, 50)
	});


	var sequence = [

		function(){
			firstLa.set(2);
		}

		, function(){
			secondLa.get(av(4))
			secondLa.get(av(4))
		}

		, function(){
			firstLa.get(av(2))
			secondLa.get(av(4))
			secondLa.get(av(4))
		}

	];

	sequenceRunner(sequence, 30)();

	beforeExit(function(){
		assert.equal(count, 5);
	});

	function av(expect){
		return function(actual){
			count++;
			assert.equal(expect, actual);
		};
	}

};







function sequenceRunner(fns, interval){
	
	return function(cb){
		var fnIndex = 0;
		var fnCount = fns.length;

		next();

		function next(){
			if(fnIndex < fnCount){
				var fn = fns[fnIndex];
				//console.log('step ' + fnIndex);
				fn();
				fnIndex++;
				if(interval < 0){
					next();
				}
				else{
					setTimeout(next, interval);
				}
			}
			else{
				cb && cb();
			}
		}//next

	}//return
	
}//sequenceRunner











