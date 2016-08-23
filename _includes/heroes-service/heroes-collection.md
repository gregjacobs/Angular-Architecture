```js
angular.module( 'heroes' ).factory( 'HeroesCollection', function() {
    'use strict';
    
    /**
     * @class HeroesCollection
     *
     * Collection to hold {@link Hero}s, and provide query methods.
     * 
     * @constructor
     * @param {Hero[]} heroes The Heroes to populate the collection with.
     */
    var HeroesCollection = function( heroes ) {
        this.heroes = heroes;
    };
    
    
    /**
     * Retrieves all of the {@link Hero Heroes} in the collection.
     *
     * @return {Hero[]}
     */
    HeroesCollection.prototype.getHeroes = function() {
        return this.heroes;
    }
    
    
    /**
     * Retrieves the {@link Hero Heroes} that have battled recently.
     *
     * @return {Hero[]}
     */
    HeroesCollection.prototype.getRecentBattlers = function() {
        return _.filter( this.heroes, function( hero ) { 
            return hero.hasBattledRecently(); 
        } );
    }
    
    
    /**
     * Returns Heroes in the collection whose names match the given `searchStr`.
     *
     * @param {String} searchStr
     * @return {Hero[]}
     */
    HeroesCollection.prototype.queryByName( searchStr ) {
        searchStr = searchStr.replace( /[^A-Za-z0-9 ]/, '' );  // sanitize regex input
        
        var regex = new RegExp( searchStr, 'i' );
        
        return _.filter( this.heroes, function( hero ) {
            return regex.test( hero.name );
        } );
    }
    
    
    return HeroesCollection;
    
} );
```