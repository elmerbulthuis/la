var la = require('la');
var assert = require('assert');

module.exports['sequence1'] = sequence1Runner(-1);
module.exports['sequence1i'] = sequence1Runner(10);
module.exports['sequence2'] = sequence2Runner(-1);
module.exports['sequence2i'] = sequence2Runner(10);
module.exports['sequence3'] = sequence3Runner(-1);
module.exports['sequence3i'] = sequence3Runner(10);

module.exports['sequence4'] = sequence4Runner();



function sequence1Runner(interval){
	var firstLa = la(1);
	var firstCounters = getCounters(firstLa);

	var sequence = [

		function(){
			assert.deepEqual(firstCounters, [0, 0, 0, 0]);
		}
		
		, function(){
			firstLa.set(1);
		}

		, function(){
			assert.deepEqual(firstCounters, [0, 0, 0, 0]);
		}

		, function(){
			firstLa.set(2);
		}

		, function(){
			assert.deepEqual(firstCounters, [0, 0, 1, 1]);
		}

		, function(){
			firstLa.set(2);
		}

		, function(){
			assert.deepEqual(firstCounters, [0, 0, 1, 1]);
		}

		, function(){
			firstLa.set(3);
		}

		, function(){
			assert.deepEqual(firstCounters, [0, 0, 2, 2]);
		}

	];

	return sequenceRunner(sequence, interval);
}//sequence1Runner



function sequence2Runner(interval){
	var firstLa = la(1);
	var firstCounters = getCounters(firstLa);

	var secondLa = la(firstLa, function(firstValue, cb){
		cb(null, firstValue + firstValue);
	});
	var secondCounters = getCounters(secondLa);

	var sequence = [

		function(){
			firstLa.set(2);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 1, 1]);
			assert.eql(secondCounters, [0, 0, 0, 0]);
		}

		, function(){
			secondLa.get(av(4));
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 1, 1]);
			assert.eql(secondCounters, [1, 1, 0, 1]);
		}

		, function(){
			firstLa.set(3);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 2, 2]);
			assert.eql(secondCounters, [1, 1, 1, 1]);
		}

		, function(){
			firstLa.set(4);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 3, 3]);
			assert.eql(secondCounters, [1, 1, 1, 1]);
		}

		, function(){
			secondLa.get(av(8));
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 3, 3]);
			assert.eql(secondCounters, [2, 2, 1, 2]);
		}

	];

	return sequenceRunner(sequence, interval);
}//sequence2Runner




function sequence3Runner(interval){
	var firstLa = la(1);
	var firstCounters = getCounters(firstLa);

	var secondLa = la(firstLa, function(firstValue, cb){
		cb(null, firstValue + firstValue);
	});
	var secondCounters = getCounters(secondLa);

	var thirdLa = la(secondLa, function(secondValue, cb){
		cb(null, secondValue + secondValue);
	});
	var thirdCounters = getCounters(thirdLa);

	var sequence = [

		function(){
			firstLa.set(2);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 1, 1]);
			assert.eql(secondCounters, [0, 0, 0, 0]);
			assert.eql(thirdCounters, [0, 0, 0, 0]);
		}

		, function(){
			secondLa.get(av(4));
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 1, 1]);
			assert.eql(secondCounters, [1, 1, 0, 1]);
			assert.eql(thirdCounters, [0, 0, 0, 0]);
		}

		, function(){
			firstLa.set(3);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 2, 2]);
			assert.eql(secondCounters, [1, 1, 1, 1]);
			assert.eql(thirdCounters, [0, 0, 0, 0]);
		}


		, function(){
			thirdLa.get(av(12));
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 2, 2]);
			assert.eql(secondCounters, [2, 2, 1, 2]);
			assert.eql(thirdCounters, [1, 1, 0, 1]);
		}

		, function(){
			firstLa.set(4);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 3, 3]);
			assert.eql(secondCounters, [2, 2, 2, 2]);
			assert.eql(thirdCounters, [1, 1, 1, 1]);
		}


		, function(){
			secondLa.get(av(8));
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 3, 3]);
			assert.eql(secondCounters, [3, 3, 2, 3]);
			assert.eql(thirdCounters, [1, 1, 1, 1]);
		}

		, function(){
			firstLa.set(5);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 4, 4]);
			assert.eql(secondCounters, [3, 3, 3, 3]);
			assert.eql(thirdCounters, [1, 1, 1, 1]);
		}


	];

	return sequenceRunner(sequence, interval);
}//sequence3Runner





function sequence4Runner(){
	var firstLa = la(1);
	var firstCounters = getCounters(firstLa);

	var secondLa = la(firstLa, function(firstValue, cb){
		setTimeout(function(){
			cb(null, firstValue + firstValue);
		}, 50)
	});
	var secondCounters = getCounters(secondLa);


	var sequence = [

		function(){
			firstLa.set(2);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 1, 1]);
			assert.eql(secondCounters, [0, 0, 0, 0]);
		}

		, function(){
			secondLa.get(av(4));
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 1, 1]);
			assert.eql(secondCounters, [1, 0, 0, 0]);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 1, 1]);
			assert.eql(secondCounters, [1, 1, 0, 1]);
		}

		, function(){
			firstLa.set(3);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 2, 2]);
			assert.eql(secondCounters, [1, 1, 1, 1]);
		}

		, function(){
			secondLa.get(av(6));
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 2, 2]);
			assert.eql(secondCounters, [2, 1, 1, 1]);
		}

		, function(){
			assert.eql(firstCounters, [0, 0, 2, 2]);
			assert.eql(secondCounters, [2, 2, 1, 2]);
		}


	];

	return sequenceRunner(sequence, 30);

}//sequence4Runner





function sequenceRunner(fns, interval, cb){
	
	return function(){
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





function av(expect){
	return function(err, actual){
		assert.isNull(err);
		assert.equal(expect, actual);
	};
}

function ae(expect){
	return function(actual){
		assert.equal(expect, actual);
	};
}



function getCounters(la){
	var eventNames = [
		'busy', 'ready'
		, 'dirty', 'clean'
	];

	var counters = [0, 0, 0, 0];
	eventNames.forEach(function(eventName, eventNameIndex){
		la.on(eventName, function(){
			counters[eventNameIndex]++;
		})
	});

	return counters;
}





