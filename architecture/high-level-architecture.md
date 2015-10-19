---
title: High Level Overview
layout: page-with-nav
permalink: /architecture/high-level-architecture/
---

In general, the structure of an app's architecture should be fairly simple:

    Router
    Components/Pages
        HTML Templates  --->  One-to-one correlation
        Controllers     -/
    Service Layer
        Services
        Domain Objects
        

## Router

The router is going to direct your users to the initial page of your app, and
then is going to navigate to the other pages of your app.


## Pages/Components

[Pages](/architecture/pages/) and [components](/architecture/components/) are 
going to make up the visual portion of your app. A page displays information to 
your users, and is usually composed of one or more view components. A component 
is simply a view, representing a piece of your page (for example, a list, an 
information box, etc.)

Both pages and components are composed of an HTML template, a directive 
definition, and a controller. Only one HTML template should relate to one 
controller.


## Service Layer 

The service layer is for accessing data and for your application's controllers,
which will then feed it to your view components. It: 

1. Accesses data (from network requests, local storage, etc.), and returns 
   [domain objects](/architecture/domain-objects/) (models and collections) to 
   represent it.
2. Provides a library of utility functionality for working with, transforming, 
   or otherwise processing your data and functionality.
3. Calling mobile device plugins (Phonegap/Cordova/Crosswalk)
