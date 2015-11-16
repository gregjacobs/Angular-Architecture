---
title: Testing Components
layout: page-with-nav
permalink: /testing/components/
---

Components are what make up the more complex "view pieces" of your app, which 
when pieced together, form pages of your app. (See [Components](/architecture/components/)
and [Pages](/architecture/pages/) guides for more details on this architecture.)


## It's Not Enough To Test The Scope/Controller Alone

Components are implemented in Angular 1.x as directives. These directives have a
controller and an HTML template. Many testing guides recommend that your tests 
check against properties of the `$scope`/controller for your assertions/expectations, 
but this is not enough, and is actually only half of the story. (You can
see this kind of testing in action in the 
[Components - The Old Way of Doing Things](/testing/components-the-old-way-of-doing-things/)
article.)

Otherwise, consider the following scenarios where `$scope`/controller properties
may look good, but the component is broken:

1. **Misspelled/Incorrect Property Names in the HTML Template**: It's possible 
   that your scope/controller property for say, a piece of text is correct, 
   but that it didn't make it to the DOM because of a property misspelling in 
   the HTML template. Or, another possibility is that you accidentally used the 
   incorrect property name (but one that exists) at that place in the template.<br><br>
   Example:
   
    ```html
    <div>{% raw %}{{ headr }}{% endraw %}</div>  <!-- Should have been `header`. Someone accidentally removed that 'e' character -->
    ```
2. **Element is Accidentally Removed by an `ng-if` Above It**: 
   It's possible that your scope/controller property for a piece of text is 
   correct, and you are expecting it to display to the user, but it is 
   accidentally (and inadvertently) removed/hidden by the expression in an 
   `ng-if` above it on an ancestor element.<br><br>
   Example:
    
    ```html
    <div ng-if="allDataLoaded">  <!-- Should probably move this ng-if elsewhere -->
        <div>{% raw %}{{ loadingText }}{% endraw %}</div>
    </div>
    ```
3. **Expressions Inside an `ng-if`, `ng-repeat`, `ng-show`, etc. Are Simply Not Correct**:
   It's possible that an expression inside an `ng-if`, `ng-repeat`, `ng-show`,
   etc. simply isn't correct, so your component is not going to display to the 
   user correctly.<br><br>
   For example: maybe you meant to put `ng-if="!flag"` rather than `ng-if="flag"` 
   in an expression, or `something && somethingElse` vs. `something || somethingElse`. 
   Example:
   
    ```html
    <div ng-if="dataLoaded || errorOccurred">  <!-- Should have been `&& !errorOccurred` -->
        Your data is...
    </div>
    ```
    
4. **Accidental Bind Once**: It's possible that you used the Angular 1.3+ 'bind 
   once' syntax (`::`) on something in your template that you didn't mean to, 
   and your value is not getting updated to reflect changes to the user when a 
   model changes.<br><br>
   Example:
   
    ```html
    Item1: $50. Qty: <input type="text" ng-model="numItem1">
    Item2: $25. Qty: <input type="text" ng-model="numItem2">
    
    Shopping cart total: {% raw %}{{ ::total }}{% endraw %}  <!-- Should not use bindonce syntax here, as the user may update the number of items -->
    ```
   
_**In all of these scenarios**_, if you only tested the `$scope`/controller 
properties, your tests may have passed because those properties looked good, but 
your components did not display correctly to the user because of expressions in 
the HTML template. 

The solution to all these problems? Instead of asserting against 
`$scope`/controller properties, assert against the DOM.


## Example Component

Following on the simple example component in the [Components](/architecture/components/)
article for an app's standard "error" box, we'll test it here using this
technique.

A refresher on the code of our `<app-error-box>` component:

*app-error-box.js*

```javascript
{% include app-error-box/app-error-box.js %}
```


*app-error-box.html*

```html
{% include app-error-box/app-error-box.html %}
```


And finally, how we might instantiate this component from a page:

```html
{% include app-error-box/app-error-box-usage.html %}
```


## Testing This Component via its Public Interface and Observing the DOM

In order to test this component, we want to test it through its *public 
interface*. This is a common theme in unit testing: test through the public 
interface because it doesn't matter to clients of your component if the 
"behind-the-scenes" details change, as long as they get what they expect. This 
is also known as "black box testing" - testing without relying on the internal
details of the component.

In the case of Angular components, we want to test them via their public 
interface by first instantiating the component, and feeding data to its 
attributes. 

