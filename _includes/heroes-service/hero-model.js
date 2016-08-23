angular.module( 'heroes' ).factory( 'Hero', function( moment ) {
    'use strict';
    
    /**
     * @class Hero
     *
     * Represents a Hero in the app.
     * 
     * @constructor
     * @param {Object} props An Object containing the Hero's properties:
     * @param {Number} props.id The hero's ID.
     * @param {String} props.name The hero's name.
     * @param {Moment} props.lastBattle The date/time of the hero's last
     *   battle.
     */
    var Hero = function( props ) {
        this.id = props.id;
        this.name = props.name;
        this.lastBattle = props.lastBattle;
    };
    
    
    /**
     * Determines if the Hero has battled recently.
     * 
     * @return {Boolean}
     */
    Hero.prototype.hasBattledRecently = function() {
        var threeMonthsAgo = moment().subtract( 3, 'months' );
        
        return this.lastBattle.isAfter( threeMonthsAgo );
    };
    
    
    return Hero;
    
} );