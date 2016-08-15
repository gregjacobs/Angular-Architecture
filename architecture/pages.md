---
title: "Architecture: Pages"
layout: page-with-nav
permalink: /architecture/pages/
comments: true
---

Pages are what make up your app, and are the highest level in the "tree
of components" design. They facilitate the interaction between your 
lower-level view components, and your services. They are responsible 
for:

1. Loading the data for the page
2. Showing any "Loading..." indicators needed, and
3. Passing the data to the appropriate child components when loaded.


<!-- This comment is to separate the list from the diagram -->
{% include diagrams/page-and-components.md %}

Example Page:

<img class="example-frame" src="{{ site.baseurl }}/images/heroes-list-2.png" alt="Heroes List Page" title="Heroes List Page">

## Creating Pages as Components

You should create pages as self-contained view [components]({{ site.baseurl }}/architecture/components). 
A component creates a tag for the page, and gives the ability to use 
attributes for input (more on that later).

<!--
(For the old Angular 1.2 and below way of doing things, see 
[here]({{ site.baseurl }}/architecture/pages-the-old-way-of-doing-things))
-->

Directory structure:

    app/
        heroes-list/
            heroes-list.html
            heroes-list.js
        heroes-list-page/  # The "Page" holds the heroes-list, plus the title and tabs
            heroes-list-page.html
            heroes-list-page.js
        app.js

(see [File Organization]({{ site.baseurl }}/architecture/file-organization) article for details)

<!--
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
        } );

} ] );
{% endhighlight %}
-->


### Page Controllers

Page controllers have the responsibility of calling your 
[service]({{ site.baseurl }}/architecture/services) layer to retrieve 
data, and expose it to be consumed by your lower-level view [components]({{ site.baseurl }}/architecture/components).

In general, page controllers should load data rather than individual 
[component]({{ site.baseurl }}/architecture/components) controllers, so 
that it's left to the page to control loading spinners and coordinate 
between potentially multiple service calls / data sources. 

*my-heroes-list-page.js*

```javascript
{% include heroes-list-page/my-heroes-list-page.js %}
```


<!--
The design of creating a page as a [component]({{ site.baseurl }}/architecture/components)
has the following advantages:

1. **Reusability**: One day you may have a standalone page that now 
   needs to be displayed from another page in say, a popup modal dialog. 
   Having it self-contained in an element directive makes this an easy 
   move.
2. **Encapsulation**: Because we create pages with isolate scopes, 
   embedding a page as a component in the future means it takes its 
   input with attributes, rather than needing to worry about if the 
   controller reads $routeParams somewhere in its source code.
3. **Testability**: It is very easy to instantiate the page using 
   `$compile` from unit tests, which gives you the ability to test the 
   DOM of the page rather than just the `$scope`. See [Testing Pages]({{ site.baseurl }}/testing/pages) 
   for details.
-->

<!-- Not sure I want to keep this, since $routeParams might need to be
     watched. TODO
#### Pro Tip

- Don't access `$routeParams` from inside your page controllers. In fact, never
  use the `$routeParams` injectable at all. Instead, feed the input for your 
  pages using attributes. This makes your pages 100% flexible, and reusable if 
  needed. See the [Router]({{ site.baseurl }}/architecture/router) article for details on how to 
  pass in route parameters using attributes.
   
-->

### Page HTML

```html
{% include heroes-list-page/my-heroes-list-page.html %}
```

<!--
#### Pro Tips:

1. Don't use `$scope` to expose your data. Prefer exposing your data on the
   controller (or "view model") instance. Angular 2.0 is moving in this 
   direction as well, removing the use of `$scope`.
2. The only reason to inject `$scope` is so that you can add a `$scope.on( '$destroy', destroyFn )`
   handler.
-->

## Other Notes

A page is also responsible for:

1. Collecting any user input data and passing it to a service for 
   persistence when ready (as opposed to your components talking 
   directly to a service).
2. Navigating the user to any other pages (via links on the page, when
   a form is submitted successfully, etc.)


For how to test, see [Testing Pages]({{ site.baseurl }}/testing/pages).

Next Article: [Router]({{ site.baseurl }}/architecture/router/)
    