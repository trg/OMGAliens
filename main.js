ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
    'impact.sound',
	'impact.background-map',
	
	'game.entities.player-ship',
	'game.entities.player-laser-beam',
	
	'game.entities.medium-bouncy-enemy',
	'game.entities.crappy-bouncy-enemy',
	'game.entities.weak-tracker-enemy',
    'game.entities.bomber-enemy',
    'game.entities.boss-green-enemy',
	
	'game.entities.enemy-laser-beam',
	'game.entities.enemy-bullet-weak',
	
	'game.entities.explosion',

    'game.entities.shield-powerup',
    'game.entities.gun-powerup',
	
	'game.levels.main'
)
.defines(function(){

// Custom Loader!
// Subclass the default loader
MyLoader = ig.Loader.extend({
	
	loading_graphic: new ig.Image( '/assets/images/v2/site/white-logo.png' ),

	draw: function() {
		// Add your drawing code here
	
		this._drawStatus += (this.status - this._drawStatus)/5;
		var s = ig.system.scale;
		var w = ig.system.width * 0.6;
		var h = ig.system.height * 0.1;
		var x = ig.system.width * 0.5-w/2;
		var y = ig.system.height * 0.5-h/2;
		
		ig.system.context.fillStyle = '#000';
		ig.system.context.fillRect( 0, 0, 480, 320 );
		
		ig.system.context.fillStyle = '#fff';
		ig.system.context.fillRect( x*s, y*s, w*s, h*s );
		
		ig.system.context.fillStyle = '#000';
		ig.system.context.fillRect( x*s+s, y*s+s, w*s-s-s, h*s-s-s );
		
		ig.system.context.fillStyle = '#fff';
		ig.system.context.fillRect( x*s, y*s, w*s*this._drawStatus, h*s );
		
		this.loading_graphic.draw( 50, 30 );

	}

});

Level = {
	number: 0, // Level number, 0 = loading screen
	enemiesKilledThisLevel: 0,
	
	goToNextLevel: function() {
		this.number++;
		this.enemiesKilledThisLevel = 0;
	}
};

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	score: 0,
	
	lives: 3,
	
	waitingToRespawn: true,
	
	gameOver: false,

    isMuted: false,
	
	totalEnemiesKilled: 0,
	
	awaitingOk: false, // when true, await user to hit OK,
	
	canContinue: false, // player has shared on FB
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.S, 'down' );
		
		ig.input.bind( ig.KEY.SHIFT, 'fire' );
		ig.input.bind( ig.KEY.SPACE, 'fire' );
		ig.input.bind( ig.KEY.F, 'fire' );
		ig.input.bind( ig.KEY.MOUSE1, 'fire' );
		ig.input.bind( ig.KEY.ENTER, 'ok' );

        ig.input.bind( ig.KEY.P, 'pause' );
	
        ig.input.bind( ig.KEY.M, 'mute' );
	
		// load background
		// Create BackgroundMap
		/*
		var data = [];
		for( var y = 0; y < 20; y++) { // height of screen / tile size
			data[y] = [];
			for( var x = 0; x < 15; x++) {
				data[y][x] = Math.ceil( Math.random() * 32 ); // width of screen / tile size
			}
		}
		console.log( data );
		//data = [[0,1,3,1,2]];
		
		this.bgmap = new ig.BackgroundMap( 16, data, 'media/backgroundtiles.png' );
		this.bgmap.repeat = true;
		this.backgroundMaps.push( this.bgmap );
		*/
		
		// Check for a new level action (eg: spawn a new enemy) once per second
		this.levelActionTimer = new ig.Timer( 1 );
		// Used by requestRespawn() 
		this.playerSpawnTimer = new ig.Timer( 2 );
		// used by background
		//this.backgroundMovementTimer = new ig.Timer(0);

        // Music
        //ig.music.add( 'media/audio/DST-RockitFlarex.ogg' );
        /*
        ig.music.add( 'media/audio/DST-RobotLaserCarnage.ogg' );
        ig.music.volume = 1.0;
        ig.music.loop = true;
        ig.music.play();
        */

        soundManager.createSound({
            id: 'backgroundMusic',
            url: '/arcade/omgaliens/media/audio/DST-RobotLaserCarnage.mp3',
            autoPlay: true,
            volume: 60
        }).play({
            onfinish: function() { soundManager.play('backgroundMusic') }
        });
        

	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		// move background
		// higher multipler = faster
		//this.bgmap.setScreenPos( 0, -this.backgroundMovementTimer.delta() * 120);
		
		// Spawn a new enemy
		if( !this.gameOver && this.levelActionTimer.delta() > 0 ) {
			this.levelAction();
			this.levelActionTimer.reset();
		}
		
        // Welcome Screen
        if( Level.number == 0 && ig.input.pressed( 'ok' ) ) {
            this.nextLevel();
        }

        // mute game?
        if( ig.input.pressed( 'mute' ) ) {
            if( this.isMuted )
                soundManager.unmute();
            else
                soundManager.mute();
            this.isMuted = !this.isMuted;
        }

		// respawn player if dead
		if( this.waitingToRespawn && this.playerSpawnTimer.delta() > 0) {
			this.waitingToRespawn = false;
			ig.game.spawnEntity( EntityPlayerShip, 112, 320 );
		}
		
		// game over screen
		if (this.gameOver && !this.canContinue && ig.input.pressed('ok') ) {
			FB.ui(
				{
					method: 'feed',
					name: 'omgaliens | bitniblet arcade',
					link: 'http://bitniblet.com/arcade/omgaliens/',
					picture: 'http://bitniblet.com/assets/images/arcade/omgaliens-facebook-tile.png',
					caption: 'My High Score',
					description: 'I scored ' + ig.game.score + ' points in omgaliens at bitniblet arcade!',
					message: ''
				},
				function(response) {
					if (response && response.post_id) {
						ig.game.canContinue = true;
					}
				}
			);
			
		}
		
		if (this.gameOver && this.canContinue && ig.input.pressed('ok') ) {
			this.continueGame();	
		}
        

	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Show HUD
		this.font.draw( "Score: " + this.score, 5, 5, ig.Font.ALIGN.LEFT );
		this.font.draw( "Level: " + Level.number, 5, 15, ig.Font.ALIGN.LEFT );
		this.font.draw( "Lives: " + this.lives, 200, 5, ig.Font.ALIGN.LEFT );
		this.font.draw( "Shield", 80, 5 );
		
		// Draw Shield Bar
		var s = ig.system.scale;
		var w = 50;
		var h = 5;
		var x = 110;
		var y = 5;
		
		ig.system.context.fillStyle = '#fff';
		ig.system.context.fillRect( x*s, y*s, w*s, h*s );
		
		ig.system.context.fillStyle = '#000';
		ig.system.context.fillRect( x*s+s, y*s+s, w*s-s-s, h*s-s-s );
		
		var player_health = this.getPlayerHealth();
		
		if( player_health > 0) {
			ig.system.context.fillStyle = '#fff';
			ig.system.context.fillRect( x*s+s, y*s+s, w*s*(player_health/100)-s-s, h*s-s-s );
		}

        // Before the game starts
        if (Level.number == 0) {
            this.font.draw( 'OMGALIENS', 120, 52, ig.Font.ALIGN.CENTER );

            this.font.draw( 'CONTROLS', 120, 75, ig.Font.ALIGN.CENTER );
            this.font.draw( 'AWDS / ARROW KEYS - MOVE', 50, 83, ig.Font.ALIGN.LEFT );
            this.font.draw( 'F / SHIFT / SPACE - SHOOT', 50, 91, ig.Font.ALIGN.LEFT );
            //this.font.draw( 'M - MUTE', 50, 99, ig.Font.ALIGN.LEFT );

			this.font.draw( 'Press Enter', 120, 268, ig.Font.ALIGN.CENTER );
			this.font.draw( 'to Begin!', 120, 276, ig.Font.ALIGN.CENTER );
        }

		// game over!
		if ( this.gameOver && this.canContinue) {
			this.font.draw( 'Game Over!', 120, 152, ig.Font.ALIGN.CENTER );
			this.font.draw( 'Press Enter', 120, 168, ig.Font.ALIGN.CENTER );
			this.font.draw( 'to Continue', 120, 176, ig.Font.ALIGN.CENTER );
		}
		
		if (this.gameOver && !this.canContinue) {
            this.font.draw( 'Game Over!', 120, 152, ig.Font.ALIGN.CENTER ); 
			this.font.draw( 'Post your high score', 120, 168, ig.Font.ALIGN.CENTER );
			this.font.draw( 'to Facebook to continue!', 120, 186, ig.Font.ALIGN.CENTER );
			this.font.draw( 'Press Enter to Post', 120, 204, ig.Font.ALIGN.CENTER );
            this.font.draw( '(Disable your popup blocker first)', 120, 220, ig.Font.ALIGN.CENTER );

		}
	},
	
	gameIsOver: function() {
		this.gameOver = true;
	},
	
	// Gets called by PlayerShip when the ship dies
	requestRespawn: function() {
		this.waitingToRespawn = true;
		this.playerSpawnTimer.reset();
	},
	
	// called upon gameOver = true
	continueGame: function() {
		this.lives = 3;
		this.gameOver = false;
		this.requestRespawn();
	},
	
	getPlayerHealth: function() {
		var playerShipList = this.getEntitiesByType( EntityPlayerShip );
		if( playerShipList.length > 0 ) {
			return playerShipList[0].health;
		} else {
			return 0;
		}
	},
	
	// Spawn an enemy of type enemyType off screen
	spawnEnemyRandomOffscreen: function( enemyType ) {
		ig.game.spawnEntity( enemyType, -16, Math.random() * 100 );
	},
	
	spawnPowerup: function( powerupType ) {
        ig.game.spawnEntity( powerupType, Math.random() * 240, -8);
    },
	
	// called by any enemy that dies
	enemyKilled: function( enemy ) {
		this.totalEnemiesKilled++;
		Level.enemiesKilledThisLevel++;
	},
	
	// called once per second
	levelAction: function() {
		var level = Level.number;
		var enemiesOnScreen = this.getEntitiesByType( EntityEnemy ).length;

        // Shield Powerup
        if( Math.random() < 1.0/60.0 ) { // 1 per minute
            this.spawnPowerup( EntityShieldPowerup );
        }
        
        var levelPointer = 1;

		/* LEVEL ONE */
		if (level == levelPointer++) {
			// Spawn Logic
			if (enemiesOnScreen < 3 &&
			    Math.random() > 0.4) { // average every other time
				this.spawnEnemyRandomOffscreen( EntityCrappyBouncyEnemy );
			}	
			// Next Level Logic
			if (Level.enemiesKilledThisLevel >= 10)
				this.nextLevel();
		}
		
		if (level == levelPointer++) {
			// Spawn Logic
			if (enemiesOnScreen < 10 &&
			    Math.random() > 0.25) {
				this.spawnEnemyRandomOffscreen( EntityCrappyBouncyEnemy );
			}
			// Next Level Logic
			if (Level.enemiesKilledThisLevel >= 20)
				this.nextLevel();
		}
		
		if (level == levelPointer++) {
			// Spawn Logic
			if(enemiesOnScreen < 15) {
				this.spawnEnemyRandomOffscreen( EntityCrappyBouncyEnemy );
			}
			// Next Level Logic
			if (Level.enemiesKilledThisLevel >= 50)
				this.nextLevel();
		}
		
		if (level == levelPointer++) {
			// Spawn Logic
			if ( (Level.enemiesKilledThisLevel + enemiesOnScreen < 50) 
                && enemiesOnScreen < 15) {
				if( Math.random() < 0.2 ) {
					this.spawnEnemyRandomOffscreen( EntityMediumBouncyEnemy );
				} else {
					this.spawnEnemyRandomOffscreen( EntityCrappyBouncyEnemy );
				}
			}
			// Next Level Logic
			if (Level.enemiesKilledThisLevel >= 50)
				this.nextLevel();
		}

        if (level == levelPointer++) {
			// Spawn Logic
			if (enemiesOnScreen == 0 && Level.enemiesKilledThisLevel == 0) {
				this.spawnEnemyRandomOffscreen( EntityBossGreenEnemy );
			}
			// Next Level Logic
			if (Level.enemiesKilledThisLevel == 1)
				this.nextLevel();
		}

		if (level == levelPointer++) {
			// Spawn Logic
			if (enemiesOnScreen < 20) {
				// Always have a tracker guy at the top
				if( this.getEntitiesByType(EntityWeakTrackerEnemy).length < 1 &&
				   Math.random() < 0.1)
					ig.game.spawnEntity( EntityWeakTrackerEnemy, -16, 16 );
				else {
                    if( Math.random() < 0.2 ) {
                        this.spawnEnemyRandomOffscreen( EntityMediumBouncyEnemy );
                    } else {
                        this.spawnEnemyRandomOffscreen( EntityCrappyBouncyEnemy );
                    }
				}
			}
			// Next Level Logic
			if (Level.enemiesKilledThisLevel >= 50)
				this.nextLevel();
		}
        if (level == levelPointer++) {
			// Spawn Logic
			if (enemiesOnScreen < 25) {
				// Always have a tracker guy at the top
				if( this.getEntitiesByType(EntityWeakTrackerEnemy).length < 1 &&
				   Math.random() < 0.1)
					ig.game.spawnEntity( EntityWeakTrackerEnemy, -16, 16 );
				else {
                    if( Math.random() < 0.7 ) {
                        this.spawnEnemyRandomOffscreen( EntityMediumBouncyEnemy );
                    } else {
                        this.spawnEnemyRandomOffscreen( EntityCrappyBouncyEnemy );
                    }
				}
			}
			// Next Level Logic
			if (Level.enemiesKilledThisLevel >= 50)
				this.nextLevel();
        }
        if (level == levelPointer++) {
			// Spawn Logic
			if (enemiesOnScreen < 25) {
				// Always have a tracker guy at the top
				if( this.getEntitiesByType(EntityWeakTrackerEnemy).length < 1 &&
				   Math.random() < 0.1)
					ig.game.spawnEntity( EntityWeakTrackerEnemy, -16, 16 );
				else {
                    if( Math.random() < 0.0 ) {
                        this.spawnEnemyRandomOffscreen( EntityMediumBouncyEnemy );
                    } else {
                        this.spawnEnemyRandomOffscreen( EntityBomberEnemy );
                    }
				}
			}
			// Next Level Logic
			if (Level.enemiesKilledThisLevel >= 50)
				this.nextLevel();
        }
        if (level >= levelPointer++) {
			// Spawn Logic

            var enemiesToSpawn = level - enemiesOnScreen;

            for( var i = 0; i < enemiesToSpawn; i++ ) {
				// Always have a tracker guy at the top
				if( this.getEntitiesByType(EntityWeakTrackerEnemy).length < 3 &&
				   Math.random() < 0.1) {
					ig.game.spawnEntity( EntityWeakTrackerEnemy, -16, 16 );
			    }
                
                // span a random dude
                var enemyTypeList = [   EntityCrappyBouncyEnemy, 
                                        //EntityWeakTrackerEnemy,
                                        EntityBomberEnemy,
                                        EntityMediumBouncyEnemy
                                    ];
                var index = Math.floor( Math.random() * enemyTypeList.length );

                var enemyTypeToSpawn = enemyTypeList[index];
                
                this.spawnEnemyRandomOffscreen( enemyTypeToSpawn );

                // MAYBE spawn a weapon powerup
                if (Math.random() < 0.01)
                    this.spawnPowerup( EntityGunPowerup );

                // MAYBE spawn a boss guy
                if( this.getEntitiesByType(EntityBossGreenEnemy).length < 1 && Math.random() < 0.01)
                    this.spawnEnemyRandomOffscreen( EntityBossGreenEnemy );
            }

			// Next Level Logic
			if (Level.enemiesKilledThisLevel >= 20)
				this.nextLevel();
        }


	},
	
	// called when it's time to go to the next level
	nextLevel: function() {
		Level.goToNextLevel();
	}
	
	
});

ig.Sound.enabled = false;


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2 unless ?small
var game_area_multiplier = 2;
if( window.location.search.match('small') != null ) {
	game_area_multiplier = 1;
}

ig.main( '#canvas', MyGame, 60, 240, 320, game_area_multiplier, MyLoader);

});
