---
title: "Testing: Components"
layout: page-with-nav
permalink: /testing/components/
comments: true
---

For testing [components]({{ site.baseurl }}/architecture/components/), 
we'll take an approach that involves asserting against the DOM of a 
component (the "output"), rather than simply checking properties of the 
controller. This is a departure from the Angular-recommended approach to 
testing (which can be viewed [here](https://docs.angularjs.org/guide/unit-testing)), 
and also blurs the lines between unit+integration testing, and e2e 
(end-to-end) testing. 

The reasons for this are described below.

## Intro: Why It's Not Enough To Test The Controller Alone

Components are a combination of 1) a _controller_, and 2) an _HTML 
template_. Many testing guides (including the [Angular Unit Testing Guide](https://docs.angularjs.org/guide/unit-testing)) 
recommend that your tests assert against properties of the controller, 
but this is not enough since it is only half the story. A few reasons:

1. It is very easy for the HTML to become out-of-sync from the 
   controller's properties. This gives you the possibility of tests that
   can pass for what is ultimately a broken component. See the 
   example in [Components - Example of Problem with Testing Only the Controller]({{ site.baseurl }}/testing/components-example-of-problem-with-only-testing-the-controller/).
   
2. There are many cases where changes to the HTML template may prevent 
   the user from seeing what he/she is supposed to see. For an in-depth 
   analysis of these cases, see the [Components - Why It's Not Enough to Only Test the Controller]({{ site.baseurl }}/testing/components-why-its-not-enough-to-only-test-the-controller/)
   article.

The solution to these problems is to test the controller + the html 
together by actually instantiating the component itself. Instead of 
asserting against `$scope`/controller properties, instantiate the entire
component and assert against the DOM. 


## Example Component Tests

We'll continue with the `<ms-heroes-list>` component from the 
[Components]({{ site.baseurl }}/architecture/components/) article for 
our presentation of testing a component. Here's what our component looks
like, and its code: 

<img src="{{ site.baseurl }}/images/heroes-list-1-cropped.png" class="example-frame" alt="Heroes List" title="Heroes List">

*my-heroes-list.js*

```javascript
{% include heroes-list/my-heroes-list.js %}
```


*my-heroes-list.html*

```html
{% include heroes-list/my-heroes-list.html %}
```


And finally, how we might instantiate this component from a page:

```html
{% include heroes-list/my-heroes-list-usage.html %}
```


## Testing the Component via its Component Interface

In order to test this component, we want to test it through its *public 
component interface*. This means that we'll be populating the component 
with data, and listening to its events in the same way that the rest of 
your app will. We'll then observe the DOM output of the component in 
order to assert that the component's behavior is correct.

To do this, we'll be instantiating the component using the `$compile`
service, and providing data to its attributes. See below.

<div class="aside mb20">
    Note: You will be probably be wondering what the "TestWrapper" is 
    when reading this test file. We will be going into that in detail 
    later on, but for now know that it simply represents the instantiated
    component for the tests, and provides methods for common expectations 
    and actions that the user may take on the component.
</div>

*my-heroes-list.spec.js*

{% highlight javascript %}
{% include heroes-list/my-heroes-list.spec.js %}
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



* _Why Test Only the Public Interface?_: This is a common theme in unit 
testing: test through the public interface because it doesn't matter to 
the component's clients if the "behind-the-scenes" details of the 
component change, as long as the client still gets what they expect. This 
is also known as "black box testing" - testing without relying on the internal
details of the component.

## The Component's TestWrapper

You were probably wondering what this "TestWrapper" was in the above 
tests. 

The TestWrapper is used to encapsulate knowledge of the particular 
component's HTML markup, and provide methods for common expectations and 
user action simulation in order to easily test the component. 

*MyHeroesListTestWrapper.js*

```javascript
{% include heroes-list/MyHeroesListTestWrapper.js %}
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
