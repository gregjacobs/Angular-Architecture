---
title: "Architecture: Services"
layout: page-with-nav
permalink: /architecture/services/
comments: true
---

Should simply access data, and be stateless (with the exception of caching). 
With few exceptions, no singleton service should really ever have a 
“setter”.

Most services are used to pull data from a remote server (which will be the
topic of this article), but services may be used for many other things as 
well (logging, etc.)

- _Why put data access in a service rather than on a page?:_ We want to be 
  able to retrieve remote/stored data from a single place that can be 
  called from multiple pages. Also, if our data source changes, then we
  only need to make that change in one place.
  
- _Why not simply put $http calls on my pages?:_ We will be doing 
  post-processing and translation of raw HTTP response data, and this will 
  not be the responsibility of our page controllers. We want to keep our 
  page controllers as light as possible.

One thing services should generally **not** do however is modify the DOM. 
(One notable exception though is to display an application-level alert 
modal, for instance.)

#### Service Diagram (from [High Level Overview]({{ site.baseurl }}/architecture/high-level-overview/))

{% include diagrams/service.md %}

All data retrieval from a data source (a remote server, local storage, etc.) 
should be encapsulated in a service. This allows multiple pages to access your
service.

Services also allow for a data abstraction layer, where you will convert raw
HTTP responses into known objects that the app can consume. More on that later.

#### Example Service, HeroesService

Generally, use the [factory](https://docs.angularjs.org/guide/providers#factory-recipe)
recipe to create singleton services.

{% include heroes-service.md %}

* _Why `loadHeroes()` instead of `getHeroes()`?_: "get" would make the method 
  sound like it's going to return a usable value rather than an async promise, 
  whereas "load" notifies developers to the asynchronous nature.
  
* _Why the `factory` recipe?_: It allows you to expose the public methods, and 
  keep all methods as simple function declarations so that you can call them 
  from other public methods without worrying about the `this` reference.

* _Why `HeroesReader`?_: See next section.


#### HeroesReader

We don't want to simply return raw HTTP responses to be consumed by our app.
This would tightly couple our pages and components to exactly what the server
provides (which may change over time). Instead, we want to abstract away the
server and represent our data with model classes.

{% include whys-of-models-and-collections.md %}
  
`HeroesReader` has the responsibility of converting raw HTTP responses into 
your data models.

Example HeroesReader:

{% include heroes-reader.md %}


* _Why do this?_: A Reader gives you the perfect place to parse server
  responses into consumable objects. For example, the `lastBattle` above is
  converted into a [Moment.js](http://momentjs.com) object for the app to
  consume and format as each view desires.
  
* _Why not put this into the Service itself?_: Object instantiation is a 
  responsibility all on its own (See the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
  of software design), and therefore we should have only one place to 
  change if the server-side data changes.
  
* _Why not put this into the Service itself (2)?_: If your service starts to 
  garner more data retrieval methods, and also needs parsing logic/methods to 
  convert those responses into reasonable client-side models, then your 
  service starts to become difficult to read and understand.
  
* _Why not put this into the Service itself (3)?_: When you start writing tests 
  for your components, and want to use test/example data that is in the form of 
  server responses to populate your components, you can use your Reader class to 
  generate the models from the data to pass into your view components.


#### Hero Model

{% include hero-model-intro.md %}

{% include hero-model.md %}

See the next article ([Models and Collections]({{ site.baseurl }}/architecture/models-and-collections)) 
for more details.

For how to test, see [Testing Services]({{ site.baseurl }}/testing/services).


Next Article: [Models and Collections]({{ site.baseurl }}/architecture/models-and-collections/)