---
---

const gameInteractions = {
  "Door--start": function (scene) {
    speak(scene,
      ["The door looms before you.",
        "You're not sure how long this building has been here.",
        "Will you try going inside?",
        "A: Yes B: No"
      ],
      function () {
        waitForKeys(scene, {
          "interact": function () {
            ageSpeech();
            renderSpeech();
            speak(scene,
              ["You reach for the doorknob.",
                "It sticks for a bit, but it turns.",
                "The door opens with a creak."
              ], function () {
                scene.cameras.main.fade(500);
                scene.scene.start("scene_projector");
              });
          },
          "cancel": function () {
            console.log("game over");
          }
        });
      });
  },
  "Projection_chair": function (scene) {
    console.log("hm");
    speak(scene,
      ["It's a chair.",
        "It looks quite comfy."]);
  }
};