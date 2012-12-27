/*!
DependencyFuture by "Elmer Bulthuis" <elmerbulthuis@gmail.com>
*/

(function(global){

	var slice = Array.prototype.slice;



	if(typeof define === 'function' && define.amd){
		define(['./Future'], definer);
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
			if(this === global) throw "please use the 'new' keyword";

			Future.apply(this);

			var future = this;

			var argumentCount = arguments.length;
			var argumentIndex = 0;
			var dependencies = []
			var loader = null;
			var unloader = null;
			var cachedValue = null;
			var loadState = 0;
			var loadResult = null;
			var getValueQueue = [];

			while(argumentIndex < argumentCount && arguments[argumentIndex] instanceof Future){
				dependencies.push(arguments[argumentIndex]);
				argumentIndex++;
			}
			if(argumentIndex < argumentCount && typeof arguments[argumentIndex] == 'function'){
				loader = arguments[argumentIndex];
				argumentIndex++;
			}
			if(argumentIndex < argumentCount && typeof arguments[argumentIndex] == 'function'){
				unloader = arguments[argumentIndex];
				argumentIndex++;
			}

			if(argumentIndex != argumentCount) throw 'bad arguments';
			if(!loader) throw 'no loader';


			dependencies.forEach(function(dependency){
				dependency.addListener('change', dependency_change);
				dependency.addListener('error', dependency_error);
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
					try{
						loadResult = loader.apply(this, results.concat([function(){
							switch(arguments.length){
								case 1:
								cachedValue = arguments[0];
								break;

								case 2:
								if(arguments[0]) future.emit('error', arguments[0]);
								cachedValue = arguments[1];
								break;

								default: throw 'bad arguments for loader';
							}

							loadState = 2;
							future.emit('load');
							while(getValueQueue.length) getValueQueue.shift()(cachedValue);
						}]));
					}
					catch(err){
						future.emit('error', err);
					}
				});
			}//loadValue

			function unloadValue(){
				if(loadState == 1) {
					if(!unloader) throw 'no uploader';
					unloader.apply(this, [loadResult]);
					future.emit('cancel');
				}
				loadState = 0;
				future.emit('unload');
				while(getValueQueue.length) getValueQueue.shift();
			}//unloadValue

		}//DependencyFuture


	}//definer

})(this);
