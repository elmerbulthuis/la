/*!
la by "Elmer Bulthuis" <elmerbulthuis@gmail.com>
*/

(function(global){

	var CancelException = {
		toString: function(){
			return 'cancelled';
		}
	}

	if(typeof define === "function" && define.amd){
		define([], _define);
		return;
	}

	if(typeof module !== 'undefined' && module.exports){
		module.exports = _define();
		return;
	}

	global.la = _define();
	return;



	/* helpers */

	function isArray(){
		return Array.isArray.apply(this, arguments);
	}

	function isFunction(value){
		return typeof value === 'function';
	}

	/* */




	function _define(){

		_la.CancelException = CancelException;

		return _la;


/* * * * * * * * * * * * * * * * * * */


function _la(){
	var la = {};


	var getValueCbs = [];
	var stateHandlers = [];
	var valueHandlers = [];

	var cachedValue;
	var dependencies;
	var valueLoader;
	/*
	0: initial
	2: loading
	8: ready
	*/
	var state;


	var argumentCount = arguments.length;
	if(isFunction(arguments[argumentCount - 1])){
		cachedValue = null;
		dependencies = [];
		for(var argumentIndex = 0; argumentIndex < argumentCount - 1; argumentIndex++){
			var argument = arguments[argumentIndex];
			dependencies.push(argument);
		}
		valueLoader = arguments[argumentCount - 1];
		state = 0;
	}
	else{
		if(argumentCount > 1) throw 'bad arguments';

		cachedValue = arguments[0];
		dependencies = [];
		valueLoader = null;
		state = 8;
	}



	_setupDependencies(dependencies);

	la.get = _getValue;
	la.set = _setValue;
	la.onState = _onState;
	la.offState = _offState;
	la.onValue = _onValue;
	la.offValue = _offValue;
	la.dispose = _dispose;



	function _dispose(){
		_teardownDependencies(dependencies);

		delete la.get;
		delete la.set;
		delete la.onState;
		delete la.offState;
		delete la.onValue;
		delete la.offValue;
		delete la.dispose;
	}//_dispose



	function _setupDependencies(dependencies){
		dependencies.forEach(function(dependency){
			if(isArray(dependency)){
				_setupDependencies(dependency);
			}
			else{
				dependency.onState(_dependency_statechange);
			}
		});
	}//_setupDependencies
	
	function _teardownDependencies(dependencies){
		dependencies.forEach(function(dependency){
			if(isArray(dependency)){
				_teardownDependencies(dependency);
			}
			else{
				dependency.offState(_dependency_statechange);
			}
		});
	}//_teardownDependencies

	function _dependency_statechange(state){
		state === 0 && _setState(0);
	}//_dependency_statechange


	function _loadDependencies(dependencies, cb){
		var countdown = dependencies.length;
		var results = new Array(countdown);

		dependencies.forEach(function(dependency, dependencyIndex){
			if(isArray(dependency)){
				_loadDependencies(dependency, function(err, value){
					results[dependencyIndex] = value;
					if(!countdown-- || err) cb(err, results);
				});
			}
			else{
				dependency.get(function(err, value){
					results[dependencyIndex] = value;
					if(!countdown-- || err) cb(err, results);
				});
			}
		});

		if(!countdown--) cb(null, results);
	}//_loadDependencies


	function _loadValue(){
		_setState(2);

		_loadDependencies(dependencies, function(err, results){
			if(err){
		 		for(var cb = getValueCbs.shift(); cb; cb = getValueCbs.shift()) cb(err, null);
		 		_setState(0);
		 		return;
			}

			valueLoader.apply(this, results.concat([function(err, result){
		 		for(var cb = getValueCbs.shift(); cb; cb = getValueCbs.shift()) cb(err, result);

				cachedValue = result;
				_setState(8);
			}]));
		});

	}//_loadValue





	function _getValue(cb){
		if(!cb) throw 'plese supply a callback';

		switch(state){
			case 0:
			getValueCbs.push(cb);
			_loadValue();
			break;

			case 2:
			getValueCbs.push(cb);
			break;

			case 8:
			cb(null, cachedValue);
			break;

			default: throw "invalid state " + state + ".";
		}

	}//_getValue

	function _setValue(value){
		if(cachedValue === value) return;

		_setState(0);
		cachedValue = value;
		_setState(8);
	}//_setValue

	function _onValue(handler){
		_offValue(handler);
		valueHandlers.push(handler);
		_getValue(handler);
	}//_onValue

	function _offValue(handler){
		var handlerIndex = valueHandlers.indexOf(handler);
		if(handlerIndex >= 0) valueHandlers.splice(handlerIndex, 1);
	}//_offValue



	function _getState(){
		return state;
	}//_getState

	function _setState(value){
		if(state === value) return;

		if(value === 0){
	 		for(var cb = getValueCbs.shift(); cb; cb = getValueCbs.shift()) cb(CancelException, null);
		}

		stateHandlers.forEach(function(stateHandler){
			stateHandler(value);
		}, this);

		state = value;

		if(value === 8){
			valueHandlers.forEach(function(valueHandler){
				_getValue(valueHandler);
			}, this);
		}

	}//_setState

	function _onState(handler){
		_offState(handler);
		stateHandlers.push(handler);
	}//_onState

	function _offState(handler){
		var handlerIndex = stateHandlers.indexOf(handler);
		if(handlerIndex >= 0) stateHandlers.splice(handlerIndex, 1);
	}//_offState


	return la;
}

/* * * * * * * * * * * * * * * * * * */


	}//_define

})(this);
