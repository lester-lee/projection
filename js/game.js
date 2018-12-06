---
---
// map variables
let player;
let playerSpeed = 500;
let showDebug = false;
let cursors;


let aboveLayer, mapW, mapH;

// speech bubbles
let speechCounter = 0;
let speechThreshold = 180;
let speechRange = 256;

// interaction
let interactKey, XKey, YKey, BKey;
let justInteracted = false;
let justInteractedWith;
let interactTime;
let interactThreshold = 3000;

function createScene(tileset_url, map_json, Tiledset_name, scene_name) {
  console.log(tileset_url, map_json);
  return new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
      Phaser.Scene.call(this, scene_name);
      this.objects;
      this.paused = false;
    },
    preload: function () {
      // Load tiles
      this.load.image(scene_name + "tiles", tileset_url);
      this.load.tilemapTiledJSON(scene_name + "map", map_json);
      // Load player sprite
      this.load.spritesheet('player',
        '{{site.baseurl}}/assets/sprites/player.png', {
          frameWidth: 32,
          frameHeight: 32
        }
      );
    },
    create: function () {
      // Runs once, after preload finishes

      // Load map
      const map = this.make.tilemap({
        key: scene_name + "map"
      });

      mapW = map.width;
      mapH = map.height;

      // Parameters: (Tiled tileset name, Phaser cache in preload)
      const tileset = map.addTilesetImage(Tiledset_name, scene_name + "tiles");
      console.log(tileset);

      // Parameters: (Tiled layer name, tileset, x, y)
      const belowLayer = map.createStaticLayer("Below", tileset, 0, 0);
      const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
      aboveLayer = map.createDynamicLayer("Above", tileset, 0, 0);

      worldLayer.setCollisionByProperty({
        collides: true
      });
      aboveLayer.setDepth(10);

      // Find "Spawn" object from Tiled
      const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn");

      // Get objects from Tiled
      this.objects = map.objects[0].objects;
      console.log(this.objects);

      // Create a sprite with physics enabled via the physics system. The image used for the sprite has
      // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
      player = this.physics.add
        .sprite(spawnPoint.x, spawnPoint.y, "player");

      this.physics.add.collider(player, worldLayer);

      // Create the player's walking animations
      const anims = this.anims;
      anims.create({
        key: 'down',
        frames: anims.generateFrameNumbers('player', {
          start: 0,
          end: 3
        }),
        frameRate: 10,
        repeat: -1
      });
      anims.create({
        key: 'up',
        frames: anims.generateFrameNumbers('player', {
          start: 4,
          end: 7
        }),
        frameRate: 10,
        repeat: -1
      });
      anims.create({
        key: 'right',
        frames: anims.generateFrameNumbers('player', {
          start: 8,
          end: 11
        }),
        frameRate: 10,
        repeat: -1
      });
      anims.create({
        key: 'left',
        frames: anims.generateFrameNumbers('player', {
          start: 12,
          end: 15
        }),
        frameRate: 10,
        repeat: -1
      });

      // Set up camera
      const camera = this.cameras.main;
      camera.startFollow(player);
      // Set camera bounds
      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      // Create object for arrow keys
      cursors = this.input.keyboard.createCursorKeys();

      /* Debug graphics 
      this.input.keyboard.once("keydown_D", event => {
        // Turn on physics debugging to show player's hitbox
        this.physics.world.createDebugGraphic();

        // Create worldLayer collision graphic above the player, but below the help text
        const graphics = this.add
          .graphics()
          .setAlpha(0.75)
          .setDepth(20);
        worldLayer.renderDebug(graphics, {
          tileColor: null, // Color of non-colliding tiles
          collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
          faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
      });
      */
      // Set up interact key
      interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
      XKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
      YKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
      BKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    },
    wake: function () {
      // idk what this does
    },
    update: function (time, delta) {
      // Runs once per frame for the scene
      let speed = playerSpeed;
      controls = cursors;

      // Generate random speech bubbles
      speechCounter += 1;
      if (speechCounter > speechThreshold){
        speechCounter = 0;
        this.generateSpeechTile();
      }

      // Stop previous movement
      player.body.setVelocity(0);
      if (!this.paused) {
        // Horizontal movement
        if (controls.left.isDown) {
          player.body.setVelocityX(-speed);
        } else if (controls.right.isDown) {
          player.body.setVelocityX(speed);
        }

        // Vertical movement
        if (controls.up.isDown) {
          player.body.setVelocityY(-speed);
        } else if (controls.down.isDown) {
          player.body.setVelocityY(speed);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (controls.left.isDown) {
          player.anims.play("left", true);
        } else if (controls.right.isDown) {
          player.anims.play("right", true);
        } else if (controls.up.isDown) {
          player.anims.play("up", true);
        } else if (controls.down.isDown) {
          player.anims.play("down", true);
        } else {
          player.anims.stop();
        }
        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);

        // Interaction
        if (Phaser.Input.Keyboard.JustDown(interactKey)) {
          this.checkInteraction();
        }
      }
    },
    getObject: function (playerDir) {
      let ox, oy;
      switch (playerDir) {
        case "up":
          ox = player.x;
          oy = player.y - 32
          break;
        case "down":
          ox = player.x;
          oy = player.y + 32;
          break;
        case "left":
          ox = player.x - 32;
          oy = player.y;
          break;
        case "right":
          ox = player.x + 32;
          oy = player.y;
          break;
      }
      return this.getObjectAtWorldXY(ox, oy);
    },
    checkInteraction: function () {
      let playerDir = player.anims.currentAnim.key;
      // console.log(playerDir);
      obj = this.getObject(playerDir);
      // console.log(obj);
      if (obj && obj.name !== justInteractedWith ) {
        this.interact(obj);
      }
    },
    interact: function (obj) {
      justInteractedWith = obj.name === "Speech_bubble" ? "" : obj.name;
      // run the interaction function
      gameInteractions[obj.name](this, obj);
    },
    generateSpeechTile: function(){
      let w = -speechRange + player.x + (Math.random() * speechRange*2);
      let h = -speechRange + player.y + (Math.random() * speechRange*2);
      if (!aboveLayer.getTileAtWorldXY(w,h) &&
          !this.getObjectAtWorldXY(w, h)){
        aboveLayer.putTileAtWorldXY(1, w, h);
        this.objects.push({
          name: "Speech_bubble",
          x: w,
          y: h
        });
      }
    },
    getObjectAtWorldXY: function(x, y, verbose=false){
      let tileX = Math.floor(x / 32),
          tileY = Math.floor(y / 32);
      let len = this.objects.length;
      while (len--){
        let o = this.objects[len];
        let oTX = Math.floor(o.x / 32),
          oTY = Math.floor(o.y / 32);
        if (verbose){
          console.log(o.name, o.x, o.y);
        console.log(tileX, tileY, oTX, oTY);
        }
        if (tileX === oTX && tileY === oTY){
          return o;
        }
      }
      return null;
    }
  });
}

function waitForKeys(scn, fns) {
  let counter = 0;
  scn.paused = true;
  loop();
  function loop() {
    counter++;
    if (interactKey.isDown && counter > 100 && 'A' in fns) {
      scn.paused = false;
      return fns["A"]();
    }
    if (XKey.isDown && counter > 100 && 'X' in fns) {
      scn.paused = false;
      return fns["X"]();
    }
    if (YKey.isDown && counter > 100 && 'Y' in fns) {
      scn.paused = false;
      return fns["Y"]();
    }
    if (BKey.isDown && counter > 100 && 'B' in fns) {
      scn.paused = false;
      return fns["B"]();
    }
    setTimeout(loop, 0);
  }
}