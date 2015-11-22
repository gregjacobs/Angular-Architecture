---
title: "Architecture: Best Practices"
layout: page-with-nav
permalink: /architecture/best-practices/
comments: true
---

## HTML Templates

HTML Templates should generally never be longer than 100 lines. Many templates 
I have come across are generally packed with so many details of what could be 
self-contained [child components](/architecture/components/) that they become 
unreadable.

Use [components](/architecture/components/) to manage the length, breaking the 
page down, and moving the details about how each component’s sub-elements are 
built into the components themselves.

Offload logic that can be moved from a large monolithic controller into
components’ controllers as appropriate.


## Controllers

These should be fairly light. The responsibility of the Controller is simply to
bring in data from the model (service) layer, and put it into public properties
(recommended) or the `$scope` for the view to consume.

This process may optionally include some source data transformations, but
only those that specifically format the data for the particular view at hand.
Most other processing/logic should be in the service layer.

If you're finding that your controller code is getting long, and you have 
already:
 
1. moved as much code as possible into reusable service-layer classes/modules,
   and
2. broken down the page as much as possible into sub-components

then try creating self-contained "controller helper" classes to manage some of
the additional complexity. An example could be an `XyzFormValidator` class which 
encapsulates the logic for the "Xyz" form, and returns a validation result 
object. 


## Don't add `$http` interceptors

Don't add `$http` interceptors unless you _really want to add something that
will affect **all** network requests_. Once you have these, and then find a
situation in the future that doesn't fit the interceptors, you either:

1. Must attempt to refactor your entire system to remove the interceptors while 
   not breaking all current calls (risky) to make way for the new network 
   request, or
2. Start adding workarounds where your `$http` interceptors now only apply to a
   subset of the network requests that your app makes, usually filtered on URL
   for request interceptors, and response data for response interceptors.
   
Both cases get messy, the latter of which will see the size of your `$http`
interceptors file grow to a mess of `if` statements and conditions that become
a nightmare to work with. Just don't do it. 

If you need to implement functionality such as, for example, adding an auth
token or unwrapping a standard response JSON package that is returned from your 
server's endpoints, do so in a service instead. Have a service that makes the 
network request on behalf of the client code, unwraps the json response, and 
returns a specialized object with the wrapper's information. This will save you 
the insane headache in the near future when you need to hit another server with
CORS, and none of those previous `$http` interceptor things apply to that new 
server.

The only case I see for `$http` interceptors is to implement network request 
logging, and even that could be in your generalized services.

To give a quick example of what I mean here, we may want a service that when
hitting 'auth' URLs, we always provide a token:

```
angular.module( 'myApp' ).factory( 'AuthHttp', 
         [ 'UuidGenerator', 
function (  UuidGenerator ) {
    'use strict';
    
    // Public API
    return {
        request : request
    };
    
    
    function request( options ) {
        options.params = options.params || {};
        options.params.token = UuidGenerator.generate();
        
        return $http( options );
    }
    
} );
```



## Don't implement magical view-changing behavior in the service or http layer

On a project I worked on, the original developers had set up a spider web of 
code in `$http` interceptors to attempt to parse a response JSON structure, look 
for certain conditions, and if found, would actually hijack the view of the app 
to navigate it elsewhere automatically, without the input of a controller. First 
of all, the network layer should never talk directly to the view. But second, 
this caused all kinds of problems, usually unexpected ones.

Those developers felt the pain of their own design. They had to write `if` 
statement after `if` statement trying to get certain scenarios to be correct,
while maintaining state of "if the user came from page A, then navigated to
page B, and *then* got a message in an http response, do this; else do that."

Moral of the story: don't violate the layers of your app. A controller should 
always be in control, which gives you the most flexibility for dealing with any
scenario, especially because the controller knows what state the page is already
in.