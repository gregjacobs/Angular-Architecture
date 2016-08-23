        it( 'should return a promise that is resolved with an ' +
            'array of Hero objects'
        function() {
            $httpBackend.expectGET( '/path/to/heroes' )
                .respond( 200, HeroesTestData.heroes );
                
            HeroesService.loadHeroes().then( successFn );
            expect( successFn ).not.toHaveBeenCalled();  // not yet
            
            $httpBackend.flush();
            expect( successFn ).toHaveBeenCalledWith( jasmine.any( Array ) );
            
            var heroes = successFn.calls.argsFor( 0 )[ 0 ];
            expect( heroes.length ).toBe( 3 );
            expectHero( heroes[ 0 ] )
                .toContain( 11, 'Mr. Nice', moment( '2016-05-10T18:00:52' ) );
            expectHero( heroes[ 1 ] )
                .toContain( 12, 'Narco',    moment( '2016-02-01T08:52:27' ) );
            expectHero( heroes[ 2 ] )
                .toContain( 13, 'Bombasto', moment( '2016-05-10T18:00:52' ) );
        } );