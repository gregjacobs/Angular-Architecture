---
title: "Testing: Components - The Old Way of Doing Things"
layout: page-with-nav
permalink: /testing/components-the-old-way-of-doing-things/
comments: true
---

As part of the [Testing Components](/testing/components/) article, this is to
demonstrate the problem with controller-only testing in a very short example. 
Here is a test for a component that only asserts against a controller property,
rather than testing the component as a whole. The component itself here is 
broken, but the test passes:

*app-display-exclamation-text.js*

```javascript
/**
 * @ngdoc directive
 * @name appDisplayExclamationText
 *
 * Takes the attribute `text`, and adds an '!' after it before displaying.
 */
angular.module( 'myApp' ).directive( 'appDisplayExclamationText', function() {
	'use strict';

	return {
		restrict : 'E',  // element directive
		scope : {
		    text : '=',
		},

		templateUrl  : 'components/app-display-text/app-display-text.html',
		controller   : 'AppDisplayTextCtrl',
		controllerAs : 'ctrl'
	};

} );

angular.module( 'myApp' ).controller( 'AppDisplayExclamationTextCtrl', 
         [ '$scope', 
function (  $scope ) {
	'use strict';
	
	var ctrl = this;

    $scope.$watch( 'text', function onTextChange( newText ) {
        ctrl.text = newText + '!'
    }
    
} ] );
```

*app-display-exclamation-text.html*

```html
<div class="app-display-exclamation-text">{% raw %}{{ ctrl.txt }}{% endraw %}</div>
```


And the test that only checks the controller's (or `$scope`'s) properties:

```javascript
describe( 'AppErrorBoxCtrl', function() {
    'use strict';
    
    var $controller,
        $scope;
    
    beforeEach( module( 'myApp' ) );
    
    beforeEach( inject( function( $injector ) {
        $controller = $injector.get( '$controller' );
        $scope      = $injector.get( '$rootScope' ).$new();
    } );
    
    
    function createCtrl() {
        var ctrl = $controller( 'AppErrorBoxCtrl', { $scope: $scope } );
        $scope.$apply();  // execute $watch handler functions
        
        return ctrl;
    }
    
    
    it( 'should display the text with an exclamation point after it', function() {
        $scope.text = 'My Text';
        var ctrl = createCtrl();
        
        expect( ctrl.text ).toBe( 'My Text!' );
    } );

} );
```

Here, this test will pass, but the component is broken because its HTML template
referenced `ctrl.txt` instead of `ctrl.text`.

See the [Testing Components](/testing/components) article for a better way.