ig.module(
    'game.entities.bomber-enemy'
).requires(
    'game.entities.enemy-rocket',
    'game.entities.enemy'
    
).defines(function() {
    
    EntityBomberEnemy = EntityEnemy.extend({
        
        sineTimer: null,

        damageTakenPerShot: 50,

        animSheet: new ig.AnimationSheet( 'media/bomber-enemy.png', 8, 8 ),

        centerY: null, // We'll center the sine motion around this point
        
        init: function( x, y, settings ) {  

            this.addAnim( 'idle', 0.1, [0,1]);

            if (y < 50) y = 50;
          
            this.parent( x, y, settings );

            this.sineTimeSpeed = Math.random() + 1.5;

            this.sineTimer = new ig.Timer( this.sineTimeSpeed );

            this.centerY = y;

            this.amplitude = Math.random() * 25 + 25;
            
            this.vel.y = 0;
                  
        },
        
        update: function() {
            
            var timeVal = this.sineTimer.delta() + this.sineTimeSpeed;

            var offset_y = Math.sin( (timeVal / this.sineTimeSpeed ) * (2*Math.PI) ) * this.amplitude;
            
            this.pos.y = this.centerY + offset_y;

            if ( this.sineTimer.delta() >= 0 ) {
                this.sineTimer.reset();
            }

            if( Math.random() * 60 < 1 ) // Fire about once per second
                ig.game.spawnEntity( EntityEnemyRocket, this.pos.x + this.size.x/2-1, this.pos.y ); 
            
            this.parent();
        }
        
    })
    
});
