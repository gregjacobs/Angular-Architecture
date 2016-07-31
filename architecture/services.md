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

```javascript
angular.module( 'heroes' ).factory( 'HeroesService', function( $http, HeroesReader ) {
    'use strict';
    
    // Public API
    return {
        loadHeroes : loadHeroes,
        loadHero   : loadHero,
        saveHero   : saveHero
    };
    
    
    /**
     * Loads the list of heroes.
     * 
     * @return {Promise} A promise which is resolved with an array of 
     *   {@link Hero} objects, or is rejected if an error occurs.
     */
    function loadHeroes() {
        return $http( { url: '/path/to/heroes' } ).then(
            function onSuccess( response ) {
               return HeroesReader.readHeroes( response.data );
            }
        );
    }
    
    
    /**
     * Loads a Hero by ID.
     *
     * @param {Number} heroId The ID of the hero to load.
     * @return {Promise} A promise which is resolved with a {@link Hero} object
     *   if found, or `null` if not. The promise is rejected if an error occurs.
     */
    function loadHero( heroId ) {
        return $http( { url: '/path/to/hero/' + heroId } ).then( 
            function onSuccess( response ) {
                return HeroesReader.readHero( response.data );
            }
        } );
    }
    
    
    /**
     * Saves a Hero to the server.
     *
     * @param {Hero} hero The Hero to save.
     * @return {Promise} A promise which is resolved with an updated {@link Hero}
     *   when the operation is complete, or is rejected if an error occurs.
     */
    function saveHero( hero ) {
        var data = HeroWriter.write( hero );
        
        return $http( { 
            url: '/path/to/hero' + ( !hero.id ? '' : '/' + hero.id ),
            method: !hero.id ? 'POST' : 'PUT'
        } ).then( function( response ) {
            return HeroesReader.readHero( response.data );
        } );
    }
    
} );
```

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

* _Why?_: Using a class to represent a data model allows that data model to be
  easily documented across your system where that data model is passed to.

* _Why?_: A model's class definition immediately tells all developers exactly 
  which properties are going to be available. With good documentation (and/or
  [TypeScript](https://www.typescriptlang.org)), they also tell developers which
  data types the properties hold.
  
* _Why?_: Data models as classes allows you to add functionality to those 
  models in the form of accessor/query methods, which can provide more 
  information or combination logic than the properties themselves can.
  
`HeroesReader` has the responsibility of converting raw HTTP responses into 
your data models.

Example HeroesReader:

```js
angular.module( 'heroes' ).factory( 'HeroesReader', function() {
    'use strict';
    
    // Public API
    return {
        readHeroes : readHeroes,
        readHero   : readHero
    };
    
    
    /**
     * Reads the server response data for heroes.
     *
     * Example server response data:
     * 
     *     [
     *          { id: 11, name: 'Mr. Nice', lastBattle: '2016-05-22T14:22:01' },
     *          { id: 12, name: 'Narco',    lastBattle: '2016-02-01T08:52:27' },
     *          { id: 13, name: 'Bombasto', lastBattle: '2016-04-10T18:00:52' }
     *     ]
     *
     * @param {Object[]} heroObjs The array of 'hero' objects from the server.
     * @return {Heroes[]}
     */
    function read( heroObjs ) {
        return _.map( heroObjs, readHero );
    }
    
    
    /**
     * Reads the server response data for a single Hero.
     * 
     * Example server response data:
     *
     *     { id: 11, name: 'Mr. Nice', lastBattle: '2016-05-22T14:22:01' }
     *
     * @param {Object} heroObj The 'hero' object from the server.
     * @return {Hero} A Hero instance.
     */
    function readHero( heroObj ) {
        return new Hero( { 
            id         : heroObj.id,
            name       : heroObj.name,
            lastBattle : moment( heroObj.lastBattle )
        } );
    }
    
} );
```


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


#### Hero class

Here's an example of a "class" in ES5, but if you're able, use ES6 classes and
[Babel](https://babeljs.io) to transpile them into ES5. Or even better, use
[TypeScript](https://www.typescriptlang.org).

```js
angular.module( 'heroes' ).factory( 'Hero', function() {
    'use strict';
    
    /**
     * @class Hero
     *
     * Represents a Hero in the app.
     * 
     * @constructor
     * @param {Object} props
     * @param {Number} props.id
     * @param {String} props.name
     * @param {Moment} props.lastBattle
     */
    var Hero = function( props ) {
        this.id = props.id;
        this.name = props.name;
        this.lastBattle = props.lastBattle;
    };
    
    /**
     * @return {Boolean}
     */
    Hero.prototype.hasBattledInLast3Months = function() {
        return this.lastBattle.isAfter( moment().subtract( 3, 'months' ) );
    }
    
    return Hero;
    
} );
```

See [Models and Collections]({{ site.baseurl }}/architecture/domain-objects) 
for more details.

For how to test, see [Testing Services]({{ site.baseurl }}/testing/services).

<b>(Work-in-progress)</b><br>
TODO: Additional points to cover:

1. To handle things like loading pages of data, a separate, instantiable
   class should be used, which can maintain this state (page number, data for
   a particular data page, etc). This object should be able to be
   instantiated when needed, used, and then thrown away when no longer needed
   (i.e. user navigates to a different page), so that no state is
   accidentally transferred between pages.

2. For utility methods, these should be abstracted into different classes/modules.

    1. Methods that deal with queries on the data most often belong on 
       [Domain Object Classes]({{ site.baseurl }}/architecture/domain-objects) Domain Object classes 
       (which would represent, for example, a single User, Account, CalendarEvent, 
       etc.)<br><br>
       For instance, instead of something like `XyzService.isUserEnabled(user)`, 
       should instead be: `user.isEnabled()`<br><br>
