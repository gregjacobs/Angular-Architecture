---
title: Pages
layout: page-with-nav
permalink: /architecture/pages/
---

Pages are what make up your app. Each page displays a UI to the user, and is 
composed of HTML elements and child [Components](/architecture/components) to
accept the user's input, display information, etc.

## The Old Way of Doing Things:

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


## Creating Pages as Components

Instead of the old way of doing things, I recommend creating pages as 
self-contained view [components](/architecture/components). An element directive 
creates a tag for the page, and allows for attributes for input.

Directory structure (new):

    app
        home
            my-home.html
            my-home.js
        page1
            my-page1.html
            my-page1.js
        app.js

(see [File Organization](/architecture/file-organization) article for details)

*app.js* (new)

{% highlight javascript %}
angular.module( 'myApp' ).config( [ '$routeProvider', function( routeProvider ) {
    'use strict';
    
    $routeProvider
        .when( '/home', {
            template : '<my-home></my-home>'
        } )
        .when( '/page1/:param', {
            template : function( routeParams ) {
                return '<my-page1 param="' + routeParams.param + '"></my-page1>';
            }
        } );

} ] );
{% endhighlight %}

*my-page1.js*

{% highlight javascript %}
angular.module( 'myApp' ).directive( 'myPage1', function() {
    'use strict';
    
    return {
        restrict : 'E',  // element directive
        scope : {        // always use an isolate scope - see "Components" article
            param : '@'
        },
        
        templateUrl  : 'page1/my-page1.html',
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
   rather than just the `$scope`. See [Testing Pages](/testing/pages) for 
   details.

If you haven't read the article for [Routing](/architecture/router) yet, I 
recommend you do so now.



#### Pro Tip

- Don't access `$routeParams` from inside your page controllers. In fact, never
  use the `$routeParams` injectable at all. Instead, feed the input for your 
  pages using attributes. This makes your pages 100% flexible, and reusable if 
  needed. See the [Router](/architecture/router) article for details on how to 
  pass in route parameters using attributes.
   

## Page HTML Templates

You want to keep the HTML of your page templates short. 100 lines or less is a 
good goal.

In order to do this, you want to break down your pages into sub 
[components](/architecture/components).

Example of messy page:

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
            <button>...</button>
            <button>...</button>
        </div>
        <div>
            <span>...</span>
        </div>
    </div>
</div>
{% endhighlight %}


Example of page nicely broken down into distinct components:

{% highlight html %}
<div>
    <my-header class="header" title="ctrl.title">
    
    <my-spinner ng-if="ctrl.pageState === 'loading'"></my-spinner>
    
    <div class="content" ng-if="ctrl.pageState === 'loaded'">
        <my-item ng-repeat="item in ctrl.items" 
                 on-edit="ctrl.edit( item )" 
                 on-remove="ctrl.remove( item )"></my-item>
        
        <my-items-options on-select-all="ctrl.selectAll()"></my-items-options>
    </div>
    
    <my-footer></my-footer>
</div>
{% endhighlight %}

See [Components](/architecture/components) guide for building components.

## Page Controllers

Page controllers have the responsibility of calling your [service](/architecture/services) 
layer to retrieve data, and expose it to be consumed by your view components.

In general, page controllers should load data rather than individual [component](/architecture/components) 
controllers, so that it's left to the page to control loading spinners and 
coordinate between potentially multiple calls / data sources. 

*my-page1.js*

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
   
   
TODO: Add piece about controller style. Link to John Papa's style guide


## Testing Pages

See [Testing Pages](/testing/pages) guide.