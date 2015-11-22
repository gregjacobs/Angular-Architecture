---
title: "Hybrid Apps: Abstracting Native Plugins"
layout: page-with-nav
permalink: /hybrid-apps/abstracting-plugins/
comments: true
---


Use an Angular-aware wrapper (service) to abstract away device plugins. This has 
the following advantages:

1. The service can handle both the browser case and the device case.
2. They don't polyfill the plugin on the `window` object, making unit testing
   easier. (The `window` object is not "cleared" between tests.)
3. They provide a perfect place to make sure that `$rootScope.$apply()` is 
   always called when the async plugin call completes. 


## Handling Both the Browser and Device Case

We want to avoid checks like this all over the place in code:

{% highlight javascript %}
if( $window.myPlugin ) {  // are we on a device?
   $window.myPlugin.callMethod();
}
{% endhighlight %}

Better, using a Plugin Wrapper to take care of this check for us:

{% highlight javascript %}
MyPlugin.callMethod();  // `MyPlugin` wrapper should handle both the browser case and the device case
{% endhighlight %}


## Polyfills

We could use polyfills to simulate device presence, but these make unit testing
more difficult.

First, the `window` object is not "cleared" between unit tests. Any properties
added to it will affect all other tests from there on in.

Second, when a device plugin gains a new method, it's very easy to forget to 
update the polyfill, which is in a completely separate place. In the wrapper
world, we would always need to add the new plugin method, so it is easily
visible that the wrapper method should handle both the browser case and the 
device case.


## Angular $apply() Problem

All calls to a device plugin are asynchronous, so Angular will not be aware of
when the call is complete. Therefore, when using plugins directly, we would need
a `$rootScope.$apply()` call. 

Example of old way:

{% highlight javascript %}
$window.myPlugin.callMethod( function callback() {
   $rootScope.$apply( function() {
      // do actual success logic here
   } );
} );
{% endhighlight %}

The `$rootScope.$apply()` is very easy to forget here, and must be duplicated 
for every call to this plugin method.


A plugin wrapper should return an Angular promise, which will automatically run a 
`$rootScope.$apply()` for you. Hence, a `$rootScope.$apply()` will never be 
forgotten. Example:

{% highlight javascript %}
MyPlugin.callMethod().then( function() {
   // handle success here - promise runs the $rootScope.$apply() for us
} );
{% endhighlight %}


## Full Plugin Wrapper Example

{% highlight javascript %}
angular.module( 'msApp' ).factory( 'MyPlugin',
         [ '$window', '$q',
function (  $window,   $q ) {
   'use strict';

   // Public API
   return {
      callMethod : callMethod
   };
   

   /**
    * Example function which calls an underlying plugin API that uses 
    * callbacks (such as Stock Cordova Plugins).
    * 
    * @return {Promise}
    */
   function callMethod() {
      if( !$window.myPlugin ) {  // browser case - return resolved promise
         return $q.when();
      
      } else {
         var deferred = $q.defer();  // Because we use an Angular deferred, a `$rootScope.$apply()` call will be made
                                     // when the promise is resolved or rejected.
         
         $window.myPlugin.callMethod( 
            function successCallback() { deferred.resolve(); }, 
            function errorCallback()   { deferred.reject(); } 
         );
         
         return deferred.promise;
      }
   }
   
} ] );
{% endhighlight %}