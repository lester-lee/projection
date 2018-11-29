---
---

const gameInteractions = {
  "Speech_bubble": function (scene) {
    speakBubble(scene);
  },
  /* Start map */
  "Door--start": function (scene) {
    speak(scene,
      ["The door looms before you.",
        "You're not sure how long this building has been here.",
        "Will you try going inside?",
        "X: Yes Y: No"
      ],
      function () {
        waitForKeys(scene, {
          "X": function () {
            ageSpeech();
            renderSpeech();
            speak(scene,
              ["You reach for the doorknob.",
                "It sticks for a bit, but it turns.",
                "The door opens with a creak."
              ],
              function () {
                scene.cameras.main.fade(500);
                scene.scene.start("scene_projector");
              });
          },
          "Y": function () {
            console.log("game over");
          }
        });
      });
  },
  "Pillar--start": function (scene) {
    speak(scene,
      [
        "It's made of stone.",
        "The inscriptions are long faded.",
        "You can't make out any of it."
      ]);
  },
  /* Projection Room */
  "Projection_chair": function (scene) {
    speak(scene,
      ["It's a chair.",
        "It looks quite comfy."
      ]);
  },
  "Door--projection": function (scene) {
    speak(scene,
      ["The doorknob rattles, but it won't turn.",
        "Looks like you're stuck here."
      ]);
  },
  "Projector": function (scene) {
    speak(scene,
      ["It's a projector.",
        "It's on, but nothing's being shown right now.",
        "You notice some buttons on the side.",
        "Do you want to press one?",
        "X: Yes, Y: No"
      ],
      function () {
        waitForKeys(scene, {
          "X": function () {
            ageSpeech();
            renderSpeech();
            speak(scene,
              ["The projector hums.",
                "You feel dizzy",
              ],
              function () {
                scene.cameras.main.fade(5000);
                scene.scene.start("scene_city");
              });
          },
          "Y": function () {
            console.log("game over");
          }
        });
      });
  },
  /* City */
  "Car": function (scene) {
    speak(scene,
      ["It's a sedan."]);
  },
  "Door--city": function (scene) {
    speak(scene,
      ["The door's locked.",
        "Makes sense.",
        "This isn't your apartment, after all."
      ]);
  },
  "Person--city": function (scene) {
    speak(scene, 
      [
        "yo"
      ])
  }
};