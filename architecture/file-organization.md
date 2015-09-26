---
title: File Organization
layout: page-with-nav
permalink: /architecture/file-organization/
---

Seemingly subtle, but it is very powerful to group together files by
functionality, rather than “type of thingy” (which we currently have now with
the big controllers/directives/services/views directories).

Grouping by function makes it incredibly easy to spot a file’s related
dependencies and collaborators, because they all exist in the same directory.
The paradigm shifts us from having to attempt to search for / track down all of
the collaborators in the multiple directories, to immediately knowing the scope
of what’s involved in any given change.

Good articles on the subject:

- http://www.pseudobry.com/building-large-apps-with-angular-js/#fileorganization
- https://medium.com/opinionated-angularjs/scalable-code-organization-in-angularjs-9f01b594bf06