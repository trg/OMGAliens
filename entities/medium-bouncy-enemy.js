ig.module(
    'game.entities.medium-bouncy-enemy'
).requires(
    'impact.entity',
    'game.entities.enemy-bullet-weak',
    'game.entities.bouncy-enemy'
    
).defines(function() {
    
    EntityMediumBouncyEnemy = EntityBouncyEnemy.extend({
        
        animSheet: new ig.AnimationSheet( 'media/green-enemy.png', 8, 8 ),
        
        damageTakenPerShot: 25,
        
        update: function() {
            
            if( Math.random() * 120 < 1 ) // Fire about once per 1 seconds
                ig.game.spawnEntity( EntityEnemyBulletWeak, this.pos.x + this.size.x/2-1, this.pos.y );
            
            this.parent();
        },

        kill: function() {
            ig.game.score += 5; // 6 pts for killing these guys
            this.parent();
        }
        
    })
    
});
