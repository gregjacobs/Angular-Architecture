---
title: "Testing: Pages"
layout: page-with-nav
permalink: /testing/pages/
comments: true
---

TODO

Points to cover:

- Don't mock services in tests (i.e. don't create a deferred object, return it, 
  and manually resolve it). Only mock the actual boundaries of your system, i.e.,
  the http call (using $httpBackend)