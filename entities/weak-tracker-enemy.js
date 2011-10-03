ig.module(
    'game.entities.weak-tracker-enemy'
).requires(
    'impact.entity',
    'game.entities.weak-tracker-laser-beam',
    'game.entities.tracker-enemy'
    
).defines(function() {
    
    EntityWeakTrackerEnemy = EntityTrackerEnemy.extend({

        size: {x: 16, y: 16},
        
        animSheet: new ig.AnimationSheet( 'media/tracker-enemy.png', 16, 16 ),
        
        damageTakenPerShot: 10,
        
        init: function( x, y, settings ) {
            
            this.parent( x, y, settings );
            
            this.addAnim( 'twoframe', 0.1, [0,1]);
            this.currentAnim = this.anims.twoframe;
            
        },
        
        update: function() {
            this.parent();
            
            if( Math.random() * 90 < 1 ) { // Fire about once per 1.5 seconds
                ig.game.spawnEntity( EntityWeakTrackerLaserBeam, this.pos.x + this.size.x/2-1, this.pos.y + this.size.y/2 );
                ig.game.spawnEntity( EntityWeakTrackerLaserBeam, this.pos.x + this.size.x, this.pos.y + this.size.y/2 );
                //ig.game.spawnEntity( EntityWeakTrackerLaserBeam, this.pos.x - this.size.x, this.pos.y );
            }
        },

        kill: function() {
            ig.game.score += 14; // 15 pts for killing these guys
            this.parent();
        }
        
    })
    
});
