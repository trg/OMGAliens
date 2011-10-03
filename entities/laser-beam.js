ig.module(
    'game.entities.laser-beam'
).requires(
    'impact.entity'
).defines(function() {
    
    EntityLaserBeam = ig.Entity.extend({
        
        size: {x:2, y:6},
        
        animSheet: new ig.AnimationSheet( 'media/laser-beam-green.png', 2, 6 ),
        
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function( x, y, settings ) {
            
            this.parent( x, y, settings );
            
            this.addAnim( 'idle', 0.1, [0,1]);
            
            this.maxVel.y = 300;
        
        },
        
        update: function() {            
            // Kill it if it goes off screen
            if( this.pos.y < 0 || this.pos.y > 320) {
                this.kill();
            }
            this.parent();
        }
        
    })
    
});
