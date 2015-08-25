/* global game */

var loaderState = {
    
    preload: function () {
        
        game.add.sprite(0, 0, 'space');
        game.add.sprite(200, 200, 'loadingBarContainer');
        // Adding a loading text onto the screen
        game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'} );
        
        
        /**
         * Game art loading
         **/ 
         
        // Sprites
        game.load.spritesheet('player', '/assets/images/player.png', 32, 48);
        game.load.spritesheet('enemy', '/assets/images/enemy.png', 32, 32);
            
        // Backgrounds
        game.load.image('snow', '/assets/images/snow.png');
        game.load.image('transition', '/assets/images/transition.png');
        game.load.image('backgroundClouds', '/assets/images/whiteclouds.png');
        game.load.audio('gameMusic','assets/sound/game-music.mp3');
        
        // Platforms
        game.load.image('platform', '/assets/images/platform.png');
        game.load.image('cloud', '/assets/images/cloud-platform.png');
        
        // Buttons
        game.load.image('musicIcon', '/assets/images/music-icon.png');
        game.load.image('SFXIcon', '/assets/images/SFX-icon.png');
        
        // Miscellaneous
        game.load.image('briefcase', '/assets/images/briefcase.png');
        
        
        /**
         * Game audio loading
         **/ 
        
        // SFX
        game.load.audio('step','assets/sound/footstep.wav');
        game.load.audio('jump','assets/sound/jump.wav');
        game.load.audio('death', 'assets/sound/death.wav');
        game.load.audio('lavaDrip','assets/sound/lava-drip.wav');
        game.load.audio('lavaSplash','assets/sound/lava-splash.mp3');
        game.load.audio('lavaSizzle','assets/sound/sizzle.wav');
        game.load.audio('hitEnemy','assets/sound/thud.wav');
        
        //Music
        
        game.load.audio('introMusic','assets/sound/intro-music.wav');
        game.load.audio('victoryMusic','assets/sound/victory-music.mp3');
        
        this.preloadBar = this.add.sprite(200, 200, 'loadingBar');
        this.load.setPreloadSprite(this.preloadBar);
        
       
        
    },
    update: function(){
        if (this.cache.isSoundDecoded('introMusic') )
		{
			// now you can safely change state and music will play instantly on desktop (mobile still requires a touch unlock though 
			// (Need to look this up later))
		game.state.start('menu');
		}
    }
};