ig.module(
    'game.entities.bouncy-enemy'
).requires(
    'impact.entity',
    
    'game.entities.enemy'
    
).defines(function() {
    
    EntityBouncyEnemy = EntityEnemy.extend({
        
        thrustTimerY: null,
        
        init: function( x, y, settings ) {
            
            this.thrustTimerY = new ig.Timer( Math.max( Math.random(), 0.5) );
            
            this.parent( x, y, settings );
            
        },
        
        update: function() {
            
            if ( this.thrustTimerY.delta() > 0 ) {
                this.thrustTimerY.reset();
                this.vel.y = -this.vel.y;
            } 
            
            this.parent();
        }
        
    })
    
});
