---
title: High Level Overview
layout: page-with-nav
permalink: /architecture/high-level-architecture/
---

In general, the structure of an app's architecture should be fairly simple:

    Service Layer
        Services
        Domain Objects
    Components/Pages
        HTML Templates  -->  One-to-one correlation
        Controllers    / 
    

## Service Layer

The service layer is for:

1. Accessing data (network requests, local storage, etc.), and returning domain
   objects.
2. Library of utility functionality.
3. Calling mobile device plugins (Phonegap/Cordova/Crosswalk)


## Components/Pages

Components and pages are going to make up the visual portion of your app. A
component is simply a view component, where a page is usually just a 
bigger/composite view component.

A component is composed of an HTML template, a directive definition, and a 
controller.


## Directory Structure

See [File Organization](/architecture/file-organization/) 