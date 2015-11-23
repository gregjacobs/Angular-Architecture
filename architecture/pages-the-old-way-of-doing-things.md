---
title: "Architecture: Pages - The Old Way of Doing Things"
layout: page-with-nav
permalink: /architecture/pages-the-old-way-of-doing-things/
comments: true
---

Most of the literature you will read on pages involves having a `views/` 
directory and a `controllers/` directory, and tying a view to a controller in a 
route configuration object.

Directory structure (old):

    app
        controllers
            HomeCtrl.js
            Page1Ctrl.js
            ...
        views
            home.html
            page1.html
            ...
        app.js

*app.js* (old)

{% highlight javascript %}
angular.module( 'myApp' ).config( [ '$routeProvider', function( routeProvider ) {
    'use strict';
    
    $routeProvider
        .when( '/home', {
            templateUrl  : 'views/home.html'
            controller   : 'HomeCtrl'
            controllerAs : 'ctrl'
        } )
        .when( '/page1', {
            templateUrl  : 'views/page1.html'
            controller   : 'Page1Ctrl'
            controllerAs : 'ctrl'
        } );
    
} ] );
{% endhighlight %}

There is a better way, which is creating pages as components. See the 
[Pages]({{ site.baseurl }}/architecture/pages/) article for details.