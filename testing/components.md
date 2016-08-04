---
title: "Testing: Components"
layout: page-with-nav
permalink: /testing/components/
comments: true
---

Components are what make up the more complex "view pieces" of your app (more
complex than an HTML tag or two), which when pieced together, form pages of your 
app. (See [Components]({{ site.baseurl }}/architecture/components/) and 
[Pages]({{ site.baseurl }}/architecture/pages/) articles for more details.)


## Intro: Why It's Not Enough To Test The Scope/Controller Alone

Components are implemented in Angular 1.x as directives. These 
directives have 1) a controller and 2) an HTML template. Many testing 
guides (including the [Angular Unit Testing Guide](https://docs.angularjs.org/guide/unit-testing)) 
recommend that your tests check against properties of the controller 
for your expectations, but this is not enough since it is only half
the story (the other half being the HTML template). 

* You can see an example of a controller-only test that passes for a 
  broken component in the [Components - Example of Problem with Testing Only the Controller]({{ site.baseurl }}/testing/components-example-of-problem-with-only-testing-the-controller/)
  article.
  
* For a more in-depth analysis of some of the other pitfalls that can be 
  run into with controller-only testing, see the [Components - Why It's Not Enough to Only Test the Controller]({{ site.baseurl }}/testing/components-why-its-not-enough-to-only-test-the-controller/)


The solution to testing the controller + html together? Instead of 
asserting against `$scope`/controller properties, instantiate the entire
component and assert against the DOM. 


## Example Component

Following on the simple example component in the [Components]({{ site.baseurl }}/architecture/components/)
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

{% highlight javascript %}
describe( 'app-error-box', function() {

    var $compile,
        $scope,  // our "outer" scope - the one that will feed the component's inputs
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
        
        // fully initialize the component by triggering $watch handlers, 
        // flushing values to the DOM, etc.
        $scope.$apply();  
        
        // wrap the component in our TestWrapper for easy/reusable 
        // testing of the component
        return new AppErrorBoxTestWrapper( $el );   
    }
    
    
    it( 'should initially display the provided `header` and `text`, and ' + 
        'default the retry btn label to "Retry"', 
    function() {
        $scope.header = 'My Header';  // setting our scope properties here will bind
        $scope.text = 'My Text';      // them to our component when it is instantiated
        var appErrorBox = createComponent();
        
        appErrorBox.expectHeader( 'My Header' );
        appErrorBox.expectText( 'My Text' );
        appErrorBox.expectRetryBtnLabel( 'Retry' );
    } );
    
    
    it( 'should update the displayed `header` and `text` when they change', 
    function() {
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
    
    
    it( 'should call the `on-retry` expression when the "Retry" button ' +
        'is clicked', 
    function() {
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
   represent the component on page tests. See [Testing Pages]({{ site.baseurl }}/testing/pages) 
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
