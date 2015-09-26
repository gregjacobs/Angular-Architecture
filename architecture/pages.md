---
title: Pages
layout: page-with-nav
permalink: /architecture/pages/
---

Much like components, create pages of your app as just "bigger components." Drop
the notion of views and controllers being separate.

This has the following advantages:

1. It creates a self-contained component that can be easily instantiated for
   tests.
2. It creates a reusable component that if you wanted to for some reason, could
   easily put this page into a modal window (for example).


