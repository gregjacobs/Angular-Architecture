---
title: "Architecture: Use a Loader Class for Paging"
layout: page-with-nav
permalink: /architecture/use-a-loader-class-for-paging/
comments: true
---

To handle things like loading pages of data, a separate, instantiable
class should be used, which can maintain this state (page number, data for
a particular data page, etc). This object should be able to be
instantiated when needed, used, and then thrown away when no longer needed
(i.e. user navigates to a different page), so that no state is
accidentally transferred between pages.

TODO: Add Example