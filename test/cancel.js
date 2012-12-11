var la = require('la');
var assert = require('assert');

module.exports['cancelTest0'] = function(){
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
			secondLa.get(av(4));
		}

		, function(){
		}

		, function(){
			firstLa.set(3);
		}

		, function(){
			secondLa.get(av(6))
		}
	];

	return sequenceRunner(sequence, 30)();

};


module.exports['cancelTest1'] = function(){
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
			secondLa.get(ae(la.CancelException));
		}

		, function(){
			firstLa.set(3);
		}

		, function(){
			secondLa.get(av(4))
		}
	];

	return sequenceRunner(sequence, 30)();

};





function sequenceRunner(fns, interval){
	
	return function(){
		var fnIndex = 0;
		var fnCount = fns.length;

		next();

		function next(){
			if(fnIndex < fnCount){
				var fn = fns[fnIndex];
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



