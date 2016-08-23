describe( 'my-heroes-list', function() {
	var $compile,
	    $scope,  // our "outer" scope - the one that will feed the component's inputs
	    MyHeroesListTestWrapper,  // wrapper for testing this component - more on this later

	    // a few heroes we can use in the tests
	    mrNice,
	    narco,
	    bombasto;

	beforeEach( module( 'heroes' ) );

	beforeEach( inject( function( $injector, HeroesTestData ) {
		$compile                = $injector.get( '$compile' );
		$scope                  = $injector.get( '$rootScope' ).$new();
		MyHeroesListTestWrapper = $injector.get( 'MyHeroesListTestWrapper' );

		// a few heroes we can use in the tests
		mrNice   = HeroesTestData.mrNice;
		narco    = HeroesTestData.narco;
		bombasto = HeroesTestData.bombasto;
	} ) );


	/**
	 * Instantiates the `<my-heroes-list>` component, and returns its
	 * TestWrapper.
	 *
	 * @param {Object} [scopeProps] The $scope properties to set.
	 * @param {Hero[]} [scopeProps.heroes]
	 * @param {Function} [scopeProps.onHeroSelect]
	 * @returns {MyHeroesListTestWrapper}
	 */
	function createHeroesList( scopeProps ) {
		// setting our scope properties here will bind them to our component
		// when it is instantiated
		$scope.heroes = scopeProps.heroes;
		$scope.onHeroSelect = scopeProps.onHeroSelect;

		var html = [
			'<my-heroes-list',
				' heroes="heroes"',
				' on-hero-select="onHeroSelect( $hero )">',
			'</my-heroes-list>'
		].join( '' );
		var $el = $compile( html )( $scope );

		// fully initialize the component by triggering $watch handlers,
		// flushing values to the DOM, etc.
		$scope.$apply();

		// wrap the component in our TestWrapper for easy/reusable
		// testing of the component
		return new MyHeroesListTestWrapper( $el );
	}


	it( 'should display the provided list of `heroes`', function() {
		var heroesList = createHeroesList( {
			heroes: [ mrNice, narco, bombasto ]
		} );

		heroesList.expectHeroes( [ mrNice, narco, bombasto ] );
	} );


	it( 'should update the displayed heroes when they change', function() {
		var heroesList = createHeroesList( {
			heroes: [ mrNice, narco, bombasto ]
		} );

		// Now, update the list of heroes
		$scope.heroes = [ bombasto, narco ];
		$scope.$apply();  // apply changes to DOM

		heroesList.expectHeroes( [ bombasto, narco ] );
	} );


	it( 'should call the `on-hero-select` expression when a Hero is clicked', function() {
		var onHeroSelectSpy = jasmine.createSpy( 'onHeroSelect' );

		var heroesList = createHeroesList( {
			heroes       : [ mrNice, narco, bombasto ],
			onHeroSelect : onHeroSelectSpy
		} );

		expect( onHeroSelectSpy ).not.toHaveBeenCalled();  // not yet

		heroesList.clickHero( bombasto );
		expect( onHeroSelectSpy ).toHaveBeenCalledWith( bombasto );
	} );

} );