---
title: HTML Templates
layout: page-with-nav
permalink: /architecture/html-templates/
---

HTML Templates should never be longer than 100 lines. Some of our templates are
packed with so many details of what could be self-contained child components
that they become unreadable.


#### What to do:

Use sub-templates or directives (preferred) to manage the length, and move the
details about how each component’s sub-elements are built into named
abstractions.

Offload logic that can be moved from a large monolithic controller into
sub-controllers or the directives’ link() functions as well, where appropriate.