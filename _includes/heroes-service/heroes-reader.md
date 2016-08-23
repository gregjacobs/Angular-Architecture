```js
angular.module( 'heroes' ).factory( 'HeroesReader', function( Hero ) {
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
     *          { id: 11, name: 'Mr. Nice', lastBattle: '2016-04-22T14:22:01' },
     *          { id: 12, name: 'Narco',    lastBattle: '2016-02-01T08:52:27' },
     *          { id: 13, name: 'Bombasto', lastBattle: '2016-05-10T18:00:52' }
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
     *     { id: 11, name: 'Mr. Nice', lastBattle: '2016-04-22T14:22:01' }
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