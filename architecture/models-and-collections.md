---
title: "Architecture: Models and Collections"
layout: page-with-nav
permalink: /architecture/models-and-collections/
comments: true
---

As described in [Services]({{ site.baseurl }}/architecture/services), you should
use model and collection classes to represent the data in your system rather
than providing raw HTTP responses to your pages/components.

{% include whys-of-models-and-collections.md %}

You'll want to at least represent each data object as a Model class for the
above reasons. Optionally, on top of that, you may want to provide Collection 
classes to add functionality on the "array of models" level. More on that later. 


#### Hero Model

{% include hero-model-intro.md %}

{% include hero-model.md %}

And its usage once you have an instance:

{% include hero-model-usage.md %}


#### HeroesCollection

You may decide that it is not always necessary to return a collection class from 
your [services]({{ site.baseurl }}/architecture/services), but it can be a 
powerful technique for encapsulating query methods that operate on an array of 
your data models.

Here is an example to demonstrate the technique:

{% include heroes-collection.md %}

And its usage once you have an instance:

{% include heroes-collection-usage.md %}

#### Additional Points

* The methods that should exist on model/collection classes are usually 
  implemented by developers on the controller level. This often results in 
  duplicate logic between different controllers that operate on the same data 
  models. Be aware of this and consider moving these methods to the appropriate 
  model/collection classes. 
  
* Because model/collection classes provide a common set of methods for 
  operating on the object’s data (ex: `hasBattledRecently()` method, above),
  developers can easily find common operations they may need to leverage, 
  without duplicating code.

 
Next Article: [Components]({{ site.baseurl }}/architecture/components/)