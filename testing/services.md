---
title: Testing Services
layout: page-with-nav
permalink: /testing/services/
---


Points for testing *with* services (i.e. from controllers):

- Don't mock services in tests (i.e. don't create a deferred object, return it, 
  and manually resolve it). Only mock the actual boundaries of your system, i.e.,
  the http call (using $httpBackend)