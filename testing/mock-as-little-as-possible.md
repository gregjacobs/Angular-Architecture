---
title: "Testing Best Practices: Mock as Little As Possible"
layout: page-with-nav
permalink: /testing/mocking/
comments: true
---


## Always Write Integration Tests

Many schools of thought say that everything being tested should be a unit test,
and it must be completely isolated from the system with mocks for all 
dependencies that the unit under test might access.

In theory, this sounds great. In reality, it's highly ineffective, especially in
JavaScript. More on the JavaScript part in particular later, but the basically
the modules of your system are subject to change, and when they do, a wholeeeee 
lot of mocks might need to be changed as well. You can essentially change your
service method to return a brand new type (say, going from a string to an 
object), and you won't know how many parts of your system are broken because 
they all mock out the service method. 
 
TODO: Add example of mocking out a service from a controller test, and then the
service changes its return value.


Another example: You thought you were returning a rejected promise in a chain, 
but you by accident returned a value that became a resolved promise. 

TODO: Add service code that has the bug, and then show how mocking out the 
service in a controller test will show tests passing even though the code is 
broken. 
  - Even though your service method should have been tested itself, it is 
    possible that a developer simply changed it and didn't add a covering test,
    and therefore your client code is now broken.
    
Great article on the subject, and watching the video it came from between
Martin Fowler, Kent Beck, and David Heinemeier Hansson (first link) reveals that 
all three heavyweights in the industry rarely mock anything. 
<https://www.thoughtworks.com/insights/blog/mockists-are-dead-long-live-classicists>



#### Use Testing Utilities to Simulate Behavior Instead of Mocking

TODO:



#### What to actually mock

Only mock the boundaries of your system. In most cases, this is going to be 
mocking `$http` calls, or in the case of hybrid mobile apps, you will want to
mock out Cordova/Crosswalk plugins and the like.

Use `$httpBackend` to mock out network requests.




#### Why mocking is especially dangerous in JavaScript

One major reason: Lack of a type system. A service method can completely change 
its signature (params/return value), but if your calling code assumes the old 
signature, and your tests have mocked out the service to assume the old 
signature, then **your tests will pass without ever letting you know that it is 
broken**.

Using a JavaScript transpiler like TypeScript can really help you out in this 
situation, but it's still not 100%. The assumptions that your client code made
about the service may have changed, and unless you mocked these out correctly
all over your app, the functionality may break. Best to just not mock them, and
only mock out `$http` (and other system boundary) response data instead.
