describe( 'app-error-box', function() {
	var $compile,
	    $scope,  // our "outer" scope - the one that will feed the component's inputs
	    AppErrorBoxTestWrapper;  // wrapper for testing this component - more on this later

	beforeEach( module( 'heroes' ) );

	beforeEach( inject( function( $injector ) {
		$compile               = $injector.get( '$compile' );
		$scope                 = $injector.get( '$rootScope' ).$new();
		AppErrorBoxTestWrapper = $injector.get( 'AppErrorBoxTestWrapper' );
	} ) );


	function createComponent() {
		var $el = $compile( [
			'<app-error-box',
			' header="header"',
			' text="text"',
			' on-retry="onRetry()">',
			'</app-error-box>'
		].join( '' ) )( $scope );

		// fully initialize the component by triggering $watch handlers,
		// flushing values to the DOM, etc.
		$scope.$apply();

		// wrap the component in our TestWrapper for easy/reusable
		// testing of the component
		return new AppErrorBoxTestWrapper( $el );
	}


	it( 'should initially display the provided `header` and `text`, and ' +
		'default the retry btn label to "Retry"',
	function() {
		$scope.header = 'My Header';  // setting our scope properties here will bind
		$scope.text = 'My Text';      // them to our component when it is instantiated
		var appErrorBox = createComponent();

		appErrorBox.expectHeader( 'My Header' );
		appErrorBox.expectText( 'My Text' );
		appErrorBox.expectRetryBtnLabel( 'Retry' );
	} );


	it( 'should update the displayed `header` and `text` when they change', function() {
		$scope.header = 'Header 1';
		$scope.text = 'Text 1';
		var appErrorBox = createComponent();

		appErrorBox.expectState( 'Header 1', 'Text 1', 'Retry' );  // initial condition
		// Note: `expectState()` is a shorthand method for the 3 separate expectations

		// Now update the properties
		$scope.header = 'Header 2';
		$scope.text = 'Text 2';
		$scope.$apply();

		appErrorBox.expectState( 'Header 2', 'Text 2', 'Retry' );
	} );


	it( 'should call the `on-retry` expression when the "Retry" button ' +
		'is clicked',
	function() {
		$scope.onRetry = jasmine.createSpy( 'onRetry' );
		var appErrorBox = createComponent();

		expect( $scope.onRetry ).not.toHaveBeenCalled();  // not yet

		appErrorBox.clickRetryBtn();
		expect( $scope.onRetry ).toHaveBeenCalled();
	} );

} );