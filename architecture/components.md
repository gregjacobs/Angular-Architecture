---
title: Components
layout: page-with-nav
permalink: /architecture/components/
---

Create your app out reusable, self-contained view components. These will be in 
the form of element directives for AngularJS.

Components are what make up the more complex "view pieces" of your app, which 
when pieced together, form pages of your app.


## Element Directives

We're going to focus on element directives for our components (and known 
specifically as 'components' in Angular 2.0).

Some examples of components could be:

- `<todo-item>`
- `<todo-list>`
- `<app-contacts-list>`
- `<app-contact-card>`
- `<app-performance-chart>`
- `<app-loading-spinner>`
- `<app-error-box>`


#### Simple Example

To pick a very simple example, let's analyze what an `<app-error-box>` might 
look like. This component will show 2 pieces of information: a message header 
and message text. Additionally, it will have a "Retry" button. It might end up
roughly looking something like this:

<div class="example-frame mb20">
    <div class="app-error-box">
        <div class="app-error-box__header">Connection Error (Header)</div>
        <div class="app-error-box__text">Please ensure that you have a network connection, and try again. (Text)</div>
        <button class="app-error-box__retryBtn">Retry</button>
    </div>
</div>

Here is the code for this component:

*components/app-error-box/app-error-box.js*

```javascript
angular.module( 'myApp' ).directive( 'appErrorBox', function() {
    'use strict';
    
    return {
        restrict : 'E',  // element directive
        scope : {        // always use an isolate scope
            header        : '=',
            text          : '=',
            retryBtnLabel : '=?',
            onRetry       : '&'
        },
        bindToController : true,  // Angular 1.3+
        
        templateUrl  : 'components/app-error-box/app-error-box.html',
        controller   : 'AppErrorBoxCtrl',
        controllerAs : 'ctrl'
    };
    
} );


angular.module( 'myApp' ).controller( 'AppErrorBoxCtrl', [ function() {
    'use strict';
    
    var ctrl = this;
    
    init();
    
    /**
     * Initializes the controller.
     *
     * @private
     */
    function init() {
        ctrl.retryBtnLabel = ctrl.retryBtnLabel || 'Retry';  // default to "Retry"
    }
    
} ] );
```


*components/app-error-box/app-error-box.html*

```html
<div class="app-error-box">
    <div class="app-error-box__header">{% raw %}{{ ctrl.header }}{% endraw %}</div>
    <div class="app-error-box__text">{% raw %}{{ ctrl.text }}{% endraw %}</div>
    
    <button class="app-error-box__retryBtn" ng-click="ctrl.onRetry()">
        {% raw %}{{ ctrl.retryBtnLabel }}{% endraw %}
    </button>
</div>
```


And finally, how we might instantiate this component from a page:

```html
<app-error-box 
    header="header" 
    text="text" 
    on-retry="loadData()"></app-error-box>
```


Couple of key points here:

1. **Element Directive**: Always use an element directive for your components. 
   This is the most semantic thing to do, rather than attaching, say, an 
   `app-error-box` attribute to a `<div>` element.<br>
   
2. **Isolate Scope**: Always use an isolate scope. You want your component to be 
   self-contained and reusable for multiple pages, or in multiple places on the 
   same page with different data.<br><br>
   Because the component has an isolate scope, you will "pass in" the data it 
   needs via attributes. In this example, data is passed in via the `header` and 
   `text` attributes. This makes it very easy to see the data flow from the 
   page controller into the component as well (as opposed to the component 
   consuming page-level data directly from somewhere within its 
   template/controller, which can be very hard to track). 
   <br>
   
3. **Attributes for Events**: Use attributes for when "events" happen within the 
   component. In this example, this is the job of the `on-retry` attribute, 
   which allows the owning page controller to respond to when the "Retry" button 
   is clicked.<br>
   
4. **Private `init()` method** (optional): I personally tend to create a private 
   `init()` method for where to put all of the component's initialization logic. 
   This is called immediately upon instantiation, and makes it easy to see all
   of the initialization steps in one place. You may choose to omit this of 
   course (instead writing statements directly in the constructor function's 
   main body), but I recommend it for readability purposes.
   
5. **Use Controller instead of `link` function**: Always use a controller 
   instead of a `link` function. This makes things easier and consistent with 
   all other components, especially the ones that specifically need a controller 
   as a public interface.<br><br>
   When doing things this way, you don't end up with some of your components 
   using `controller` for their logic, and others that use the `link` function 
   for their logic. You also never run into the issue where a new public 
   controller method can't call some private function buried inside the `link` 
   function, which will trigger a necessary and potentially large refactor of 
   the component.<br>
   
    1. **Performing DOM Manipulation on Initialization**: You probably looked at
       the above and said, "But wait! The controller is not a safe to do DOM 
       manipulation from! I need the link() function!" For this, you would be 
       correct. But there is a simple workaround.<br><br>
       Instead of implementing all of your logic in the `link()` function, just 
       make your controller's `init()` method public, and call it from the 
       `link` function. What this may look like is this:
       
        ```javascript
        angular.module( 'myApp' ).directive( 'appErrorBox', function() {
           'use strict';
        
           return {
               restrict : 'E',  // element directive
              
               // ...
               
               controller   : 'AppErrorBoxCtrl',
               controllerAs : 'ctrl',
            
               link : function( scope, element, attrs, ctrl ) {
                   ctrl.init();  // initialize controller now to begin DOM manipulation
               }
           };
        
        } );
        
        
        angular.module( 'myApp' ).controller( 'AppErrorBoxCtrl', [ function() {
            'use strict';
        
            var ctrl = this;
        
            // Public API
            this.init = init;
        
            /**
             * Initializes the controller as a result of the component's `link`
             * function being executed.
             */
            function init() {
                // Do DOM manipulation here
            }
        
        } ] );
        ```

6. **Single Responsibility** At a core level, a component should simply be 
   responsible for taking in some data, and displaying it to the user. It should 
   basically only center around formatting the data for the view (if needed), 
   and handling user input events on the component.<br><br>
   Generally, don't call services for data from within the component - it's the 
   job of the owning page controller to provide the data, and display loading 
   indicators and such. This makes the component flexible in that it can be fed
   data from one or more data sources, and be reused on multiple pages.<br><br>
   Also, don't do generalized data transformations/filtering, which is likely 
   the job of a service or domain object. Think: "If I need to use this logic 
   somewhere else in the app, where would it be reusable from?"
   - There are some exceptions to the rule of not loading data from the 
     component. For instance, you may have a complex modal dialog that is used 
     in many places in your app, and needs to load data from a few places, show
     its own loading indicators, etc. In this case, it might be best to let the 
     component load the data, despite tying it to a given data source. 
     Ultimately the decision is yours, but for the most part keeping your logic 
     in your services/domain objects, and providing the data to the component 
     via the page controller ensures that you will allow for the most reuse 
     of your component possible. 
    