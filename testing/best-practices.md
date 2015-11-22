---
title: "Testing: Best Practices"
layout: page-with-nav
permalink: /testing/best-practices/
comments: true
---

Main Points:

1. Don't mock - write integration tests
    - only mock boundaries of system
2. Test the DOM for components/pages, forget scope 
3. Don't modify the `window` object


## Always Write Integration Tests (i.e. Don't Mock)

As discussed in the [Mocking](/testing/mocking/) article, you do not want to 
mock any of your own code if at all possible. Write tests as integration tests,
and use testing utilities to simulate behavior when needed. See the Mocking 
article for more details.



## Test the DOM for Components/Pages

As discussed in the [Testing Components](/testing/components/) article, simply 
testing `$scope` properties is not effective and can leave you with a broken 
system that passes all tests. See that article for details.


## The `window` object

Don't modify the `window` object (or `$window` - it's the same thing) in tests
if you can all help it. Modifications to `window` will affect *all* of the tests 
that run after the test which modified `window`, and can therefore affect them 
adversely. 

If you absolutely *must* have something on the `window` object, here are a few 
strategies for dealing with it:

1. Use services to abstract `window` (global) variables away, and then spy on
   (mock out) your services in tests. These spies are automatically removed 
   after each test. (You do have methods to spy on rather than accessing the 
   properties directly, right?)
2. If for some reason you have things on the `window` object and must modify 
   them, make sure to restore their original values in an `afterEach()`. For
   example:
   
{% highlight javascript %}
describe( 'MyService', function() {
    'use strict';

    var $window, 
        origGlobalVar;
    
    beforeEach( module( 'myModule' ) );
    
    beforeEach( inject( function( $injector ) {
        $window = $injector.get( '$window' );
        
        origGlobalVar = $window.myGlobalVar;
    } ) );
    
    afterEach( function() {
        $window.myGlobalVar = origGlobalVar;  // restore original
    } );
    
    
    it( 'test which modifies the global', function() {
        // ...
        $window.myGlobalVar = 42;
        // ...
    } );

} );
{% endhighlight %}
   
Note that this is a manual process however and is prone to error, so do not 
modify `window`-level variables unless absolutely needed.
    
    
   