angular.module( 'myApp' ).component( 'myHeroesList', function() {
	'use strict';

	return {
		restrict : 'E',  // element directive
		scope : {        // always use an isolate scope
			header        : '=',
			text          : '=',
			retryBtnLabel : '=?',
			onRetry       : '&'
		},
		bindToController : true,  // Angular 1.3+

		templateUrl  : 'components/app-error-box/app-error-box.html',
		controller   : 'AppErrorBoxCtrl',
		controllerAs : '$ctrl'
	};

} );


angular.module( 'myApp' ).controller( 'AppErrorBoxCtrl', [ function() {
	'use strict';

	var ctrl = this;

	init();

	/**
	 * Initializes the controller.
	 *
	 * @private
	 */
	function init() {
		ctrl.retryBtnLabel = ctrl.retryBtnLabel || 'Retry';  // default to "Retry"
	}

} ] );