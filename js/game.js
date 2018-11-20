---
---

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
  scene: [scene_start]
};

const game = new Phaser.Game(config);
