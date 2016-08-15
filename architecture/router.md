---
title: "Architecture: Router"
layout: page-with-nav
permalink: /architecture/router/
comments: true
---

Your app's router is what will direct the user to the first 
[page]({{ site.baseurl }}/architecture/pages) they see, and will provide 
the ability to navigate to other pages of the app.

{% include diagrams/router.md %}

## Defining Routes

You may define routes in `app.js` in a `config` block. For example:

*app.js*

{% highlight javascript %}
angular.module( 'heroes' ).config( [ '$routeProvider', function( routeProvider ) {
    'use strict';
    
    $routeProvider
        .when( '/dashboard', {
            template : '<my-heroes-dashboard-page></my-heroes-dashboard-page>'
        } )
        .when( '/list', {
            template : '<my-heroes-list-page></my-heroes-list-page>'
        } )
        .when( '/detail/:id', {
            template : 
                '<my-heroes-detail-page' +
                    ' hero-id="$resolve.$route.current.params.id">' +
                '</my-heroes-detail-page>',
            resolve : {
                $route : '$route'
            }
        } )
        .otherwise( '/dashboard' );
    
} ] );
{% endhighlight %}

Why `template` instead of `templateUrl`? Well, as described in the 
[Pages]({{ site.baseurl }}/architecture/pages) article, pages should 
view [components]({{ site.baseurl }}/architecture/components). This 
allows for maximum reuse of them (say in the future, you wish to put an 
entire page inside of a modal dialog), and also allows for easier 
testing of them (see [Testing Pages]({{ site.baseurl }}/testing/pages)).

You could choose to prefer using `templateUrl` and having an HTML file 
that solely writes out the one tag, but it's generally not really worth 
the effort and extra files.


## Handling Route Params

Our pages really shouldn't worry about reading route params themselves 
from inside their controllers. As I mentioned earlier, pages should be 
flexible enough for us to use them elsewhere in the future, rather than
always at the top level.

Therefore, just like [components]({{ site.baseurl }}/architecture/components), 
our pages should accept attributes for how they should be configured and 
displayed. We can then pass in the route params to the attributes. For 
example (Angular 1.5+ only):

*app.js*

{% highlight javascript %}
angular.module( 'heroes' ).config( [ '$routeProvider', function( routeProvider ) {
    'use strict';
    
    $routeProvider
        // ...
        
        .when( '/detail/:id', {
            template : 
                '<my-heroes-detail-page' +
                    ' hero-id="$resolve.$route.current.params.id">' +
                '</my-heroes-detail-page>',
            resolve : {
                $route : '$route'
            }
        } )
    
} ] );
{% endhighlight %}

Here, we expose `$route` to the template using the `resolve` map. Then,
we can access its `id` param from the URL. This property is also updated
when the URL parameter is changed in the browser's address bar.

Note: The above assumes that the component definition for 
`<my-heroes-detail-page>` looks something like this:
 
*my-heroes-detail-page.js*

```javascript
{% include heroes-detail-page/my-heroes-detail-page.js %}
```


Next Article: [File Organization]({{ site.baseurl }}/architecture/file-organization/)
    