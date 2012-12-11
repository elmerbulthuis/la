var la = require('la');

module.exports['countGet'] = function(beforeExit, assert){
	var count = 0;
	var firstLa = la(1);
	var secondLa = la(firstLa, function(firstValue, cb){
		setTimeout(function(){
			cb(null, firstValue + firstValue);
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
		return function(err, actual){
			count++;
			assert.isNull(err);
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











