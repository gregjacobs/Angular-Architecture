---
title: "Testing: Components: Why It's Not Enough to Only Test the Controller"
layout: page-with-nav
permalink: /testing/components-why-its-not-enough-to-only-test-the-controller/
comments: true
---

Consider the following scenarios where `$scope`/controller properties
may look good, but the component is broken:

1. **Misspelled/Incorrect Property Names in the HTML Template**: It's possible 
   that your scope/controller property for say, a piece of text is correct, 
   but that it didn't make it to the DOM because of a property misspelling in 
   the HTML template. Or, another possibility is that you accidentally used the 
   incorrect property name (but one that exists) at that place in the template.<br><br>
   Example:
   
    ```html
    <div>{% raw %}{{ headr }}{% endraw %}</div>  <!-- Should have been `header`. Someone accidentally removed the 'e' character -->
    ```
2. **Element is Accidentally Removed by an `ng-if`**: 
   It's possible that (for example) your scope/controller property for some text 
   is correct, and you are expecting it to display to the user, but it is 
   accidentally removed by the expression in an `ng-if` above it.<br><br>
   Example:
    
    ```html
    <div ng-if="allDataLoaded">  <!-- Should probably move this ng-if elsewhere -->
        ...
        
        <div>{% raw %}{{ loadingText }}{% endraw %}</div>
        
        ...
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
`$scope`/controller properties in your tests, assert against the DOM. 
See [Testing Components]({{ site.baseurl }}/testing/components) for 
details.