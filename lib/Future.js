/*!
Future by "Elmer Bulthuis" <elmerbulthuis@gmail.com>
*/

(function(global){

	if(typeof define === 'function' && define.amd){
		define(['events'], definer);
		return;
	}

	if(typeof module !== 'undefined' && module.exports){
		module.exports = definer(require('events'));
		return;
	}

	global.Future = definer(global.events);
	return;

	function notImplemented(){
		throw 'not implemented';
	}//notImplemented

	function definer(events){
		var EventEmitter = events.EventEmitter;

		Future.prototype = Object.create(EventEmitter.prototype, {
			constructor: {
				value: Future
				, enumerable: false
				, writable: true
				, configurable: true
			}
		});

		Future.prototype.get = notImplemented;
		Future.prototype.dispose = function(){
			this.emit('dispose');
		}//dispose

		return Future;

		function Future(resolver){
			events.EventEmitter.apply(this);

			var future = this;
		}//Future

	}//definer

})(this);
