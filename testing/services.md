---
title: "Testing: Services"
layout: page-with-nav
permalink: /testing/services/
comments: true
---

Testing services involves mocking out the boundary of the system, which in most
cases will be a web server (which is normally accessed over HTTP).

We want to test that our [services]({{ site.baseurl }}/architecture/services):

1. Pass any request parameters and/or data to the web server properly
2. Take a web server response and parse it / build the response models correctly.

Since it will be the focus of most applications, this guide will center around
`$httpBackend` in ng-mock.

Note that all examples assume [Jasmine](http://jasmine.github.io/) 2.x.

### First HeroesService Test

Let's start with a test of `HeroesService.loadHeroes()`, and then we'll explain 
it. 

Recall that our `HeroesService` from the [services]({{ site.baseurl }}/architecture/services)
guide looks like this:

{% include heroes-service.md %}

And our first test of the `loadHeroes()` method:

```javascript
describe( 'HeroesService', function() {
    'use strict';

    var $httpBackend,
        Hero,
        HeroesService,
        HeroesTestData,
        
        successFn,  // to observe promise resolution results
        errorFn;    // to observe promise rejection results

    beforeEach( module( 'heroes' ) );  // load the module for the test
    
    beforeEach( inject( function( $injector ) {
        $httpBackend   = $injector.get( '$httpBackend' );
        Hero           = $injector.get( 'Hero' );
        HeroesService  = $injector.get( 'HeroesService' );
        HeroesTestData = $injector.get( 'HeroesTestData' );
        
        successFn      = jasmine.createSpy( 'successFn' );
        errorFn        = jasmine.createSpy( 'errorFn' );
    } ) );
    
    
{% include heroes-service-test-expect-hero.md %}

    
    describe( 'loadHeroes()', function() {
    
{% include heroes-service-test-load-heroes-success.md %}
    
    } );

} );
```

Let's go over the test piece by piece:

1. `$httpBackend.expectGET( '/path/to/heroes' ).respond( 200, HeroesTestData.heroesResponse );`<br>
   Expects that an HTTP GET request will be made to the '/path/to/heroes' URL,
   and also programs in the response data.
   
2. `HeroesService.loadHeroes().then( successFn );`<br>
   Calls the method under test, providing our `successFn` spy function which
   will be called when the HTTP request is complete.
   
3. `expect( successFn ).not.toHaveBeenCalled();`
   Simply checks that `successFn` hasn't been called yet (it won't be called
   until the HTTP request is complete, and the promise resolves).
   
4. `$httpBackend.flush();`<br>
   "flush" the call from the backend (i.e. cause the HTTP request made by 
   `HeroesService.loadHeroes()` to return its data, and therefore resolve the
   promise)
   
5. `expect( successFn ).toHaveBeenCalledWith( jasmine.any( Array ) );`<br>
   Expects that the promise returned by `HeroesService.loadHeroes()` has 
   resolved, with an array as its argument (our array of `Hero` objects).
   
6. `var heroes = successFn.calls.argsFor( 0 )[ 0 ];`<br>
   Retrieves the first call to the `successFn` spy, and the first argument that 
   it was called with. This is our array of Heroes from the promise resolution.
    
7. `expectHero( heroes[ 0 ] ).toContain( ... )`<br>
   This is a call to our helper function to assert the correct state of each
   `Hero` instance.
   
**Note about testing the returned models**: The above example covers checking 
each of the returned models from the response. However, you may choose to only 
check a subset of the returned models for large collections. Generally, checking 
just one or two models is enough to confirm correct behavior.

