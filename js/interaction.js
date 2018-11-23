---
---

const gameInteractions = {
  "Door--start": function (scene) {
    speak(scene, [
      "The door looms before you.",
      "The paint looks aged.",
      "Yeah Lorem ipsum",
      "you know it baby",
      "ehre's a lot of text ooo boy",
      "whatup in the club",
      "Will you try going inside?",
      "A: Yes B: No"
    ],
    function() {
      waitForKeys(scene, {
        "interact": function () {
          ageSpeech();
          renderSpeech();
          scene.scene.start("scene_projector");
        },
        "cancel": function(){
          console.log("game over");
        }
      });
    });
  }
};