---
title: "Architecture: Services"
layout: page-with-nav
permalink: /architecture/services/
comments: true
---


Should simply access data, and be stateless (with the exception of caching). No
singleton service should ever really have a “setter”.

<b>(Work-in-progress)</b><br>
TODO: Points to cover:
 
1. Create an actual data access layer (DAL), which is comprised of classes 
   (singletons) suffixed with the word ‘Service’ for loading your data.<br><br>
   Data loading methods should be named `loadXyz()`, to show that they are 
   asynchronous and return a promise (as opposed to `getXyz()`).

2. To handle things like loading pages of data, a separate, instantiable
   class should be used, which can maintain this state (page number, data for
   a particular data page, etc). This object should be able to be
   instantiated when needed, used, and then thrown away when no longer needed
   (i.e. user navigates to a different page), so that no state is
   accidentally transferred between pages.

3. For utility methods, these should be abstracted into different classes/modules.

    1. Methods that deal with queries on the data most often belong on 
       [Domain Object Classes](/architecture/domain-objects) Domain Object classes 
       (which would represent, for example, a single User, Account, CalendarEvent, 
       etc.)<br><br>
       For instance, instead of something like `XyzService.isUserEnabled(user)`, 
       should instead be: `user.isEnabled()`<br><br>

4. Create domain objects: Models and Collections. Backbone.js has this right. 
   Example: a `UserCollection` might have methods for client-side filtering
   based on first/last names, or other properties. 