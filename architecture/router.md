---
title: "Architecture: Router"
layout: page-with-nav
permalink: /architecture/router/
comments: true
---

Your app's router is what will direct the user to the first [page]({{ site.baseurl }}/architecture/pages)
they see, and will provide the ability to navigate to other pages of the app.

You may define my routes in `app.js` in a `config` block. For example:

*app.js*

{% highlight javascript %}
angular.module( 'heroes' ).config( [ '$routeProvider', function( routeProvider ) {
    'use strict';
    
    $routeProvider
        .when( '/dashboard', {
            template : '<heroes-dashboard-page></heroes-dashboard-page>'
        } )
        .when( '/list', {
            template : '<heroes-list-page></heroes-list-page>'
        } )
        .when( '/detail', {
            template : '<heroes-detail-page></heroes-detail-page>'
        } )
        .otherwise( '/dashboard' );
    
} ] );
{% endhighlight %}

Why `template` instead of `templateUrl`? Well, as described in the [Pages]({{ site.baseurl }}/architecture/pages)
article, pages should view [components]({{ site.baseurl }}/architecture/components), 
only bigger ones. This allows for maximum reuse of them (say in the future, you 
wish to put an entire page inside of a modal dialog), and also allows for easier 
testing of them (see [Testing Pages]({{ site.baseurl }}/testing/pages)).

You could choose to prefer using `templateUrl` and having an HTML file that 
solely writes out the one tag, but probably not worth the effort and explosion
of files.


## Handling Route Params

Our pages really shouldn't worry about reading route params themselves from 
inside their controllers. As I mentioned earlier, pages should be flexible 
enough for us to use them elsewhere in the future (again, such as in a modal
dialog).

Therefore, just like [components]({{ site.baseurl }}/architecture/components), our pages should 
accept attributes for how they should be configured and displayed. We can then 
pass in the route params to the attributes. For example:

*app.js*

{% highlight javascript %}
angular.module( 'myApp' ).config( [ '$routeProvider', function( routeProvider ) {
    'use strict';
    
    $routeProvider
        .when( '/home', {
            template : '<app-home></app-home>'
        } )
        .when( '/page1/:param', {
            template : function( routeParams ) {
                return '<app-page1 param="' + routeParams.param + '"></app-page1>';
            }
        } )
        .otherwise( '/home' );
    
} ] );
{% endhighlight %}

The `template` option accepts a function which is called with the route params
object. We use this to construct a tag with the appropriate attributes.

Note: The above assumes that the directive definition for `<app-page1>` looks
something like this:
 
*app-page1.js*

{% highlight javascript %}
angular.module( 'myApp' ).directive( 'myPage1', function() {
    'use strict';
    
    return {
        restrict : 'E',
        scope : {
            param : '@'
        },
        
        templateUrl  : 'pages/page1/app-page1.html',
        controller   : 'MyPage1Ctrl'
    };

} );
{% endhighlight %}

I could have also used `param : '='` for the scope property, but then we would 
have needed to surround the attribute's value in an extra set of single quotes 
so that it would still be a string after Angular had evaluated it.