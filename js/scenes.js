---
---
var scene_start = createScene(
    "{{site.baseurl}}/assets/tilesets/map_start.png",
    "{{site.baseurl}}/assets/maps/map--start.json",
    "map_start_tileset"
    );
scene_start.initialize = function scene_start() {
    Phaser.Scene.call(this, "scene_start");
    this.player;
    this.cursors;
};