So how do we set this up? Here's a basic outline for your test file, with a few
initial tests:

<div class="aside mb20">
    Note: You will be probably be wondering what the "TestWrapper" is when 
    reading this test file. We will be going into that in detail later on, but 
    for now know that it simply wraps and represents the component for the 
    tests, providing methods for common expectations, and actions that user may 
    take on the component.
</div>

*components/app-error-box/app-error-box.spec.js*

{% highlight javascript linenos %}
describe( 'app-error-box', function() {

    var $compile,
        $scope,                  // our "outer" scope - the one that will feed the component's inputs
        AppErrorBoxTestWrapper;  // wrapper for testing this component - more on this later

    beforeEach( module( 'myApp' ) );
    
    beforeEach( function( inject( $injector ) {
        $compile               = $injector.get( '$compile' );
        $scope                 = $injector.get( '$rootScope' ).$new();
        AppErrorBoxTestWrapper = $injector.get( 'AppErrorBoxTestWrapper' );
    } ) );
    
    
    function createComponent() {
        var $el = $compile( [ 
            '<app-error-box',
                ' header="header"',
                ' text="text"',
                ' on-retry="onRetry()">',
            '</app-error-box>'
        ].join( '' ) )( $scope );
        
        $scope.$apply();  // fully initialize the component by triggering $watch handlers, flushing values to the DOM, etc.
        
        return new AppErrorBoxTestWrapper( $el );  // wrap the component in our TestWrapper for easy/reusable testing of the component 
    }
    
    
    it( 'should initially display the provided `header` and `text`, and default the retry btn label to "Retry"', function() {
        $scope.header = 'My Header';  // setting our scope properties here will bind
        $scope.text = 'My Text';      // them to our component when it is instantiated
        var appErrorBox = createComponent();
        
        appErrorBox.expectHeader( 'My Header' );
        appErrorBox.expectText( 'My Text' );
        appErrorBox.expectRetryBtnLabel( 'Retry' );
    } );
    
    
    it( 'should update the displayed `header` and `text` when they change', function() {
        $scope.header = 'Header 1';
        $scope.text = 'Text 1';
        var appErrorBox = createComponent();
        
        appErrorBox.expectState( 'Header 1', 'Text 1', 'Retry' );  // initial condition
            // Note: `expectState()` is a shorthand method for the 3 separate expectations 
        
        // Now update the properties
        $scope.header = 'Header 2';
        $scope.text = 'Text 2';
        $scope.$apply();
        
        appErrorBox.expectState( 'Header 2', 'Text 2', 'Retry' );
    } );
    
    
    it( 'should call the `on-retry` expression when the "Retry" button is clicked', function() {
        $scope.onRetry = jasmine.createSpy( 'onRetry' );
        var appErrorBox = createComponent();
            
        expect( $scope.onRetry ).not.toHaveBeenCalled();  // not yet
    
        appErrorBox.clickRetryBtn();
        expect( $scope.onRetry ).toHaveBeenCalled();
    } );

} );
{% endhighlight %}


So what did we do here?

1. **Use `$compile` to Instantiate the Component**: Our `createComponent()` 
   function actually instantiates the component just like our pages would when
   running the app.<br><br>
   We then fully initialize our component by using `$scope.$apply()`, which runs 
   an initial digest to execute `$watch` handler functions, flush values to the 
   DOM, etc. 
   
2. **Configure the Component Through Attributes**: We passed data into our 
   component by tying its HTML markup to a new `$scope` object within our tests.
   This binds the component to our `$scope` object, where setting properties 
   like `$scope.header` and `$scope.text` have the effect of updating the 
   component when digested.
   
3. **Run Expectations (Assertions) Against the Component**: We want to assert
   that our component is in fact displaying the data that we expect it to
   display. This is where our component's "TestWrapper" comes in (which is 
   returned by `createComponent()`), discussed next.



## The Component's TestWrapper

You were probably wondering what this "TestWrapper" was in the above tests. 

The TestWrapper class is used to encapsulate knowledge of the particular 
component's HTML markup, and provide methods for common expectations and user 
action simulation in order to easily test the component. 

*AppErrorBoxTestWrapper.js*

