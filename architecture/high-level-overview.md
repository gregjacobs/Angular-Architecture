---
title: "Architecture: High Level Overview"
layout: page-with-nav
permalink: /architecture/high-level-overview/
comments: true
---

In general, the structure of an app's architecture should be fairly simple:

## 1. [Router]({{ site.baseurl }}/architecture/router/)

The router is going to direct your users to the initial page of your app, and
then is going to navigate to the other pages of your app.

{% include diagrams/router.md %}


## 2. [Pages]({{ site.baseurl }}/architecture/pages/)/[Components]({{ site.baseurl }}/architecture/components/)

<li>Make up the visual portion of your app. A page displays information to your 
users, and is composed of html and usually one or more child view components.</li> 

<li>A view component is simply a piece of html+js, representing a piece of real 
estate on your page (for example, a data list, an information box, etc.)</li>

<li>A page facilitates all data retrieval, and then distributes the data to the 
components.</li>

{% include diagrams/page-and-components.md %}


## 3. [Services]({{ site.baseurl }}/architecture/services/)

Services are to allow your pages to access data (from network requests, local 
storage, etc.), and returns [Models and Collections]({{ site.baseurl }}/architecture/models-and-collections/) 
which are passed to your view components. 

{% include diagrams/service.md %}