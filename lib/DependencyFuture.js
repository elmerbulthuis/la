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
			var resolver = null;
			var canceller = null;
			var cachedValue = null;
			var resolveState = 0;
			var resolveResult = null;
			var getValueQueue = [];

			while(argumentIndex < argumentCount && arguments[argumentIndex] instanceof Future){
				dependencies.push(arguments[argumentIndex]);
				argumentIndex++;
			}
			if(argumentIndex < argumentCount && typeof arguments[argumentIndex] == 'function'){
				resolver = arguments[argumentIndex];
				argumentIndex++;
			}
			if(argumentIndex < argumentCount && typeof arguments[argumentIndex] == 'function'){
				canceller = arguments[argumentIndex];
				argumentIndex++;
			}

			if(argumentIndex != argumentCount) throw 'bad arguments';
			if(!resolver) throw 'no resolver';


			dependencies.forEach(function(dependency){
				dependency.addListener('change', dependency_change);
				dependency.addListener('error', dependency_error);
			});


			future.get = getValue;

			function dependency_change(){
				resetValue();
				future.emit.apply(future, ['change'].concat(slice.call(arguments)));
			}//dependency_change

			function dependency_error(){
				resetValue();
				future.emit.apply(future, ['error'].concat(slice.call(arguments)));
			}//dependency_error


			function resolveDependencies(dependencies, cb){
				var countdown = dependencies.length;
				var results = new Array(countdown);

				dependencies.forEach(function(dependency, dependencyIndex){
					dependency.get(function(value){
						results[dependencyIndex] = value;
						if(!countdown--) cb(results);
					});
				});

				if(!countdown--) cb(results);
			}//resolveDependencies


			function getValue(cb){
				resolveValue();

				if(resolveState == 2){
					cb(cachedValue);
				}
				else{
					getValueQueue.push(cb);
				}
			}//getValue

			function resolveValue(){
				if(resolveState != 0) return;

				resolveState = 1;
				future.emit('resolving');
				resolveDependencies(dependencies, function(results){
					try{
						resolveResult = resolver.apply(this, results.concat([function(){
							switch(arguments.length){
								case 1:
								cachedValue = arguments[0];
								break;

								case 2:
								if(arguments[0]) future.emit('error', arguments[0]);
								cachedValue = arguments[1];
								break;

								default: throw 'bad arguments for resolver';
							}

							resolveState = 2;
							future.emit('resolve');
							while(getValueQueue.length) getValueQueue.shift()(cachedValue);
						}]));
					}
					catch(err){
						future.emit('error', err);
					}
				});
			}//resolveValue

			function cancelValue(){
				if(resolveState != 1) return;

				if(!canceller) throw 'no canceller';
				canceller.apply(this, [resolveResult]);
				future.emit('cancel');
			}//cancelValue

			function resetValue(){
				if(resolveState == 0) return;
				cancelValue();
				resolveState = 0;
				future.emit('reset');
				while(getValueQueue.length) getValueQueue.shift();
			}//resetValue

		}//DependencyFuture


	}//definer

})(this);
