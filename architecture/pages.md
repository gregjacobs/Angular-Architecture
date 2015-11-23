---
title: "Architecture: Pages"
layout: page-with-nav
permalink: /architecture/pages/
comments: true
---

Pages are what make up your app. Each page displays a UI to the user, and is 
composed of HTML elements and child [Components]({{ site.baseurl }}/architecture/components) to
accept the user's input, display information, etc.


## Creating Pages as Components

Instead of [the old way of doing things]({{ site.baseurl }}/architecture/pages-the-old-way-of-doing-things), 
I recommend creating pages as self-contained view [components]({{ site.baseurl }}/architecture/components). 
An element directive creates a tag for the page, and gives the ability to use 
attributes for input (more on that later).

Directory structure:

    app
        home
            app-home.html
            app-home.js
        page1
            app-page1.html
            app-page1.js
        app.js

(see [File Organization]({{ site.baseurl }}/architecture/file-organization) article for details)

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

*app-page1.js*

{% highlight javascript %}
angular.module( 'myApp' ).directive( 'myPage1', function() {
    'use strict';
    
    return {
        restrict : 'E',  // element directive
        scope : {        // always use an isolate scope - see "Components" article
            param : '@'
        },
        
        templateUrl  : 'page1/app-page1.html',
        controller   : 'MyPage1Ctrl',
        controllerAs : 'ctrl'
    };
    
} );


angular.module( 'myApp' ).controller( 'MyPage1Ctrl', [ '$scope', function( $scope ) {
    'use strict';
    
    // ...
    
    // Use $scope.param at some point here
} ] );
{% endhighlight %}


This design has the following advantages:

1. **Reusability**: One day you may have a standalone page that now needs to be
   displayed from another page in a popup modal dialog. Having it self-contained 
   in an element directive makes this an easy move.
2. **Encapsulation**: Because we create pages with isolate scopes, embedding a
   page as a component in the future means it takes its input with attributes,
   rather than needing to worry about if the controller reads $routeParams 
   somewhere in its source code.
3. **Testability**: It is very easy to instantiate the page using `$compile` 
   from unit tests, which gives you the ability to test the DOM of the page
   rather than just the `$scope`. See [Testing Pages]({{ site.baseurl }}/testing/pages) for 
   details.

If you haven't read the article for [Routing]({{ site.baseurl }}/architecture/router) yet, I 
recommend you do so now.



#### Pro Tip

- Don't access `$routeParams` from inside your page controllers. In fact, never
  use the `$routeParams` injectable at all. Instead, feed the input for your 
  pages using attributes. This makes your pages 100% flexible, and reusable if 
  needed. See the [Router]({{ site.baseurl }}/architecture/router) article for details on how to 
  pass in route parameters using attributes.
   

## Page HTML Templates

You want to keep the HTML of your page templates short. 100 lines or less is a 
good goal.

In order to do this, you want to break down your pages into sub 
[components]({{ site.baseurl }}/architecture/components).

Example of *messy* page:

{% highlight html %}
<div>
    <div class="header">
        <div>
            <span>{% raw %}{{ ctrl.title }}{% endraw %}</span>
            <span>...</span>
        </div>
    </div>
    
    <div class="spinner" ng-if="ctrl.pageState === 'loading'">
        <span class="spinner-icon"></span>
        <span>Loading...</span>
    </div>
        
    <div class="content" ng-if="ctrl.pageState === 'loaded'">
        <div ng-repeat="item in ctrl.items">
            <span>{% raw %}{{ item.name }}{% endraw %}</span>
            <span>{% raw %}{{ item.description }}{% endraw %}</span>
            <div>
                <button ng-click="ctrl.edit( item )">Edit</button>
                <button ng-click="ctrl.remove( item )">Remove</button>
            </div>
        </div>
        
        <div>
            <div>...</div>
            <div>
                <button ng-click="ctrl.selectAll()">Select All</button>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <div>
            <span>...</span>
            <span>...</span>
        </div>
        <div>
            <span></span>
        </div>
        <div>
            <span>...</span>
        </div>
    </div>
</div>
{% endhighlight %}


Example of the same page nicely broken down into distinct components:

{% highlight html %}
<div>
    <app-header class="header" title="ctrl.title">
    
    <app-spinner ng-if="ctrl.pageState === 'loading'"></app-spinner>
    
    <div class="content" ng-if="ctrl.pageState === 'loaded'">
        <app-item ng-repeat="item in ctrl.items" 
                 on-edit="ctrl.edit( item )" 
                 on-remove="ctrl.remove( item )"></app-item>
        
        <app-items-options on-select-all="ctrl.selectAll()"></app-items-options>
    </div>
    
    <app-footer></app-footer>
</div>
{% endhighlight %}

See [Components]({{ site.baseurl }}/architecture/components) guide for building components.


## Page Controllers

Page controllers have the responsibility of calling your [service]({{ site.baseurl }}/architecture/services) 
layer to retrieve data, and expose it to be consumed by your view components.

In general, page controllers should load data rather than individual [component]({{ site.baseurl }}/architecture/components) 
controllers, so that it's left to the page to control loading spinners and 
coordinate between potentially multiple calls / data sources. 

*app-page1.js*

{% highlight javascript %}
angular.module( 'myApp' ).directive( 'myPage1', function() {
    // (see above)
} );


angular.module( 'myApp' ).controller( 'MyPage1Ctrl', [ 'TodoService', function( TodoService ) {
    'use strict';
    
    var ctrl = this;
    
    // Public Properties
    ctrl.pageState = 'loading';
    ctrl.items = [];
    
    // Public API
    ctrl.edit = edit;
    ctrl.remove = remove;
    ctrl.selectAll = selectAll;
    
    loadTodos();
    
    
    /**
     * @private
     */
    function loadTodos() {
        ctrl.pageState = 'loading';
    
        TodoService.loadItems().then( 
            function onSuccess( items ) {
                ctrl.pageState = 'loaded';
                ctrl.items = items;
            },
            function onError() {
                ctrl.pageState = 'error';
            }
        );
    }
    
    
    function edit( item ) {
        // ...
    }
    
    function remove( item ) {
        // ...
    }
    
    function selectAll() {
        // ...
    }
    
} ] );
{% endhighlight %}



#### Pro Tips:

1. Don't use `$scope` to expose your data. Prefer exposing your data on the
   controller (or "view model") instance. Angular 2.0 is moving in this 
   direction as well, removing the use of `$scope`.
2. The only reason to inject `$scope` is so that you can add a `$scope.on( '$destroy', destroyFn )`
   handler.
   

## Testing Pages

See [Testing Pages]({{ site.baseurl }}/testing/pages) guide.