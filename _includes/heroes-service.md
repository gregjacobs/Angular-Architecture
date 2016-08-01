```javascript
angular.module( 'heroes' ).factory( 'HeroesService', function( $http, HeroesReader, HeroesWriter ) {
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
     *   when successful, or is rejected if an error occurs.
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
            url    : '/path/to/hero' + ( !hero.id ? '' : '/' + hero.id ),
            method : !hero.id ? 'POST' : 'PUT',
            data   : HeroesWriter.writeHero( hero )
        } ).then( function( response ) {
            return HeroesReader.readHero( response.data );
        } );
    }
    
} );
```