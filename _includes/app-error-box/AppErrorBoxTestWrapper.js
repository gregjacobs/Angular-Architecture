angular.module( 'heroes' ).factory( 'AppErrorBoxTestWrapper', [ function() {
	'use strict';

	var AppErrorBoxTestWrapper = function( $el ) {
		this.$el = $el;
	};

	AppErrorBoxTestWrapper.prototype = {

		// May want to put this method into either a service or base class
		// (or inherited prototype object if going that route)
		findElem : function( selector ) {
			return angular.element( this.$el[ 0 ].querySelectorAll( selector ) );
		},

		// Methods to Retrieve DOM elements (usually treat as private/protected)
		getHeaderEl   : function() { return this.findElem( '.app-error-box__header' ); },
		getTextEl     : function() { return this.findElem( '.app-error-box__text' ); },
		getRetryBtnEl : function() { return this.findElem( '.app-error-box__retryBtn' ); },

		// Methods to retrieve the inner text of the elements (again, usually treat as private/protected)
		getHeader     : function() { return this.getHeaderEl().text(); },
		getText       : function() { return this.getTextEl().text(); },
		getRetryBtnLabel : function() { return this.getRetryBtnEl().text().trim(); },  // trim because we put the text on a new line in the template


		// Common Expectations

		expectHeader : function( expectedHeader ) {
			expect( this.getHeader() ).toBe( expectedHeader );
		},

		expectText : function( expectedText ) {
			expect( this.getText() ).toBe( expectedText );
		},

		expectRetryBtnLabel : function( expectedRetryBtnLabel ) {
			expect( this.getRetryBtnLabel() ).toBe( expectedRetryBtnLabel );
		},

		// Convenient Combination Method
		expectState : function( header, text, retryBtnLabel ) {
			this.expectHeader( header );
			this.expectText( text );
			this.expectRetryBtnLabel( retryBtnLabel );
		},


		// User Interaction Simulation Methods

		clickRetryBtn : function() {
			this.getRetryBtnEl().triggerHandler( 'click' );
		}

	};


	return AppErrorBoxTestWrapper;

} ] );
