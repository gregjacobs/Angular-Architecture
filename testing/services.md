---
title: "Testing: Services"
layout: page-with-nav
permalink: /testing/services/
comments: true
---

<b>(Work in progress)</b><br>

TODO: Points for testing dependent services (i.e. from controllers):

- Don't mock services in tests (i.e. don't create a deferred object, return it, 
  and manually resolve it). Only mock the actual boundaries of your system, i.e.,
  the http call (using $httpBackend)