```javascript
angular.module( 'myApp' ).factory( 'AppErrorBoxTestWrapper', [ function() {
    'use strict';

    var AppErrorBoxTestWrapper = function( $el ) {
        this.$el = $el;
    }
    
    AppErrorBoxTestWrapper.prototype = {
    
        // May want to put this method into either a service or base class 
        // (or inherited prototype object if going that route)
        findElem : function( selector ) {
            return angular.element( this.$el[ 0 ].querySelectorAll( selector ) );
        }
    
        // Methods to Retrieve DOM elements (usually treat as private/protected)
        getHeaderEl   : function() { return this.findElem( '.app-error-box__header' ); },
        getTextEl     : function() { return this.findElem( '.app-error-box__text' ); },
        getRetryBtnEl : function() { return this.findElem( '.app-error-box__retryBtn' ); },
    
        // Methods to retrieve the inner text of the elements (again, usually treat as private/protected)
        getHeader     : function() { return this.getHeaderEl().text(); },
        getText       : function() { return this.getTextEl().text(); },
        getRetryBtnLabel : function() { return this.getRetryBtnEl().text().trim(); },  // trim because we put the text on a new line in the template
     
     
        // Common Expectations
        
        expectHeader : function( expectedHeader ) {
            expect( this.getHeader() ).toBe( expectedHeader );
        },
        
        expectText : function( expectedText ) {
            expect( this.getText() ).toBe( expectedText );
        },
        
        expectRetryBtnLabel : function( expectedRetryBtnLabel ) {
            expect( this.getRetryBtnLabel() ).toBe( expectedRetryBtnLabel );
        },
        
        // Convenient Combination Method
        expectState : function( header, text, retryBtnLabel ) {
            this.expectHeader( header );
            this.expectText( text );
            this.expectRetryBtnLabel( retryBtnLabel );
        },
        
        
        // User Interaction Simulation Methods
        
        clickRetryBtn : function() {
            this.getRetryBtnEl().triggerHandler( 'click' );
        }
        
    };
    
    
    return AppErrorBoxTestWrapper;
    
} ] );
```

So what do we have here? 

We have a class that can now wrap an `<app-error-box>` instance, which provides 
us:

1. Private methods to be able to retrieve the component's inner elements (the 
   `getXyzEl()` methods) 
2. Private methods to retrieve the inner text of those elements (the `getXyz()` 
   methods)
3. Public methods to expect the component to be in a certain state (the 
   `expectXyz()` methods), and
4. Public methods to simulate user interaction with the component (`clickRetryBtn()`)

This allows us to represent the component in any test file, whether it be for 
its own test file (`app-error-box.spec.js`), or when this component is being 
asserted against as part of a larger page's tests. 


Breaking down the purpose of this class further, it:

1. **Encapsulates Knowledge of the Component's Markup**: This helps to keep our
   actual tests nice and short. Each of our tests reads as a DSL (domain 
   specific language), and is very clear about what they expect. We don't have
   DOM query methods and CSS selectors sprinkled around in the tests, which 
   keeps them clear and concise.<br><br>
   Also, when the markup of the component changes, the only thing that needs to 
   be updated is the TestWrapper for the component, specifically the `getXyzEl()`
   methods. This becomes especially important when the TestWrapper is used to 
   represent the component on page tests. See [Testing Pages](/testing/pages) 
   for more information on that.

2. **Provides Common Expectation (Assertion) Methods to Check the Component's State**:
   As with the above point, we don't want to pollute our tests with a ton of DOM
   querying code. We want to have statements in our tests that make immediate 
   sense as to what we're checking.<br><br>
   For example, saying something like this in a test:
    
    ```javascript
    appErrorBox.expectTitle( 'My Title' );
    ```
    
    is much better than saying:
    
    ```javascript
    expect( angular.element( $el.querySelector( '.app-error-box__header' ) ).text() ).toBe( 'My Title' );
    ```

3. **Provides Methods to Simulate User Interaction With the Component**:
   We also want to provide a way to simulate user interaction with the 
   component. In the above test file, we use the `clickRetryBtn()` method to
   simulate a click to that element, and then we check that the function in the
   `on-retry` attribute has been executed.




## Why This Testing Is Much More Solid than Testing Scope/Controller Properties

As outlined in the introduction to this article, it should be quite clear that
instead of just testing a component's controller, you are testing the component
as a whole. This means the component's directive definition + controller + HTML 
template.

Further, you are now testing the component through its *public interface*, and 
checking its observable output. This allows the component to be changed/refactored 
behind the scenes (quite literally every internal method/variable can 
change), and your tests will still pass if the component still works correctly.
This is because your tests are checking the component's functionality from the 
perspective of client code and the user, rather than calling specific internal
methods.
