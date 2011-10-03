ig.module(
    'game.entities.explosion'
).requires(
    'impact.entity'
).defines(function() {
    
    EntityExplosion = ig.Entity.extend({
        
        size: {x:16, y:16},
        
        animSheet: new ig.AnimationSheet( 'media/explosion.png', 16, 16 ),
        
        creationTimer: null,
        
        init: function( x, y, settings ) {
            
            this.creationTimer = new ig.Timer();
            
            this.addAnim( 'explode', 0.1, [0,1] );
            
            this.parent( x, y, settings );
            
        },
        
        update: function() {

            if (this.creationTimer.delta() > 0.6) {
                this.kill();
            }
            
            this.parent();
        }

        
    })
    
});
