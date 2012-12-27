/*!
la by "Elmer Bulthuis" <elmerbulthuis@gmail.com>
*/

(function(global){

	if(typeof define === 'function' && define.amd){
		define([
			'./Future'
			, './ValueFuture'
			, './DependencyFuture'
		], definer);
		return;
	}

	if(typeof module !== 'undefined' && module.exports){
		module.exports = definer(
			require('./Future')
			, require('./ValueFuture')
			, require('./DependencyFuture')
		);
		return;
	}

	global.la = definer(
		global.Future
		, global.ValueFuture
		, global.DependencyFuture
	);
	return;



	function definer(
		Future
		, ValueFuture
		, DependencyFuture
	){

		return {
			Future: Future
			, ValueFuture: ValueFuture
			, DependencyFuture: DependencyFuture
		}		

	}//definer

})(this);
