angular.module( 'heroes' ).component( 'myHeroesDetailPage', {
	bindings : {
		heroId : '<'
	},

	templateUrl  : 'heroes-detail-page/my-heroes-detail-page.html',
	controller   : MyHeroesDetailPageController
} );

function MyHeroesDetailPageController( $scope ) {
	$scope.$watch( '$ctrl.heroId', loadHeroById );

	function loadHeroById( heroId ) {
		// ...
	}
}