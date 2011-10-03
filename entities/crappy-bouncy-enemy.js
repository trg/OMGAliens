ig.module(
    'game.entities.crappy-bouncy-enemy'
).requires(
    'impact.entity',
    'game.entities.enemy-laser-beam',
    'game.entities.bouncy-enemy'
    
).defines(function() {
    
    EntityCrappyBouncyEnemy = EntityBouncyEnemy.extend({
                
        update: function() {
            
            this.parent();
            
            if( Math.random() * 30 < 1 ) 
                ig.game.spawnEntity( EntityEnemyLaserBeam, this.pos.x + this.size.x/2-1, this.pos.y );
            
        }
        
        
    })
    
});
