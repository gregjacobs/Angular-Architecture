---
title: When to Use Scope Events
layout: page-with-nav
permalink: /architecture/when-to-use-scope-events/
---

Let's start off this one with when *not* to use scope events. I find this to be 
an overused and very hard to track practice that can most often be avoided.

You will most often never use scope events. If you have been following along in
the guide, you will see that:

1. You no longer need them to communicate to sub-components (use isolate scope
   components and scope/controller properties to communicate with them instead.)
2. You no longer need them to communicate with a child controller. You should 
   only have child components on your page, which have attributes for that.
3. You no longer need them to communicate with a parent controller. Since all of
   your views are components (directives), you have `&` attributes (named 
   something like `on-xyz`) to allow parents to subscribe to "events" that the
   component triggers.
4. You shouldn't need them to communicate to services - simple method calls will
   do. 
   
   
That being said, the only case that I have found that is valid for scope events
is to allow services to broadcast important events to the rest of the app. For
example, maybe the user has been logged out due to a timeout.

{% highlight javascript %}
angular.module( 'myApp' ).factory( 'UserService',
         [ '$rootScope', 'Event',
function (  $rootScope,   Event ) {
    'use strict';
    
    function somethingHappened() {
        $rootScope.$broadcast( Event.USER_LOGGED_OUT );
    }
} );
{% endhighlight %}


Where `Event.js` looks something like:

{% highlight javascript %}
angular.module( 'myApp' ).constant( 'Event', {

    USER_LOGGED_OUT: 0,
    SOME_OTHER_EVENT: 1,
    ...
    
} );
{% endhighlight %}

And this should be subscribed to *on the local scope* for controllers (so you 
don't need to worry about un-registering the listener when the scope is 
destroyed).

{% highlight javascript %}
angular.module( 'myApp' ).controller( 'MyPageCtrl',
        [ '$scope', 'Event',
function(  $scope,   Event ) {
    'use strict';
    
    $scope.$on( Event.USER_LOGGED_OUT, handleLogout );
    
    
    /**
     * @private
     */
    function handleLogout() {
        // ...
    }
    
} );
{% endhighlight %}