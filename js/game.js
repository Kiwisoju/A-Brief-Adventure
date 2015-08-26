/* global game */

var gameState = {
    
    create: function(){
        
        // Setting up arrow keys to move player
        this.cursors = game.input.keyboard.createCursorKeys();
        
        // Add in all assets
        
        // Game art
        var background = game.add.tileSprite(0, 0, 1600, 600, 'snow'); 
        var foreground = game.add.tileSprite(0, 300,1600, 300, 'backgroundClouds');
        this.briefcase = game.add.image(game.world.width + 450, 300, 'briefcase');
        this.musicIcon = game.add.image(700, 20, 'musicIcon');
        this.SFXIcon = game.add.image(750, 20, 'SFXIcon');
        // Enables all kind of input actions on this image (click, etc)
        this.musicIcon.alpha = 0.5;
        this.SFXIcon.alpha = 0.5;
        this.musicIcon.inputEnabled = true;
        this.musicIcon.fixedToCamera = true;
        this.SFXIcon.inputEnabled = true;
        this.SFXIcon.fixedToCamera = true;
        // Adding the hover transparency
        this.musicIcon.events.onInputOver.add(this.hoverOverMusic, this);
        this.musicIcon.events.onInputOut.add(this.onBlurMusic, this);
        
        // Adding the hover transparency
        this.SFXIcon.events.onInputOver.add(this.hoverOverSFX, this);
        this.SFXIcon.events.onInputOut.add(this.onBlurSFX, this);
        
        // Adding the event listener and calling toggleMusic method
        this.musicIcon.events.onInputDown.add(this.toggleMusic, this);
        // Adding the event listener and calling toggleMusic method
        this.SFXIcon.events.onInputDown.add(this.toggleSFX, this);
        
        /**
         * Setting up platforms and ground
         */
        
        //  The platforms group contains the ground platforms
        this.setupPlatforms();
       
 
        // Setting the bounds of the world
        game.world.setBounds(0, 0, 1600, 600);
        
        // Player & Enemies
        this.setupPlayer();
        this.setupEnemies();
        
        // Sounds
        this.mute = false;
        this.SFXJump = game.add.audio('jump');
        this.SFXFootstep = game.add.audio('step');
        this.SFXLavaDrip = game.add.audio('lavaDrip');
        this.SFXLavaSplash = game.add.audio('lavaSplash');
        this.SFXLavaSizzle = game.add.audio('lavaSizzle');
        this.SFXEnemyHit = game.add.audio('thud');
        this.SFXDeath = game.add.audio('death');
        this.music = game.add.audio('gameMusic');
        
        // Starts the music playing
        this.music.play();
        
    },
    setupEnemies: function(){
        
        // Adding in the enemies group
        this.enemies = game.add.group();
        
        //  We will enable physics for any object that is created in this group
        this.enemies.enableBody = true;
        
        
        /**
         * Creating Individual Enemies
         */
         
        // This is how to instantiate an Enemy
        this.enemyGenerator(50, 50, 'right');
        this.enemyGenerator(60, 60, 'left');
        this.enemyGenerator(100, 100, 'right');
        this.enemyGenerator(300, 300, 'left');
    },
    enemyGenerator: function(x, y, direction){
        this.enemy = this.enemies.create(x,y,'enemy');
        this.enemy.body.gravity.y = 300;
        this.enemy.body.bounce.set(1, 0.2);
        this.enemy.body.collideWorldBounds = true;
        //  Our two animations, walking left and right.
        this.enemy.animations.add('left', [0, 1], 10, true);
        this.enemy.animations.add('right', [2, 3], 10, true);
        // This will set them off in the direction wanted 
        if(direction == 'right'){
            this.enemy.animations.play('right', 10, true); // get enemy moving
            this.enemy.body.velocity.setTo(150);  
        }else if(direction == 'left'){
            this.enemy.animations.play('left', 10, true); // get enemy moving
            this.enemy.body.velocity.setTo(-150);  
        }
    },
    enemyAnimations: function(enemy){
      if(enemy.body.velocity.x==150){
             enemy.animations.play('right', 10, true); // get enemy moving
        }else if(enemy.body.velocity.x== -150){
            enemy.animations.play('left', 10, true); // get enemy moving
        }  
    },
    setupPlatforms: function(){
        
        /**
         * General Setup
         */
        
        this.platforms = game.add.group();
        this.cloudPlatforms = game.add.group();
        this.walls = game.add.group();
        
        //  We will enable physics for any object that is created in these groups
        this.platforms.enableBody = true;
        this.walls.enableBody = true;
        this.cloudPlatforms.enableBody = true;
        
        
        
        
        
        /**
         * Ground
         */
        
        // Here we create the ground.
        this.ground = this.platforms.create(1, game.world.height - 32, 'platform');
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.ground.scale.setTo(game.world.width, 1);
        //  This stops it from falling away when you jump on it
        this.ground.body.immovable = true;
        
        
        /**
         * Walls
         */ 
        
        this.wallGenerator(1,0);
        this.wallGenerator(game.world.width, game.world.height);
        this.wallGenerator(400,300);
        this.wallGenerator(200,50);
       
        
        /**
         * Platforms
         */
        
        //  Creating two ledges
        this.ledge = this.platforms.create(400, 400, 'platform');
        this.ledge.body.immovable = true;
        
        this.ledge = this.platforms.create(150, 250, 'platform');
        this.ledge.body.immovable = true;  
        
        /**
         * Cloud Platforms
         */
        
        // Here we create the ground.
        this.cloud = this.cloudPlatforms.create(600, 400, 'cloud');
        
    },
    wallGenerator: function(x, y){
        
        // Create the wall object/sprite
        this.wall = this.walls.create(x, y, 'wall');
        this.wall.scale.setTo(1, game.world.height / 170 );
        this.wall.body.immovable = true;
        
    },
    setupPlayer: function(){
        // The player and its settings
        this.player = game.add.sprite(32, game.world.height - 150, 'player');
    
        //  We need to enable physics on the player
        game.physics.arcade.enable(this.player);
    
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
    
        //  Our two animations, walking left and right. Third parameter
        // is for the framerate
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    },
    killPlayer: function() {
    
        // Removes the player from the screen
        this.player.kill();
        // Play the death sound
        if(this.mute == false){
            this.SFXDeath.play();    
        }
        
        this.setupPlayer();
    

    },
    update: function(){
        // Checks whether the music has stopped playing, if so starts it again.
         if(!this.music.isPlaying){
            this.music.play();
        }
        
        
        
        
        /**
         * Collisions and overlaps
         */ 
        
        
        // Collisions
        
        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.collide(this.enemies, this.platforms);
        game.physics.arcade.collide(this.enemies, this.walls);
        
        // Overlaps
        
        game.physics.arcade.overlap(this.player, this.enemies, this.killPlayer, null, this);
        
        // Reset the players velocity (movement)
        this.player.body.velocity.x = 0;
    
        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
            if(this.player.body.touching.down){
                // Need to find a way to make sure that if the Footstep
                // is playing, that 
                if(this.mute == false){
                 this.SFXFootstep.play('', 0, 0.4, false, false);   
                }
                 
            }
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
            if(this.player.body.touching.down){
                // Need to find a way to make sure that if the Footstep
                // is playing, that 
                if(this.mute == false){
                    this.SFXFootstep.play('', 0, 0.4, false, false);   
                }
            }
        }
        else{
            //  Stand still
            this.player.animations.stop();
            this.player.frame = 4;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.body.velocity.y = -350;
            // Add in the SFX sound for jumping
            if(this.mute == false){
                this.SFXJump.play('', 0, 0.3);
            }
        }
        
        /**
         * Enemy update functions
         */
        
        this.enemies.forEach(this.enemyAnimations, this);
         
        
        
        // Setting up the camera to focus on the player
        game.camera.follow(this.player);
    }, 
    toggleMusic: function() {
        this.musicIcon.alpha = 1;
        if(this.music.volume == 1){
            this.music.volume = 0;
            this.musicIcon.tint = 0x000000;
        }else{
            this.music.volume = 1;
            this.musicIcon.tint = 0xffffff;
        }
    },
    hoverOverMusic: function(){
        this.musicIcon.alpha = 0.8;
    },
    onBlurMusic: function(){
        this.musicIcon.alpha = 0.5;
    },
    hoverOverSFX: function(){
        this.SFXIcon.alpha = 0.8;
    },
    onBlurSFX: function(){
        this.SFXIcon.alpha = 0.5;
    },
    toggleSFX: function() {
        this.SFXIcon.alpha = 1;
        if(this.mute == false){
            this.mute = true;
            this.SFXIcon.tint = 0x000000;
        }else if(this.mute == true){
            this.mute = false;
            this.SFXIcon.tint = 0xffffff;
        }
    },
    hoverOver: function(){
        this.musicIcon.alpha = 0.8;
    },
    onBlur: function(){
        this.musicIcon.alpha = 0.5;
    }
    
}