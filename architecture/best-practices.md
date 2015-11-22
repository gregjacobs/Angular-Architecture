---
title: "Architecture: Best Practices"
layout: page-with-nav
permalink: /architecture/best-practices/
comments: true
---

## HTML Templates

HTML Templates should never be longer than 100 lines. Some of our templates are
packed with so many details of what could be self-contained child components
that they become unreadable.


#### What to do:

Use directives to manage the length, breaking the page down, and moving the 
details about how each component’s sub-elements are built into named
abstractions.

Offload logic that can be moved from a large monolithic controller into
directives’ controllers as appropriate.


## Controllers

These should be fairly light. The responsibility of the Controller is simply to
bring in data from the model (service) layer, and put it into the $scope for the
view to consume.

This process may optionally include some source data transformations, but
only those that specifically format the data for the particular view at hand.

Currently, some of our controllers are thousands of lines of code, and mix
many responsibilities, including:

- large amounts of state (which includes some very deeply nested objects)
- form validation
- handling the details of service errors and return statuses in large
  switch/case blocks
- different conditionals scattered around the code to manage iPhone and iPad
  differently
- DOM manipulation and DOM event handling
- etc.

#### What to do:

a. For pages that accept user input and handle validation and such, the
   controller should push that logic to different individual classes /
   implementations.

   For instance, a FormValidator class could be used to make sure the state of
   the form for a given page is correct.

b. Logic that controls possibly only a small part of the page can be broken
down into a separate child controller, or possibly a directive, depending on the
implementation.

c. Any individual DOM handling / DOM event handling code should be moved into
separate directives for the elements that they control.

d. For the separation of iPhone/iPad implementations (really Phone/Tablet), we
   should have a base class controller that holds common logic for both
   implementations, and then Phone and Tablet subclasses that implement the
   specifics of those implementations.

   This removes the DeviceDetection `if` statements which are scattered across
   the codebase. These often need to be added and maintained in pairs too. For
   example: we could need DeviceDetection to show some particular elements, and
   would subsequently need DeviceDetection to hide them.


## Don't add `$http` interceptors

Don't add `$http` interceptors unless you _really want to add something that
will affect **all** network requests_. Once you have these, and then find a
situation in the future that doesn't fit the interceptors, you either:

a. Attempt to refactor your entire system to remove the interceptors while not
   breaking all current calls (risky) to make way for the new network request,
   or
b. Start adding workarounds where your `$http` interceptors now only apply to a
   subset of the network requests that your app makes, usually filtered on URL
   for request interceptors, and response data for response interceptors.
   
Both cases get messy, the latter of which will see the size of your `$http`
interceptors file grow to a mess of `if` statements and conditionals that become
a nightmare to work with. Just don't do it. 

If you need to implement functionality such as, for example, adding an auth
token or unwrapping a standard response JSON package that is returned from your 
server's endpoints, do so in a service instead. Have a service that makes the 
network request on behalf of the client code, unwraps the json response, and 
returns a specialized object with the wrapper's information. This will save you 
the insane headache in the near future when you need to hit another server with
CORS, and none of those things apply to that new server.

The only case I see for `$http` interceptors is to implement network request 
logging.    



## Don't implement magical view-changing behavior in the service or http layer

On a project I worked on, the original developers had set up a web of code in 
`$http` interceptors to attempt to parse a response JSON structure, look for 
certain things, and if found, would actually hijack the view of the app to
navigate it elsewhere automatically without the input of a controller. First of
all, the network layer should never talk directly to the view. But second, this
caused all kinds of problems.

Those developers felt the pain of their own design. They had to write `if` 
statement after `if` statement trying to get certain scenarios to be correct,
while maintaining state of "if the user came from page A, then navigated to
page B, and *then* got a message in an http response, do this. else do that."

Moral of the story: don't violate the layers of your app. A controller should 
always be in control, which gives you the most flexibility for dealing with any
scenario, especially because the controller knows what state the page is already
in.