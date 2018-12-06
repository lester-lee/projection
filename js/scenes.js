---
---
var scene_start = createScene(
    "{{site.baseurl}}/assets/tilesets/map_start.png",
    "{{site.baseurl}}/assets/maps/map_start.json",
    "map_start_tileset",
    "scene_start"
    );

var scene_projector = createScene(
    "{{site.baseurl}}/assets/tilesets/map_projection.png",
    "{{site.baseurl}}/assets/maps/map_projection.json",
    "map_projection_tileset",
    "scene_projector"
    );

var scene_city = createScene(
  "{{site.baseurl}}/assets/tilesets/map_city.png",
  "{{site.baseurl}}/assets/maps/map_city.json",
  "map_city_tileset",
  "scene_city"
);

var scene_beach = createScene(
  "{{site.baseurl}}/assets/tilesets/map_beach.png",
  "{{site.baseurl}}/assets/maps/map_beach.json",
  "map_beach_tileset",
  "scene_beach"
);

var scene_mountain = createScene(
  "{{site.baseurl}}/assets/tilesets/map_mountain.png",
  "{{site.baseurl}}/assets/maps/map_mountain.json",
  "map_mountain_tileset",
  "scene_mountain"
);

var scene_ending = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function() {
    Phaser.Scene.call(this, "scene_ending");
    this.spoken = false;
  },
  preload: function(){
    // Load tiles
    this.load.image("scene_ending_tiles", "{{site.baseurl}}/assets/tilesets/map_projection.png");
    this.load.tilemapTiledJSON("scene_ending_map", "{{site.baseurl}}/assets/maps/map_ending.json");
  },
  create: function() {
    const map = this.make.tilemap({
      key: "scene_ending_map"
    });
    const tileset = map.addTilesetImage("map_projection_tileset", "scene_ending_tiles");
    // console.log(map, tileset);
    // Parameters: (Tiled layer name, tileset, x, y)
    const belowLayer = map.createStaticLayer("Below", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    aboveLayer = map.createDynamicLayer("Above", tileset, 0, 0);

    // Set up camera
    const camera = this.cameras.main;
    // Set camera bounds
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.centerOn(352, 352);

    // Set up interact key
    interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
  },
  update: function(time, delta){
    if (!this.spoken){
      this.spoken = true;
      speak(this, [
      "...",
      "Please put the controller down."
    ], function () {
      setTimeout(function () {
        location.reload();
      }, 10000);
    });
    }
  }
});