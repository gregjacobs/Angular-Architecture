---
title: Controllers
layout: page-with-nav
permalink: /architecture/controllers/
---

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