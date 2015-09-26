---
title: Directives
layout: page-with-nav
permalink: /architecture/controllers/
---


Reusable view components should be encapsulated into directives.  These
directives should only have data be passed in, and call handler functions when
something happens within them (i.e. limit them to input/events). They should
never directly access data from the model/service layer, or have side effects
(which would make them un-reusable).

For example:

    <ms-recent-quote-item
        quote=”myQuoteObject”         // pass in data
        on-remove=”handleRemove()”>   // handle an event
    </ms-recent-quote-item>


In general, use directives, and isolate scopes to give your directives their own
private set of scope properties. This will make it so they do not affect the
properties of outside scopes, except for those explicitly set up for two-way
binding.

Also, keep directives self-contained, never knowing about the outside world.
They should simply handle one piece of the DOM, and notify any listeners of
anything of interest that may have happened (i.e. user clicked on something,
user selected of something, user removed of something, etc.) via event handler
attributes. This makes them highly maintainable, reusable, and testable.