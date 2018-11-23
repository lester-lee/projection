---
---

let player;
let showDebug = false;
let cursors;
let interactKey;
let justInteracted = false;
let interactTime;
let interactThreshold = 3000;

function createScene(tileset_url, map_json, Tiledset_name, scene_name) {
  return new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
      Phaser.Scene.call(this, scene_name);
      this.objects;
      this.map;
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
      this.map = this.make.tilemap({
        key: scene_name + "map"
      });

      // Parameters: (Tiled tileset name, Phaser cache in preload)
      const tileset = this.map.addTilesetImage(Tiledset_name, scene_name + "tiles");

      // Parameters: (Tiled layer name, tileset, x, y)
      const belowLayer = this.map.createStaticLayer("Below", tileset, 0, 0);
      const worldLayer = this.map.createStaticLayer("World", tileset, 0, 0);
      const aboveLayer = this.map.createStaticLayer("Above", tileset, 0, 0);

      worldLayer.setCollisionByProperty({
        collides: true
      });
      aboveLayer.setDepth(10);

      // Find "Spawn" object from Tiled
      const spawnPoint = this.map.findObject("Objects", obj => obj.name === "Spawn");

      // Get objects from Tiled
      this.objects = this.map.objects[0].objects;

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
      camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

      // Create object for arrow keys
      cursors = this.input.keyboard.createCursorKeys();

      // Debug graphics
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

      // Set up interact key
      interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    },
    wake: function () {
      // idk what this does
    },
    update: function (time, delta) {
      // Runs once per frame for the scene
      const speed = 175;
      controls = cursors;
      if (time - interactTime > interactThreshold){
        justInteracted = false;
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

        // Interaction
        if (!justInteracted && 
            Phaser.Input.Keyboard.JustDown(interactKey)) {
          this.checkInteraction(player);
          justInteracted = true;
          interactTime = time;
          // console.log(interactTime);
        }
        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);
      }      
    },
    getObject: function (playerDir) {
      let idx = this.objects.length;
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
      while (idx--) {
        elem = this.objects[idx];
        // console.log(ox,oy, elem);
        difx = ox - elem.x;
        dify = oy - elem.y;
        if (0 <= difx && difx <= 17 &&
          0 <= dify && dify <= 17) {
          return elem;
        }
      }
      return null;
    },
    checkInteraction: function () {
      let playerDir = player.anims.currentAnim.key;
      // console.log(playerDir);
      obj = this.getObject(playerDir);
      // console.log(obj);
      if (obj) {
        this.interact(obj);
      }
    },
    interact: function (obj) {
      gameInteractions[obj.name](this);
    }
  });
}