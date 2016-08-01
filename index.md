---
title: Home
layout: page-with-nav
comments: true
---

The guides on this site explain the architecture of what has proved to
be a robust, maintainable, and ultimately successful large-scale AngularJS web 
application.

The goals of this architecture (as with any good architecture) are to:

1. _Increase the speed of the development cycle and each iteration_
2. _Prevent bugs/regressions while adding new features_
3. _Be able to reuse as many things as possible and remove duplication_
4. _Be able to write robust tests that truly catch any errors/problems that might
   arise_

The design employs a clear, layered architecture to allow for reuse of services, 
components, and data models, and allow a team of developers to add features by 
reusing any existing infrastructure and components when needed.

Hop right in: [High Level Overview]({{ site.baseurl }}/architecture/high-level-overview)

<br>
<strong>Note:</strong> This guide is in the process of being updated with all 
examples to match the Angular 2.x [Tour of Heroes](https://angular.io/docs/ts/latest/tutorial/) 
tutorial, which will hopefully assist in drawing parallels between the two 
versions of Angular. Even though the guides on this site are based on Angular 
1.x, essentially all of the same high-level concepts are now taught for Angular 
2.x in the [Angular 2.x Developer Guide](https://angular.io/docs/ts/latest/guide/).