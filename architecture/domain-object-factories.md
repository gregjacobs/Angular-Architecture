---
title: Factories to Create Domain Objects
layout: page-with-nav
permalink: /architecture/domain-object-factories/
---

Use a factory (and when I say 'factory', I mean an actual factory class/object - 
not the Angular "factory" recipe) to generate your local domain objects from 
server data.

This allows for a translation point where you can translate the data that comes
from your server into objects that make sense for your application.

You can also use factories to reference other already-built objects that may
relate to the data you are pulling in. For instance, let's say that you already
have a list of a user's accounts, and you are now loading a list of user 
transactions for those accounts. 

Account data:

{% highlight javascript %}
{
    id: 1,
    name: "Account 1"
}
{% endhighlight %}


Transaction data:

{% highlight javascript %}
{
    id: 4231,
    date: '9/22/2015',
    accountId: 1
}
{% endhighlight %}


You may want to create your `Transaction` object that actually references the
account with ID `1`, rather than only storing the `accountId`.

The final object would look like this:

{% highlight javascript %}
Transaction( {
    id: 4231,
    date: '9/22/2015',
    account: Account( {   // reference to the Account in memory
        id: 1, 
        name: "Account 1"
    } )
} )
{% endhighlight %}


TODO: Example factory