const gameInteractions = {
  "Door--start": function (scene) {
    speak(scene, [
      "The door looms before you.",
      "You're not sure how long this building has been here.",
      "Will you try going inside?",
      "A: Yes B: No"
    ],
    function() {
      waitForKeys(scene, {
        "interact": function () {
          ageSpeech();
          renderSpeech();
          scene.cameras.main.fade(500);
          scene.scene.start("scene_projector");
        },
        "cancel": function(){
          console.log("game over");
        }
      });
    });
  }
};