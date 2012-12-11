var la = require('la');
var assert = require('assert');
var eql = assert.deepEqual;


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
			eql(firstCounters, [0, 0, 0, 0]);
		}
		
		, function(){
			firstLa.set(1);
		}

		, function(){
			eql(firstCounters, [0, 0, 0, 0]);
		}

		, function(){
			firstLa.set(2);
		}

		, function(){
			eql(firstCounters, [0, 0, 1, 1]);
		}

		, function(){
			firstLa.set(2);
		}

		, function(){
			eql(firstCounters, [0, 0, 1, 1]);
		}

		, function(){
			firstLa.set(3);
		}

		, function(){
			eql(firstCounters, [0, 0, 2, 2]);
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
			eql(firstCounters, [0, 0, 1, 1]);
			eql(secondCounters, [0, 0, 1, 1]);
		}

		, function(){
			secondLa.get(av(4));
		}

		, function(){
			eql(firstCounters, [0, 0, 1, 1]);
			eql(secondCounters, [1, 1, 1, 2]);
		}

		, function(){
			firstLa.set(3);
		}

		, function(){
			eql(firstCounters, [0, 0, 2, 2]);
			eql(secondCounters, [1, 1, 2, 2]);
		}

		, function(){
			firstLa.set(4);
		}

		, function(){
			eql(firstCounters, [0, 0, 3, 3]);
			eql(secondCounters, [1, 1, 3, 3]);
		}

		, function(){
			secondLa.get(av(8));
		}

		, function(){
			eql(firstCounters, [0, 0, 3, 3]);
			eql(secondCounters, [2, 2, 3, 4]);
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
			eql(firstCounters, [0, 0, 1, 1]);
			eql(secondCounters, [0, 0, 1, 1]);
			eql(thirdCounters, [0, 0, 1, 1]);
		}

		, function(){
			secondLa.get(av(4));
		}

		, function(){
			eql(firstCounters, [0, 0, 1, 1]);
			eql(secondCounters, [1, 1, 1, 2]);
			eql(thirdCounters, [0, 0, 1, 1]);
		}

		, function(){
			firstLa.set(3);
		}

		, function(){
			eql(firstCounters, [0, 0, 2, 2]);
			eql(secondCounters, [1, 1, 2, 2]);
			eql(thirdCounters, [0, 0, 2, 2]);
		}


		, function(){
			thirdLa.get(av(12));
		}

		, function(){
			eql(firstCounters, [0, 0, 2, 2]);
			eql(secondCounters, [2, 2, 2, 3]);
			eql(thirdCounters, [1, 1, 2, 3]);
		}

		, function(){
			firstLa.set(4);
		}

		, function(){
			eql(firstCounters, [0, 0, 3, 3]);
			eql(secondCounters, [2, 2, 3, 3]);
			eql(thirdCounters, [1, 1, 3, 3]);
		}


		, function(){
			secondLa.get(av(8));
		}

		, function(){
			eql(firstCounters, [0, 0, 3, 3]);
			eql(secondCounters, [3, 3, 3, 4]);
			eql(thirdCounters, [1, 1, 3, 3]);
		}

		, function(){
			firstLa.set(5);
		}

		, function(){
			eql(firstCounters, [0, 0, 4, 4]);
			eql(secondCounters, [3, 3, 4, 4]);
			eql(thirdCounters, [1, 1, 4, 4]);
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
			eql(firstCounters, [0, 0, 1, 1]);
			eql(secondCounters, [0, 0, 1, 1]);
		}

		, function(){
			secondLa.get(av(4));
		}

		, function(){
			eql(firstCounters, [0, 0, 1, 1]);
			eql(secondCounters, [1, 0, 1, 1]);
		}

		, function(){
			eql(firstCounters, [0, 0, 1, 1]);
			eql(secondCounters, [1, 1, 1, 2]);
		}

		, function(){
			firstLa.set(3);
		}

		, function(){
			eql(firstCounters, [0, 0, 2, 2]);
			eql(secondCounters, [1, 1, 2, 2]);
		}

		, function(){
			secondLa.get(av(6));
		}

		, function(){
			eql(firstCounters, [0, 0, 2, 2]);
			eql(secondCounters, [2, 1, 2, 2]);
		}

		, function(){
			eql(firstCounters, [0, 0, 2, 2]);
			eql(secondCounters, [2, 2, 2, 3]);
		}


	];

	return sequenceRunner(sequence, 30);

}//sequence4Runner





function sequenceRunner(fns, interval){
	
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





