var ValueFuture = require('../lib/ValueFuture');
var LazyFuture = require('../lib/LazyFuture');


module.exports['cancel'] = function(beforeExit, assert){
	var countCancel = 0;
	var countGet = 0;
	var firstLa = new ValueFuture(1);
	var secondLa = new LazyFuture(firstLa, function(firstValue, cb){
		return setTimeout(function(){
			cb(firstValue + firstValue);
		}, 50);
	}, function(loadResult){
		clearTimeout(loadResult);
	}, true);

	secondLa.on('cancel', function(){
		countCancel++;
	});

	var sequence = [

		function(){
			secondLa.get(err);
			firstLa.set(2);
		}

		, function(){
			secondLa.get(av(4))
			firstLa.set(3);
		}

		, function(){
			secondLa.get(av(6));
			secondLa.get(av(6));
		}

	];

	sequenceRunner(sequence, 30)();

	beforeExit(function(){
		assert.equal(countCancel, 2);
		assert.equal(countGet, 2);
	});

	function err(){
		throw 'err';
	}
	function av(expect){
		return function(actual){
			countGet++;
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











