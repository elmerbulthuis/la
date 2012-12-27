/*!
DependencyFuture by "Elmer Bulthuis" <elmerbulthuis@gmail.com>
*/

(function(global){

	var slice = Array.prototype.slice;



	if(typeof define === 'function' && define.amd){
		define(['Future'], definer);
		return;
	}

	if(typeof module !== 'undefined' && module.exports){
		module.exports = definer(require('./Future'));
		return;
	}

	global.DependencyFuture = definer(global.Future);
	return;



	function definer(Future){

		DependencyFuture.prototype = Object.create(Future.prototype, {
			constructor: {
				value: DependencyFuture
				, enumerable: false
				, writable: true
				, configurable: true
			}
		});

		return DependencyFuture;

		function DependencyFuture(){
			Future.apply(this);

			var future = this;

			var loader = arguments[arguments.length - 1];
			var dependencies = slice.call(arguments, 0, arguments.length - 1);
			var cachedValue = null;
			var loadState = 0;
			var getValueQueue = [];


			dependencies.forEach(function(dependency){
				dependency.addListener('change', dependency_change);
				dependency.addListener('error', dependency_error);
				future.once('dispose', function(){
					dependency.removeListener('change', dependency_change);
					dependency.removeListener('error', dependency_error);
				});
			});


			future.get = getValue;
			future.load = loadValue;
			future.unload = unloadValue;

			function dependency_change(){
				unloadValue();
				future.emit.apply(future, ['change'].concat(slice.call(arguments)));
			}//dependency_change

			function dependency_error(){
				unloadValue();
				future.emit.apply(future, ['error'].concat(slice.call(arguments)));
			}//dependency_error

			function loadDependencies(dependencies, cb){
				var countdown = dependencies.length;
				var results = new Array(countdown);

				dependencies.forEach(function(dependency, dependencyIndex){
					dependency.get(function(value){
						results[dependencyIndex] = value;
						if(!countdown--) cb(results);
					});
				});

				if(!countdown--) cb(results);
			}//loadDependencies


			function getValue(cb){
				if(loadState == 0) loadValue();

				if(loadState == 2){
					cb(cachedValue);
				}
				else{
					getValueQueue.push(cb);
				}
			}//getValue

			function loadValue(){
				loadState = 1;
				future.emit('loading');
				loadDependencies(dependencies, function(results){
					loader.apply(this, results.concat([function(result){
						cachedValue = result;
						loadState = 2;
						future.emit('load');
						while(getValueQueue.length) getValueQueue.shift()(cachedValue);
					}]));
				});
			}//loadValue

			function unloadValue(){
				if(loadState == 1) future.emit('cancel');
				loadState = 0;
				future.emit('unload');
				while(getValueQueue.length) getValueQueue.shift();
			}//unloadValue

		}//DependencyFuture


	}//definer

})(this);
