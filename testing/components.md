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
the `$scope` (or properties of the controller in Angular 1.3+ using 
`bindToController`) for your assertions/expectations in tests, but this is not 
enough because that doesn't cover:

1. If the scope property is used as part of an `ng-if` or `ng-show` expression,
   for example.
2. If the scope property name is spelled correctly in the HTML template, which 
   would break the link to the data value silently (until hopefully your QA 
   testers notice, if you have some, or otherwise your users notice).



WIP:

1. It's possible that your scope property for a piece of text is correct, but 
   that it didn't make it to the DOM because of a misspelling in the HTML 
   template.
2. It's possible that your scope property for a piece of text is correct, but it 
   is accidentally (and inadvertently) hidden by an `ng-if` or an `ng-show` 
   above it (and one you didn't think to check).
3. It's possible that your expressions inside `ng-if`s, `ng-show`s, `ng-repeat`s,
   etc. simply aren't correct, so your scope properties are simply not going to
   display to the user correctly.
   
The solution to all these problems: Instead of asserting against `$scope`, 
assert against the DOM.



Let me walk you through an example: A dropdown component.


## The Dropdown Component

Here we'll have a simple dropdown component. This will be a simple replacement 
for the HTML `<select>` element. It's definition looks something like this:

dropdown.js

{% highlight javascript %}
angular.module( 'myApp' ).directive( 'my-dropdown', function() {
    'use strict';
    
    return {
        restrict : 'E',  // element directive
        
        scope : {        // always use an isolate scope - see [Components](/architecture/components/) article
            items        : '=',
            selectedItem : '=',
            onItemSelect : '&'
        },
        
        templateUrl  : 'components/dropdown/dropdown.html',
        controller   : 'MyDropdownCtrl',
        controllerAs : 'ctrl'
    };
    
} );


angular.module( 'myApp' ).controller( 'MyDropdownCtrl', [ '$scope', function( $scope ) {
    'use strict';
    
    // Public API
    this.selectItem = selectItem;
    
    
    function selectItem( item ) {
        $scope.selectedItem = item;
        $scope.onItemSelect( { $item: item } );
    }

} ] );
{% endhighlight %}


dropdown.html 

{% highlight html %}
<div class="dropdown__selected-item">{% raw %}{{ selectedItem.text }}{% endraw %}</div>
<div class="dropdown__list" ng-if="listVisible">
    <div ng-repeat="item in items" ng-click="ctrl.selectItem( item )">
        {% raw %}{{ item.text }}{% endraw %}
    </div>
</div>
{% endhighlight %}



For instance, say we have a scope property called `$scope.listVisible`, and
we have markup such as:

    <
 
 
 
 simply checking that a property, say, `$scope.` is `true` doesn't mean that the 
element `ng-if` 



## Why It's Not Enough To Test The $scope