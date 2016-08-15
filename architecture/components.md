---
title: "Architecture: Components"
layout: page-with-nav
permalink: /architecture/components/
comments: true
---

Create your app out reusable, self-contained view components. These will 
be created with the [component](https://docs.angularjs.org/guide/component) 
recipe for Angular 1.5+ (or ["element directives"](https://code.angularjs.org/1.4.11/docs/guide/directive) 
for Angular 1.4 and below).

Components are what make up the more complex "view pieces" of your app, 
which when pieced together, form pages of your app.


## Components / Element Directives

Some examples of components in our Heroes app could be:

- `<my-heroes-list>`
- `<my-hero-detail>`
- `<my-top-heroes>`

See the Angular 2 tutorial at [https://angular.io/docs/ts/latest/tutorial/](https://angular.io/docs/ts/latest/tutorial/)
for examples of these.

<!--
![Heroes Components Diagram]({{ site.baseurl }}/images/nav-diagram.png)
-->


#### Simple Example

To pick a very simple example, let's analyze what the `<my-heroes-list>` 
component might look like. This component will show the list of heroes 
with their IDs, and allow the user to select one.

<img src="{{ site.baseurl }}/images/heroes-list-1-cropped.png" class="example-frame" alt="Heroes List" title="Heroes List">

Here is the code for this component:

*my-heroes-list.html*

```html
{% include heroes-list/my-heroes-list.html %}
```

*my-heroes-list.js*

```javascript
{% include heroes-list/my-heroes-list.js %}
```


And finally, how we might instantiate this component from a page:

```html
{% include heroes-list/my-heroes-list-usage.html %}
```


Couple of key points here:

1. **Component (or Element Directive)**: Always use the Angular [Component Recipe](https://docs.angularjs.org/guide/component)
   (or an [element directive](https://code.angularjs.org/1.4.11/docs/guide/directive) 
   for Angular 1.4 and below) for your components. An HTML element like
   `<my-heroes-list></my-heroes-list>` makes more sense than attaching 
   an attribute directive such as `<div my-heroes-list></div>`.<br>
   
2. **Inputs for the data needed**: You want your component to be 
   self-contained and reusable for multiple pages, or in multiple spots 
   on the same page with different data.<br><br>
   Because the component has an isolate scope, you will "pass in" the 
   data it needs via attributes. In this example, data is passed in via 
   the `heroes` attribute **instead of having the component load its own
   data**. This is what is going to allow you to reuse the component for
   multiple purposes, and also allow the containing [page]({{ site.baseurl }}/architecture/pages)
   to better control loading spinners and such. More on this in point #5
   below.
   
3. **Attributes for 'Events'**: Use attributes for when "events" happen 
   within the component. In this example, this is the job of the 
   `on-hero-select` attribute, which allows the owning page controller 
   to respond to when a hero is clicked.<br>
   
4. **Performing DOM Manipulation on Initialization**: With Angular 1.5+,
   the `$postLink` function can be implemented in your controller.<br><br>
   Example Controller (Angular 1.5+):
   
    ```javascript
    function MyController( $element ) {
        var ctrl = this;
          
        ctrl.$postLink = function() {
            $element.querySelector( '.my-child' ).classList.add( 'my-class' );
        }
    }
    ```

5. **Single Responsibility**: At a core level, a component should simply 
   be responsible for taking in some data, and displaying it to the user. 
   It essentially only center around formatting the data for the view 
   (if needed), and handling user input events on the component.<br><br>
   _**Generally, don't call services from within the component**_ - it's 
   the job of the owning page controller to provide the data, and 
   display loading indicators and such. This makes the component 
   flexible in that it can be fed data from one or more data sources, 
   and be reused on multiple pages.<br><br>
   Also, don't do generalized data transformations/filtering, which is 
   likely the job of a [service]({{ site.baseurl }}/architecture/services),
   or [models and collections]({{ site.baseurl }}/architecture/models-and-collections). 
   Think: "If I need to use this logic somewhere else in the app, where 
   would it be reusable from?"
   - Note: There are some exceptions to the rule of not loading data 
     from the component. For instance, you may have a complex modal 
     dialog that is used in many places in your app, and needs to load 
     data from a few places, show its own loading indicators, etc. In 
     this case, it might be best to let the component load the data, 
     despite tying it to a given data source. Ultimately the decision is 
     yours, but for the most part keeping your logic in your 
     services/models and collections, and providing the data to the 
     component via the page controller ensures that you will allow for 
     the most reuse of your component possible.
      
For how to test, see [Testing Components]({{ site.baseurl }}/testing/components).

Next Article: [Pages]({{ site.baseurl }}/architecture/pages/)
    