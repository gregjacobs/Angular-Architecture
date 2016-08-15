angular.module( 'myApp' ).component( 'myHeroesList', {
	templateUrl : 'heroes-list-page/my-heroes-list-page.html',
	controller  : MyHeroesListPageController
} );


function MyHeroesListPageController( HeroesService ) {
	var ctrl = this;

	ctrl.PageState = { LOADING: 0, LOADED: 1, ERROR: 2 };

	ctrl.pageState = ctrl.PageState.LOADING;
	ctrl.heroes = null;

	loadHeroes();


	function loadHeroes() {
		ctrl.pageState = ctrl.PageState.LOADING;

		HeroesService.loadHeroes().then(
			onLoadHeroesSuccess,
			onLoadHeroesError
		);
	}

	/**
	 * @param {Heroes[]} heroes
	 */
	function onLoadHeroesSuccess( heroes ) {
		ctrl.pageState = ctrl.PageState.LOADED;
		ctrl.heroes = heroes;
	}

	/**
	 * @param {HttpError} error
	 */
	function onLoadHeroesError( error ) {
		ctrl.pageState = ctrl.PageState.ERROR;
		ctrl.error = error.toString();
	}
}