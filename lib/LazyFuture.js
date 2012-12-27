/*!
LazyFuture by "Elmer Bulthuis" <elmerbulthuis@gmail.com>
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

	global.LazyFuture = definer(global.Future);
	return;



	function definer(Future){

		LazyFuture.prototype = Object.create(Future.prototype, {
			constructor: {
				value: LazyFuture
				, enumerable: false
				, writable: true
				, configurable: true
			}
		});

		return LazyFuture;

		function LazyFuture(){
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

			while(
				argumentIndex < argumentCount 
				&& (arguments[argumentIndex] instanceof Future || Array.isArray(arguments[argumentIndex]))
			){
				dependencies.push(arguments[argumentIndex]);
				argumentIndex++;
			}
			if(
				argumentIndex < argumentCount
				&& typeof arguments[argumentIndex] == 'function'
			){
				resolver = arguments[argumentIndex];
				argumentIndex++;
			}
			if(
				argumentIndex < argumentCount
				&& typeof arguments[argumentIndex] == 'function'
			){
				canceller = arguments[argumentIndex];
				argumentIndex++;
			}

			if(argumentIndex != argumentCount) throw 'bad arguments';
			if(!resolver) throw 'no resolver';


			setupDependencies(dependencies);
			future.addListener('dispose', function(){
				teardownDependencies(dependencies);
			});

			future.get = getValue;




			function setupDependencies(dependencies){
				dependencies.forEach(function(dependency){
					if(Array.isArray(dependency)){
						setupDependencies(dependency);
					}
					else{
						dependency.addListener('change', dependency_change);
						dependency.addListener('error', dependency_error);
					}
				});
			}//setupDependencies
			
			function teardownDependencies(dependencies){
				dependencies.forEach(function(dependency){
					if(Array.isArray(dependency)){
						teardownDependencies(dependency);
					}
					else{
						dependency.removeListener('change', dependency_change);
						dependency.removeListener('error', dependency_error);
					}
				});
			}//teardownDependencies




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
					if(Array.isArray(dependency)){
						resolveDependencies(dependency, function(err, value){
							results[dependencyIndex] = value;
							if(!countdown-- || err) cb(err, results);
						});
					}
					else{
						dependency.get(function(value){
							results[dependencyIndex] = value;
							if(!countdown--) cb(results);
						});
					}
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

		}//LazyFuture


	}//definer

})(this);
