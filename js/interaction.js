---
---

let spokenTo = {};
let inventory = {};

function fadeTransition(scn, time, new_scn) {
  scn.cameras.main.fade(time, 0, 0, 0, false, function (c, p) {
    if (p > 0.9) {
      scn.scene.start(new_scn)
    }
  });
}

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
                fadeTransition(scene, 1000, "scene_projector");
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
                "You feel dizzy.",
              ],
              function () {
                fadeTransition(scene, 2000, "scene_city");
              })
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
    if ("Person--city" in spokenTo) {
      speak(scene,
        ["This person doesn't seem interested in talking anymore."]);
      return;
    }
    speak(scene,
      [
        "It's so noisy here.",
        "There's so much traffic all the time.",
        "No one smiles when they walk by.",
        "They just all rush to wherever they're going.",
        "You hear a loud yell.",
        "Would it kill them to say hi?",
        "Who would want to live in a place like this?",
        "Not me.",
        "I've had enough.",
        "Sorry.",
        "I know I'm rambling.",
        "A car rushes by.",
        "You're just the first person to talk to me in a while.",
        "It's been lonely.",
        "I thought it would be different.",
        "They made it sound so cool, so exciting.",
        "And it was, at first.",
        "I wanted to get away.",
        "But I want to go back now.",
        "To where you came from. We come from the same place, I think.",
        "There's just something about you that feels...",
        "I don't really know how to describe it.",
        "Real?",
        "Someone falls off their bike.",
        "A crowd begins to gather.",
        "Cause you see it, don't you?",
        "It's falling apart.",
        "It's all talk.",
        "That's all there is anymore.",
        "The person looks to the side.",
        "Do you want to keep listening?",
        "X: Yes, Y: No"
      ],
      function () {
        waitForKeys(scene, {
          "X": function () {
            speechThreshold = 70;
            speak(scene, [
              "It's kind of you to stay.",
              "I don't mean to drone on and on about myself.",
              "It's just, that's all I've had for so long now.",
              "Someone walks through the parking lot.",
              "It's like, they all see me, but they don't see me.",
              "You know what I mean?",
              "I've tried driving away.",
              "I always end up back here. I don't know how. Or why.",
              "It just happens. It doesn't make any sense.",
              "A car runs a red light. People yell.",
              "Whatever. I'll keep trying.",
              "Thanks for keeping me company.",
              "If you find out how to make it back, I'd love to know.",
              "The person falls silent.",
              "Take this key. It's to my apartment here.",
              "I don't think I could go back.",
              "Back there, anyway.",
              "You take the key."
            ], function(){
              spokenTo["Person--city"] = true;
              inventory["Key--city"] = true;
            });
          },
          "Y": function () {
            speak(scene, [
              "Sorry.",
              "Didn't mean to keep you so long.",
              "Have a good one.",
              "It's about time you head back.",
              "The person falls silent."
            ], function(){
              fadeTransition(scene, 2000, "scene_projector");
            })
          }
        })
      })
  },
  /* Beach */
  "Person--beach": function (scene) {
    speak(scene, [

    ]);
  }
};

let bubbleMessages = {
  "scene_start": [
    "Where is this?",
    "You've been here before.",
    "You've seen these steps before."
  ],
  "scene_projector": [
    "It's eerily quiet in here.",
    "Where did all the people go?",
    "Don't remember this room being here.",
    "Aren't there other rooms in this building?",
    "It smells faintly like a hospital.",
    "Where's the furniture?"
  ],
  "scene_city": [
    "How long are they going to honk? It's not like it's doing anything.",
    "There are so many people here.",
    "This is a little overwhelming.",
    "You don't miss driving through the city.",
    "It's hard to walk through all these people.",
    "How tall are these buildings?",
    "So much smog..."
  ]
}
