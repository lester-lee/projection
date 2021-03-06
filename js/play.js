---
---

let width = 640;
let height = 640;

document.getElementById("SpeechBox").style.width = (width-200) + "px";

const config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
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
  scene: [scene_start, scene_mountain, scene_beach, scene_city, scene_projector, scene_ending]
};

const game = new Phaser.Game(config);
