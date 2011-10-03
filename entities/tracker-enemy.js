ig.module(
    'game.entities.tracker-enemy'
).requires(
    'impact.entity',
    
    'game.entities.enemy',
    'game.entities.player-ship'
    
).defines(function() {
    
    EntityTrackerEnemy = EntityEnemy.extend({

        size: {x: 16, y: 16},
        
        init: function( x, y, settings ) {
            
            this.parent( x, y, settings );
            
            this.vel.x = 0;
            this.vel.y = 0;
            
            
        },
        
        update: function() {
            
            var playerShip = ig.game.getEntitiesByType( EntityPlayerShip )[0];

            if (playerShip) {
                if (playerShip.pos.x > this.pos.x) {
                    this.accel.x = Math.random() * 150;
                } else if (playerShip.pos.x < this.pos.x) {
                    this.accel.x = (-1) * Math.random() * 150;
                } else {
                    this.accel.x = 0;
                }
            }
            
            this.parent();
        }
        
    })
    
});
