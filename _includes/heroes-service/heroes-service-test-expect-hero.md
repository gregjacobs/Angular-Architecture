    /**
     * Helper function to check the state of a Hero instance.
     */
    function expectHero( hero ) {
        expect( hero ).toEqual( jasmine.any( Hero ) );  // instanceof check
        
        return {
            toContain : function( id, name, lastBattle ) {
                expect( hero.id ).toBe( id );
                expect( hero.name ).toBe( name );
                expect( hero.lastBattle.format() ).toBe( lastBattle.format() );
            }
        };
    }