For more information on `$httpBackend`, see: [https://docs.angularjs.org/api/ngMock/service/$httpBackend](https://docs.angularjs.org/api/ngMock/service/$httpBackend)

### HeroesTestData

`HeroesTestData` (used above) is our library of known response objects that our 
server can provide to us for heroes, which can be used in many tests. Example: 

```javascript
angular.module( 'heroes' ).factory( 'HeroesTestData', function() {

    var mrNice   = { id: 11, name: 'Mr. Nice', lastBattle: '2016-04-22T14:22:01' },
        narco    = { id: 12, name: 'Narco',    lastBattle: '2016-02-01T08:52:27' },
        bombasto = { id: 13, name: 'Bombasto', lastBattle: '2016-05-10T18:00:52' };
      
    return {
        mrNice   : mrNice,
        narco    : narco,
        bombasto : bombasto,
        
        heroes   : [ mrNice, narco, bombasto ]
    };

} );
```

This test data will be used not only for the `HeroesService` tests, but also for 
the hero page tests as well.


### Continuing the Example

Let's add tests for the remaining methods of `HeroesService`:

```javascript
describe( 'HeroesService', function() {
    'use strict';
    
    var $httpBackend,
        Hero,
        HeroesService,
        HeroesTestData,
        HeroesWriter,
        
        successFn,  // to observe promise resolution results
        errorFn;    // to observe promise rejection results

    beforeEach( module( 'heroes' ) );  // load the module for the test
    
    beforeEach( inject( function( $injector ) {
        $httpBackend   = $injector.get( '$httpBackend' );
        Hero           = $injector.get( 'Hero' );
        HeroesService  = $injector.get( 'HeroesService' );
        HeroesTestData = $injector.get( 'HeroesTestData' );
        HeroesWriter   = $injector.get( 'HeroesWriter' );
        
        successFn      = jasmine.createSpy( 'successFn' );
        errorFn        = jasmine.createSpy( 'errorFn' );
    } ) );
    
    
{% include heroes-service-test-expect-hero.md %}

    
    describe( 'loadHeroes()', function() {
    
{% include heroes-service-test-load-heroes-success.md %}


        it( 'should return a promise that should reject if an error occurs', function() {
            $httpBackend.expectGET( '/path/to/heroes' ).respond( 500 );
                
            HeroesService.loadHeroes().catch( errorFn );
            expect( errorFn ).not.toHaveBeenCalled();  // not yet
            
            $httpBackend.flush();
            expect( errorFn ).toHaveBeenCalled();
        } );
    
    } );
    
    
    describe( 'loadHero()', function() {
     
        it( 'should return a promise which is resolved when the Hero has been ' +
            'loaded successfully',
        function() {
            $httpBackend.expectGET( '/path/to/hero/11' )
                .respond( 200, HeroesTestData.mrNice );
                            
            HeroesService.loadHero( 11 ).then( successFn );
            expect( successFn ).not.toHaveBeenCalled();  // not yet
            
            $httpBackend.flush();
            expect( successFn ).toHaveBeenCalledWith( jasmine.any( Hero ) );
            
            var hero = successFn.calls.argsFor( 0 )[ 0 ];
            expectHero( hero )
                .toContain( 11, 'Mr. Nice', moment( '2016-05-10T18:00:52' ) );
        } );
        
        
        it( 'should return a promise that should reject if an error occurs', function() {
            $httpBackend.expectGET( '/path/to/hero/11' ).respond( 500 );
                
            HeroesService.loadHero( 11 ).catch( errorFn );
            expect( errorFn ).not.toHaveBeenCalled();  // not yet
            
            $httpBackend.flush();
            expect( errorFn ).toHaveBeenCalled();
        } );
    
    } );
    
    
    describe( 'saveHero()', function() {
    
        it( 'should perform a POST request for a new Hero, and resolve when ' +
            'complete', 
        function() {
            var lastBattle = moment(),
                newId = 42;
                
            var newHero = new Hero( { 
                name: 'Mr. Mean', 
                lastBattle: lastBattle 
            } );
            var serializedHero = HeroesWriter.writeHero( newHero );
        
            $httpBackend.expectPOST( '/path/to/hero', serializedHero )
                .respond( 200, _.merge( { id: newId }, serializedHero } } );
            
            HeroesService.saveHero( newHero ).then( successFn );
            expect( successFn ).not.toHaveBeenCalled();  // not yet
            
            $httpBackend.flush();
            expect( successFn ).toHaveBeenCalledWith( jasmine.any( Hero ) );
            
            var newHeroFromServer = successFn.calls.argsFor( 0 )[ 0 ];
            expectHero( newHeroFromServer )
                .toContain( newId, 'Mr. Mean', lastBattle );
        } );
        
        
        it( 'should perform a PUT request for an existing Hero, and resolve when ' +
            'complete',
        function() {
            var lastBattle = moment();
            var updatedHero = new Hero( { 
                id: 11, 
                name: 'Mr. Mean', 
                lastBattle: lastBattle 
            } );
            var serializedHero = HeroesWriter.writeHero( updatedHero );
        
            $httpBackend.expectPUT( '/path/to/hero/11', serializedHero )
                .respond( 200, serializedHero );
                
            HeroesService.saveHero( updatedHero ).then( successFn );
            expect( successFn ).not.toHaveBeenCalled();  // not yet
            
            $httpBackend.flush();
            expect( successFn ).toHaveBeenCalledWith( jasmine.any( Hero ) );
            
            var updatedHeroFromServer = successFn.calls.argsFor( 0 )[ 0 ];
            expectHero( updatedHeroFromServer )
                .toContain( 11, 'Mr. Mean', lastBattle );
        } );
        
        
        it( 'should reject its promise if an error occurs', function() {
            var newHero = new Hero( {
                name: 'Mr. Mean', 
                lastBattle: moment() 
            } );
            var serializedHero = HeroesWriter.writeHero( newHero );
        
            $httpBackend.expectPOST( '/path/to/hero', serializedHero )
                .respond( 500 );
            
            HeroesService.saveHero( newHero ).catch( errorFn );
            expect( errorFn ).not.toHaveBeenCalled();  // not yet
            
            $httpBackend.flush();
            expect( errorFn ).toHaveBeenCalled();
        } );
    
    } );

} );
```