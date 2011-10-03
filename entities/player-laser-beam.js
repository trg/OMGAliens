ig.module(
    'game.entities.player-laser-beam'
).requires(
    'game.entities.laser-beam'
).defines(function() {
    
    EntityPlayerLaserBeam = EntityLaserBeam.extend({
        
        type: ig.Entity.TYPE.A,
        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            
            this.maxVel.y = 500;
            this.vel.y = -500;
            
        }
    })
    
});
