---
title: "Architecture: Domain Objects"
layout: page-with-nav
permalink: /architecture/domain-objects/
comments: true
---

<b>(Work-in-progress)</b><br>

You should use known domain objects for passing data around the system. Have
classes that represent each of the system’s entities:

- User
- Role
- Account
- CalendarEvent
- Message
- Todo
- etc.


Having domain objects provides us a place for abstracting the data, in the form
of accessor methods. For example, in `User.js`:

    /**
     * Determines if the user is an administrator.
     *
     * @return {Boolean}
     */
    isAdmin : function() {
        return this.roleId === Roles.ADMIN;
    }


Instead of duplicating this logic in controllers or somewhere else, it is now
always available when you have a `User` instance.

Domain object classes also make every developer aware of what data is available
in a given class, simply by opening up its source file. We also immediately know
how to work with those domain objects when we see a common set of methods for
operating on the domain object’s data (ex: `isAdmin()` method, above).


TODO Points:

- Create domain objects: Models and Collections. Backbone.js has this right. 
  Example: a `UserCollection` might have methods for client-side filtering
  based on first/last names, or other properties. 