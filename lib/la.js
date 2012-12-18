/*!
la by "Elmer Bulthuis" <elmerbulthuis@gmail.com>
*/

(function(global){

	var CancelException = {
		toString: function(){
			return 'cancelled';
		}
	}

	if(typeof define === 'function' && define.amd){
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
	}//isArray

	function isFunction(value){
		return typeof value === 'function';
	}//isFunction

	/* */




	function _define(){

		_la.CancelException = CancelException;

		return _la;


/* * * * * * * * * * * * * * * * * * */


function _la(){
	var eventHandlers = {
		'dirty': []
		, 'clean': []
		, 'busy': []
		, 'ready': []
	};

	var la = {};


	var getValueCbs = [];
	var binders = [];

	var value;
	var dependencies;
	var loader;
	var isDirty;
	var isBusy;


	var argumentCount = arguments.length;
	if(isFunction(arguments[argumentCount - 1])){
		value = null;
		dependencies = [];
		for(var argumentIndex = 0; argumentIndex < argumentCount - 1; argumentIndex++){
			var argument = arguments[argumentIndex];
			dependencies.push(argument);
		}
		loader = arguments[argumentCount - 1];
		isDirty = true;
		isBusy = false
	}
	else{
		if(argumentCount > 1) throw 'bad arguments';

		value = arguments[0];
		dependencies = [];
		loader = null;
		isDirty = false;
		isBusy = false
	}



	_setupDependencies(dependencies);

	la.get = _getValue;
	la.set = _setValue;
	la.bind = _bindValue;
	la.unbind = _unbindValue;
	la.dispose = _dispose;
	
	la.on = _on;
	la.off = _off;

	// la.load = _loadValue;
	// la.unload = _unloadValue;


	function _dispose(){
		_teardownDependencies(dependencies);

		delete la.get;
		delete la.set;
		delete la.bind;
		delete la.unbind;
		delete la.dispose;
		
		// delete la.load;
		// delete la.unload;
	}//_dispose





	function _setDirty(){
		if(isDirty) return;

		isDirty = true;
		
		_fire('dirty', isDirty);

		binders.forEach(function(binder){
			_getValue(binder);
		});

	}//_setDirty
	function _setClean(){
		if(!isDirty) return;

		isDirty = false;

		_fire('clean', isDirty);
	}//_setClean
	function _setBusy(){
		if(isBusy) return;

		isBusy = true;

		_fire('busy', isBusy);
	}//_setBudy
	function _setReady(){
		if(!isBusy) return;

		isBusy = false;

		_fire('ready', isBusy);
	}//_setReady


	function _setupDependencies(dependencies){
		dependencies.forEach(function(dependency){
			if(isArray(dependency)){
				_setupDependencies(dependency);
			}
			else{
				dependency.on('dirty', _dependency_dirty);
			}
		});
	}//_setupDependencies
	
	function _teardownDependencies(dependencies){
		dependencies.forEach(function(dependency){
			if(isArray(dependency)){
				_teardownDependencies(dependency);
			}
			else{
				dependency.off('dirty', _dependency_dirty);
			}
		});
	}//_teardownDependencies

	function _dependency_dirty(isDirty){
		_unloadValue();
	}//_dependency_dirty


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
		if(!loader) return;
		if(isBusy) return;

		_setBusy();

		_loadDependencies(dependencies, function(err, results){
			if(err){
		 		while(getValueCbs.length) getValueCbs.shift()(err, null);

		 		_setClean();
		 		_setReady();
			}
			else{
				loader.apply(this, results.concat([function(err, result){
					if(err){
				 		while(getValueCbs.length) getValueCbs.shift()(err, null);
		
				 		_setClean();
				 		_setReady();
				 	}
				 	else{
				 		_setReady();

						_setValue(result);
				 	}
				}]));
			}

		});

	}//_loadValue

	function _unloadValue(){

		_setClean();
		_setReady();
		
		while(getValueCbs.length) getValueCbs.shift()(CancelException, null);

		_setDirty();

	}//unloadValue




	function _getValue(cb){
		if(!cb) throw 'plese supply a callback';

		if(isDirty){
			getValueCbs.push(cb);
			_loadValue();
		}
		else{
			cb(null, value);
		}

	}//_getValue

	function _setValue(newValue){
		if(value === newValue) return;

		_setDirty();
		value = newValue;
		_setClean();

 		while(getValueCbs.length) getValueCbs.shift()(null, value);
	}//_setValue



	function _bindValue(binder){
		_unbindValue(binder);
		binders.push(binder);
		_getValue(binder);
	}//_bind

	function _unbindValue(binder){
		var binderIndex = binders.indexOf(binder);
		if(binderIndex >= 0) binders.splice(binderIndex, 1);
	}//_unbind










	function _fire(eventName, eventArg){
		var handlers = eventHandlers[eventName];
		if(!handlers) return false;

		handlers.forEach(function(handler, handlerIndex){
			handler.call(null, eventArg);
		});

		return true;
	}//_dire

	function _on(eventName, eventHandler){
		_off(eventName, eventHandler);

		var handlers = eventHandlers[eventName];
		if(!handlers) return false;

		handlers.push(eventHandler);

		return true;
	}//_on

	function _off(eventName, eventHandler){
		var handlers = eventHandlers[eventName];
		if(!handlers) return false;

		var handlerIndex = handlers.indexOf(eventHandler);
		if(handlerIndex >= 0) handlers.splice(handlerIndex, 1);

		return true;
	}//_off






	return la;
}

/* * * * * * * * * * * * * * * * * * */


	}//_define

})(this);
