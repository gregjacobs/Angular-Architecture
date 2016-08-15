---
title: "Architecture Best Practices: Don't Use `ng-controller`"
layout: page-with-nav
permalink: /architecture/dont-use-ng-controller/
comments: true
---

Create child [components]({{ site.baseurl }}/architecture/components) 
("element directives" in Angular 1.4 and below) instead.

This has the following advantages:

1. You won't need difficult-to-follow `$scope` events (`$broadcast` and 
   `$emit`) to communicate between controllers. You can use isolate 
   scopes and `on-event-happened` attributes on your components instead. 
2. You will never have the problem of a child controller accidentally
   inheriting or shadowing a `$scope` property from the parent 
   controller.

See this article for details: [http://teropa.info/blog/2014/10/24/how-ive-improved-my-angular-apps-by-banning-ng-controller.html](http://teropa.info/blog/2014/10/24/how-ive-improved-my-angular-apps-by-banning-ng-controller.html)

### Don't use ng-include either

While we're on the point of not using `ng-controller`, don't use 
`ng-include` either. 

Create new [child components]({{ site.baseurl }}/architecture/components/) 
instead in order to keep a one-to-one relationship between each 
component file and its associated view template. 

Note that it's perfectly fine to have a component definition with no 
controller, where the component definition is simply responsible for 
creating the isolate scope used to pass data into the HTML template.
