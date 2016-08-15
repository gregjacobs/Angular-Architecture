---
title: "Architecture Best Practices: When to Use Scope Events"
layout: page-with-nav
permalink: /architecture/when-to-use-scope-events/
comments: true
---

Let's start off this one with when _**not**_ to use `$scope` events
(`$broadcast` and `$emit`). These are an overused and very 
difficult-to-track practice that can most often be avoided.

You will most often never use scope events. If you have been following along in
the guide, you will see that:

1. You no longer need them to communicate with a child controller, since
   we are [no longer using ng-controller]({{ site.baseurl }}/architecture/dont-use-ng-controller).
2. You no longer need them to communicate to child components. Use 
   isolate scope [components]({{ site.baseurl }}/architecture/components/) 
   and attributes to communicate with them instead.
3. You no longer need them to communicate from a child component to a 
   parent controller. Since all of your views are [components]({{ site.baseurl }}/architecture/components/) 
   you have `&` attributes (named something like `on-xyz`) to allow 
   parents to subscribe to "events" that the component "emits".
4. You shouldn't need them to communicate to [services]({{ site.baseurl }}/architecture/services/) - 
   simple method calls to the service will do. 
   
   
## When To Actually Use Scope Events
   
The only case that I have found that is valid for `$scope` events
is to allow services to broadcast important events to the rest of the 
app. For example, maybe the user has been logged out due to a timeout:

```javascript
angular.module( 'myApp' ).factory( 'UserService', function( $rootScope, Event ) {
    'use strict';
    
    // ...
    
    function userSessionExpired() {
        $rootScope.$broadcast( Event.USER_LOGGED_OUT );
    }
} );
```


### Event.js - All Events are Global

`Event.js` is a place to put all of the available global events for your 
app, to make sure that you never accidentally duplicate an event value.
If you did, it could cause your app to accidentally respond to incorrect 
events. 

`Event.js` looks something like this: 

```javascript
angular.module( 'myApp' ).constant( 'Event', {

    USER_LOGGED_OUT: 0,
    SOME_OTHER_EVENT: 1,
    ...
    
} );
```

You may want to add a test for `Event.js` to make absolutely sure that 
there are never any duplicate event values in the file:

```javascript
describe( 'Event', function() {
    var Event;

    beforeEach( module( 'heroes' ) );
    
    beforeEach( inject( function( $injector ) {
        Event = $injector.get( 'Event' );
    } ) );
    
    
    it( 'should have no duplicate event values', function() {
        var set = {};
        
        for( var eventProp in Event ) {
            if( set[ eventProp ] === true ) {
                throw new Error( 'Duplicate event value found at key: ' + eventProp );
            }
            
            set[ eventProp ] = true;
        }
    } );

} );
```

### Subscribing to Service-Level Events from Controllers 

Important point: when a controller subscribes to the event, it should be 
subscribed to _**on the local scope**_ so that you don't need to worry 
about unregistering the listener when the scope is destroyed.

(If you were to listen for it on the `$rootScope`, it would cause your
controller to stay alive even after Angular tried to `$destroy()` it.)

```javascript
angular.module( 'myApp' ).controller( 'MyPageController', MyPageController ); 

function MyPageController( $scope, Event ) {
    'use strict';
    
    $scope.$on( Event.USER_LOGGED_OUT, handleLogout );
    
    
    /**
     * @private
     */
    function handleLogout() {
        // ...
    }
    
}
```