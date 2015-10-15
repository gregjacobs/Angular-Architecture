---
title: Testing Components
layout: page-with-nav
permalink: /testing/components/
---

Components are what make up the more complex "view pieces" of your app, which 
when pieced together, form pages of your app. (See [Components](/architecture/components/)
for more details on this architecture.)

Components are implemented in Angular 1.x as directives, usually element 
directives. Many testing guides recommend that you simply check properties of 
the `$scope` (or properties of the controller) for your assertions/expectations 
in tests, but this is not enough. Think of the following scenarios:

1. It's possible that your scope property for say, a piece of text is correct, 
   but that it didn't make it to the DOM because of a property misspelling in 
   the HTML template.
2. It's possible that your scope property for a piece of text is correct, but it 
   is accidentally (and inadvertently) removed by an `ng-if` above it (and one 
   you didn't think to check).
3. It's possible that your expression inside an `ng-if`, `ng-show`, `ng-repeat`,
   etc. simply isn't correct, so your component is simply not going to display 
   to the user correctly.
4. It's possible that you used the bind once syntax (`::`) on something in your
   template that you didn't mean to, and your value is not getting updated to
   display to the user when something changes.
   
**In all of these scenarios**, your tests may have passed because your `$scope` 
properties looked good, but your component did not display correctly to the 
user. The solution to all these problems? Instead of asserting against `$scope`, 
assert against the DOM.

Let me walk you through an example: A dropdown component.


## The Dropdown Component

Here we'll have a simple dropdown component from the "todo" example app. This 
is a simple replacement for the HTML `<select>` element, but will help to 
demonstrate the concepts. It's definition looks something like this:

*todo-dropdown.js*

{% highlight javascript %}
angular.module( 'myApp' ).directive( 'myDropdown', function() {
    'use strict';
    
    return {
        restrict : 'E',  // element directive
        
        scope : {        // always use an isolate scope - see "Components" article
            items        : '=',
            selectedItem : '=',
            onItemSelect : '&'
        },
        
        templateUrl  : 'components/dropdown/todo-dropdown.html',
        controller   : 'MyDropdownCtrl',
        controllerAs : 'ctrl'
    };
    
} );


angular.module( 'myApp' ).controller( 'MyDropdownCtrl', [ '$scope', function( $scope ) {
    'use strict';
    
    // Public API
    this.selectItem = selectItem;
    
    
    /**
     * Called when an item is clicked by the user, selects the item 
     * and notifies listeners of `on-item-select`.
     */
    function selectItem( item ) {
        $scope.selectedItem = item;
        $scope.onItemSelect( { $item: item } );
    }

} ] );
{% endhighlight %}


*todo-dropdown.html*

{% highlight html %}
<div class="dropdown__selected-item">{% raw %}{{ selectedItem.text }}{% endraw %}</div>
<div class="dropdown__list" ng-if="listVisible">
    <div ng-repeat="item in items" ng-click="ctrl.selectItem( item )">
        {% raw %}{{ item.text }}{% endraw %}
    </div>
</div>
{% endhighlight %}


## Testing This Component

In order to test this component, we want to test it through its *public 
interface*. In the case of an Angular component, this is 





For instance, say we have a scope property called `$scope.listVisible`, and
we have markup such as:

    <
 
 
 
 simply checking that a property, say, `$scope.` is `true` doesn't mean that the 
element `ng-if` 



## Why It's Not Enough To Test The $scope

TODO: Example of a scope property being correct, but the expression in an
ng-if is incorrect
 
 
## How to test

First, we want to create an instance of the component, so that we can test it
through its public interface. This is a common theme in unit testing: test 
through the public interface because it doesn't matter to clients if the 
"behind-the-scenes" details change, as long as they get what they expect.

TODO: Example of how to instantiate the component in a test

TODO: Some examples of how we *want* to be able to write tests (i.e., we want to
be able to write something like component.isListVisible())

TODO: Explanation of testing utility for the component, and example 
implementation.

TODO: Explanation of simulating user DOM events