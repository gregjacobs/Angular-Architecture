angular.module( 'heroes' ).factory( 'MyHeroesListTestWrapper', [ function() {
	'use strict';

	/**
	 * @class MyHeroesListTestWrapper
	 *
	 * @constructor
	 * @param {HTMLElement/jqLite} $el
	 */
	var MyHeroesListTestWrapper = function( $el ) {
		this.$el = angular.element( $el );
	};

	MyHeroesListTestWrapper.prototype = {
		constructor : MyHeroesListTestWrapper,  // fix constructor property

		// Methods to Retrieve DOM elements (usually treat as private/protected)
		getHeroesEls : function() {
			return this.$el[ 0 ].querySelectorAll( '.heroes-list__hero' );
		},

		/**
		 * @return {HeroTestWrapper[]}
		 */
		getHeroTestWrappers : function() {
			return this.getHeroesEls().map( function( heroEl ) {
				return new HeroTestWrapper( heroEl );
			} );
		},

		// Common Expectations

		/**
		 * @param {Hero[]} heroes
		 */
		expectHeroes : function( heroes ) {
			var heroTestWrappers = this.getHeroTestWrappers();

			expect( heroes.length ).toBe( heroTestWrappers.length );

			heroes.forEach( function( hero, i ) {
				heroTestWrappers[ i ].expectHero( hero );
			} );
		},

		// Convenient Combination Method
		expectState : function( header, text, retryBtnLabel ) {
			this.expectHeader( header );
			this.expectText( text );
			this.expectRetryBtnLabel( retryBtnLabel );
		},


		// User Interaction Simulation Methods

		clickHero : function( hero ) {
			this.getHeroById( hero.id ).click();
		}

	};


	/**
	 * @private
	 * @class HeroTestWrapper
	 *
	 * @constructor
	 * @param {HTMLElement/jqLite} $el
	 */
	var HeroTestWrapper = function( $el ) {
		this.$el = angular.element( $el );
	};

	HeroTestWrapper.prototype = {
		constructor : HeroTestWrapper,  // fix constructor property

		getIdEl : function() {
			return this.$el[ 0 ].querySelector( '.heroes-list__id' );
		},

		getNameEl : function() {
			return this.$el[ 0 ].querySelector( '.heroes-list__name' );
		},

		getId : function() { return this.getIdEl().innerText; },
		getName : function() { return this.getNameEl().innerText; },

		expectHero : function( hero ) {
			this.expectId( hero.id );
			this.expectName( hero.name );
		},

		expectId : function( expectedId ) {
			expect( this.getId() ).toBe( expectedId );
		},

		expectName : function( expectedName ) {
			expect( this.getName() ).toBe( expectedName );
		},

		click : function() {
			this.$el.triggerHandler( 'click' );
		}
	};


	return MyHeroesListTestWrapper;

} ] );
