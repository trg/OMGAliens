ig.module(
    'game.entities.boss-green-enemy'
).requires(
    //'game.entities.boss-green-rocket',
    'game.entities.enemy-rainbow-bullet',
    'game.entities.tracker-enemy',
    'game.entities.gun-powerup'
    
).defines(function() {
    
    EntityBossGreenEnemy = EntityTrackerEnemy.extend({
        
        shotTimer: null,

        sineTimer: null,

        damageTakenPerShot: 5,

        size: { x: 16, y: 16 },

        animSheet: new ig.AnimationSheet( 'media/green-monster.png', 16, 16 ),
        
        init: function( x, y, settings ) {  

            this.addAnim( 'idle', 0.5, [0,1] );

            if (y < 50) y = 50;
          
            this.parent( x, y, settings );

            this.sineTimeSpeed = Math.random() + 1.5;

            this.sineTimer = new ig.Timer( this.sineTimeSpeed );

            this.shotTimer = new ig.Timer( 0.25 );

            this.centerY = y;

            this.amplitude = 40;
            
            this.vel.y = 0;
                  
        },
        
        update: function() {
            
            var timeVal = this.sineTimer.delta() + this.sineTimeSpeed;

            var offset_y = Math.sin( (timeVal / this.sineTimeSpeed ) * (2*Math.PI) ) * this.amplitude;
            
            this.pos.y = this.centerY + offset_y;

            if ( this.sineTimer.delta() > 0 ) {
                this.sineTimer.reset();
            }

            if( this.shotTimer.delta() > 0 ) {
                ig.game.spawnEntity( EntityEnemyRainbowBullet, this.pos.x + this.size.x/2-1, this.pos.y + 4 ); 
                this.shotTimer.reset();
            }

            this.parent();
        },

        kill: function() {
            // Drop a gun powerup when he's killed
            ig.game.spawnEntity( EntityGunPowerup, this.pos.x + this.size.x/2, this.pos.y + this.size.y/2);

            this.parent();
        }
        
    })
    
});
