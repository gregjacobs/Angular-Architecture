angular.module( 'heroes' ).factory( 'HeroesTestData', function() {

	var mrNice   = { id: 11, name: 'Mr. Nice', lastBattle: '2016-04-22T14:22:01' },
	    narco    = { id: 12, name: 'Narco',    lastBattle: '2016-02-01T08:52:27' },
	    bombasto = { id: 13, name: 'Bombasto', lastBattle: '2016-05-10T18:00:52' };

	return {
		mrNice   : mrNice,
		narco    : narco,
		bombasto : bombasto,

		heroes   : [ mrNice, narco, bombasto ]
	};

} );