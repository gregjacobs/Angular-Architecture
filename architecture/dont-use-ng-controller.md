---
title: "Architecture Best Practices: Don't Use `ng-controller`"
layout: page-with-nav
permalink: /architecture/dont-use-ng-controller/
comments: true
---

Use child components (directives) instead.

- Don't need `$scope` events to communicate. Can use isolate scopes and `on-xyz`
  attributes instead.



While we're on that point, don't use ng-include either.