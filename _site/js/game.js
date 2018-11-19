const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 640,
  parent: "GameContainer",
  pixelArt: true,
  forceSingleUpdate: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0
      }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let cursors;
let wasd;
let player;
let showDebug = false;

function preload() {
  // Runs once before game starts to load assets

  // Load tiles
  this.load.image("test-tiles", "/assets/tilesets/map_start.png");
  this.load.tilemapTiledJSON("test-map-1", "/assets/maps/map--start.json");

  // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
  // the player animations (walking left, walking right, etc.) in one image. For more info see:
  //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
  // If you don't use an atlas, you can do the same thing with a spritesheet, see:
  //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
  this.load.atlas("atlas", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.png", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.json");
}

function create() {
  // Runs once, after preload finishes

  // Load map
  const map = this.make.tilemap({
    key: "test-map-1"
  });

  // Parameters: (Tiled tileset name, Phaser cache in preload)
  const tileset = map.addTilesetImage("map_start_tileset", "test-tiles");

  // Parameters: (Tiled layer name, tileset, x, y)
  const belowLayer = map.createStaticLayer("Below", tileset, 0, 0);
  const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  const aboveLayer = map.createStaticLayer("Above", tileset, 0, 0);

  worldLayer.setCollisionByProperty({
    collides: true
  });
  aboveLayer.setDepth(10);

  // Find "Spawn" object from Tiled
  const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn");

  // Create a sprite with physics enabled via the physics system. The image used for the sprite has
  // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
  player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);

  this.physics.add.collider(player, worldLayer);

  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  const anims = this.anims;
  anims.create({
    key: "misa-left-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-left-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-right-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-right-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-front-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-front-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-back-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-back-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
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
  // Similarly for wasd
  wasd = this.input.keyboard.addKeys({
    'up': Phaser.Input.Keyboard.KeyCodes.W,
    'down': Phaser.Input.Keyboard.KeyCodes.S,
    'left': Phaser.Input.Keyboard.KeyCodes.A,
    'right': Phaser.Input.Keyboard.KeyCodes.D,
  });

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
}

function update(time, delta) {
  // Runs once per frame for the scene
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();
  controls = cursors;

  // Stop previous movement
  player.body.setVelocity(0);

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

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (controls.left.isDown) {
    player.anims.play("misa-left-walk", true);
  } else if (controls.right.isDown) {
    player.anims.play("misa-right-walk", true);
  } else if (controls.up.isDown) {
    player.anims.play("misa-back-walk", true);
  } else if (controls.down.isDown) {
    player.anims.play("misa-front-walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
    else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
    else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
    else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
  }
}
