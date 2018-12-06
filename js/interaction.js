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
  "Debug--end": function (scene) {
    // fadeTransition(scene, 500, "scene_ending");
  },
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
            speak(scene, ["The door is still."], function () {
              justInteractedWith = "";
            });
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
        "You're sitting on it."
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
        "You notice some colored buttons on the side.",
        "You feel compelled to press one.",
        "X: Gray, Y: Red, A: Blue"
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
              });
          },
          "Y": function () {
            ageSpeech();
            renderSpeech();
            speak(scene,
              ["The projector hums.",
                "You feel dizzy.",
              ],
              function () {
                fadeTransition(scene, 2000, "scene_beach");
              });
          },
          "A": function () {
            ageSpeech();
            renderSpeech();
            speak(scene,
              ["The projector hums.",
                "You feel dizzy.",
              ],
              function () {
                fadeTransition(scene, 2000, "scene_mountain");
              });
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
    if ("Key" in inventory) {
      speak(scene, [
        "The key fits.",
        "You turn the knob and head inside."
      ], function () {
        fadeTransition(scene, 2000, "scene_ending");
      })
    } else {
      speak(scene,
        ["The door's locked.",
          "Makes sense.",
          "This isn't your apartment, after all."
        ]);
    }
  },
  "Person--city": function (scene) {
    if ("Person--city" in spokenTo) {
      speak(scene,
        ["This person doesn't seem interested in talking anymore."]);
      return;
    }
    speechThreshold = 120;
    speechRange =
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
              speechThreshold = 60;
              speechRange = 512;
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
              ], function () {
                spokenTo["Person--city"] = true;
                inventory["Key"] = true;
              });
            },
            "Y": function () {
              speak(scene, [
                "Sorry.",
                "Didn't mean to keep you so long.",
                "Have a good one.",
                "The person falls silent.",
                "You feel dizzy."
              ], function () {
                fadeTransition(scene, 2000, "scene_ending");
              });
            }
          })
        })
  },
  /* Beach */
  "Door--beach": function (scene) {
    if ("Key" in inventory) {
      speak(scene, [
        "The key fits.",
        "You turn the knob and head inside."
      ], function () {
        fadeTransition(scene, 2000, "scene_ending");
      });
    } else {
      speak(scene, ["The door is locked."]);
    }
  },
  "Window--beach": function (scene) {
    speak(scene, ["You try to look inside.",
      "You can't really make anything out."
    ]);
  },
  "Person--beach": function (scene) {
    if ("Person--beach" in spokenTo) {
      speak(scene,
        ["This person doesn't seem interested in talking anymore."]);
      return;
    }
    speak(scene, [
        "I've been here a while.",
        "Haven't caught anything, though.",
        "I don't really know what's swimming in these waters.",
        "I'll find out eventually.",
        "Water laps against the sand.",
        "I'm not in any hurry.",
        "I used to be so rushed all the time.",
        "Always feeling like I had to be doing something.",
        "Had to be productive.",
        "My hands had to be moving.",
        "Then I found my way here.",
        "A gull dives into the ocean.",
        "I don't really remember how.",
        "It's been so long.",
        "I like it here, though.",
        "It took me a while to adjust at first.",
        "The sky darkens as passing clouds block the sun.",
        "You don't see too many people around these parts.",
        "I'm not supposed to be here, I've been told.",
        "But nothing's happened to me yet, so here I am.",
        "Besides, it's nice here, isn't it?",
        "Sitting by the water.",
        "I can feel the sun, which is more than what I can say for where I used to be.",
        "Chains thud against the wooden dock.",
        "Just the waves to keep me company.",
        "And whatever I happen to catch.",
        "And you, if you'd like to stay.",
        "Do you want to keep listening?",
        "X: Yes, Y: No"
      ],
      function () {
        waitForKeys(scene, {
          X: function () {
            speechThreshold = 120;
            speechRange = 352;
            speak(scene, [
              "Maybe I'll catch something now that you're here.",
              "The person chuckles.",
              "I know I can't stay here forever.",
              "You see it too, don't you?",
              "I'm not too worried.",
              "I'm enjoying myself right now.",
              "A flock of ducks land on the water.",
              "I'll be okay.",
              "I don't mean to keep you too long.",
              "Thanks for listening.",
              "Here.",
              "You see that shack down there?",
              "You can have a key.",
              "It's a nice place.",
              "I think you'll like it.",
              "You take the key."
            ], function () {
              spokenTo["Person--beach"] = true;
              inventory["Key"] = true;
            });
          },
          Y: function () {
            speak(scene, [
              "Sorry.",
              "Didn't mean to keep you so long.",
              "Have a good one.",
              "The person falls silent.",
              "You feel dizzy."
            ], function () {
              fadeTransition(scene, 2000, "scene_ending");
            });
          }
        });
      });
  },
  "PalmTree": function (scene) {
    speak(scene, ["It's a palm tree."]);
  },
  /* Mountain */
  "Person--mountain": function (scene) {
    if ("Person--mountain" in spokenTo) {
      speak(scene,
        ["This person doesn't seem interested in talking anymore."]);
      return;
    }
    aboveLayer.putTileAtWorldXY(42, 480, 416);
    // Turn npc to face player
    speak(scene, ['Hey!', 'Nice to meet you.', 'It’s good to see another face around here.', 'Not many people hike up here in the winter.', 'The mountain is still.', 'It’s mighty cold, isn’t it?', 'I like it, though.', 'I try to come at least once a week, if not more often.', 'Depends on my schedule, but I try to make time.', 'Being up here makes me feel so alive.', 'The mountain is still.', 'Sometimes I like to bring my dog with me, but today she didn’t look like she wanted to trudge through the snow.', 'I don’t blame her.', 'I’m a little surprised you made it all the way up, what with the snowstorm that just blew by.', 'Me? I’m used to it.', 'A little snow can’t stop me.', 'The person smiles.', 'I guess it didn’t stop you, either.', 'The mountain is still.', 'I can’t remember the first time I hiked up here.', 'You would think that the first time coming up a mountain like this would be unforgettable, but here I am, having forgotten it.', 'That’s alright.', 'The mountain is still.', 'It just makes each time that much better.', 'You should come back in the fall, right when the leaves start changing.', 'It’s a beautiful sight. Makes me excited just thinking about it.', 'The person leans back and stretches their arms, their breath hanging in the air.', 'You want some hot chocolate?', 'X: Yes, Y: No'],
      function () {
        waitForKeys(scene, {
          "X": function () {
            speechThreshold = 20;
            speechRange = 448;
            ageSpeech();
            renderSpeech();
            speak(scene, ['Sweet!', 'Why don’t you go by the fire?', "I'll be right there.", 'I just want to enjoy the view for a little longer.', 'The person falls silent.', 'The mountain is still.'],
              function () {
                aboveLayer.putTileAtWorldXY(3, 480, 416);
                // Turn npc back
                spokenTo["Person--mountain"] = true;
                inventory["Key"] = true;
              });
          },
          "Y": function () {
            speak(scene, [
              "Oh, that's alright.",
              "Didn't mean to chatter away like that.",
              "The person falls silent.",
              "You feel dizzy."
            ], function () {
              fadeTransition(scene, 2000, "scene_ending");
            })
          }
        })
      });
  },
  "Fire": function (scene) {
    if ("Key" in inventory) {
      speak(scene, [
        "You stare at the embers.",
        "The flames flicker.",
        "You feel dizzy."
      ], function () {
        fadeTransition(scene, 2000, "scene_ending");
      });
    } else {
      speak(scene, ["It's warm by the fire."]);
    }
  }
};

let bubbleMessages = {
  "scene_start": [
    "Where is this?",
    "You've been here before.",
    "You've seen these steps before.",
    "It's a little bit chilly.",
    "There's something off about this place.",
    "You recognize the gate, but from where, you can't remember."
  ],
  "scene_projector": [
    "It's eerily quiet in here.",
    "Where did all the people go?",
    "You don't remember this room being here.",
    "Aren't there other rooms in this building?",
    "There's stuff up on the walls.",
    "Where's the furniture?",
    "Who set this up?",
    "There should be other chairs, shouldn't there?",
    "What's the projector doing here?"
  ],
  "scene_city": [
    "How long are they going to honk? It's not like it's doing anything.",
    "There are so many people here.",
    "This is a little overwhelming.",
    "You don't miss driving through the city.",
    "It's hard to walk through all these people.",
    "How tall are these buildings?",
    "So much smog...",
    "Aren't pigeons just rats with wings?",
    "These apartments must be so crowded.",
    "At least the corner stores are always open.",
    "The food carts are making you hungry.",
    "There's so much traffic.",
    "It's a surprise you haven't bumped into anyone yet.",
    "You wish you had headphones on.",
    "Rent must be so high.",
    "It smells a little dank.",
    "Did someone really just do that?",
    "The shadows of these buildings are so big."
  ],
  "scene_beach": [
    "The sand is warm beneath your feet.",
    "These palm trees are so tall.",
    "The air is salty.",
    "The sun shines brightly.",
    "It feels good to see the sun.",
    "Tiny crabs scurry along the sand.",
    "You can always hear the water.",
    "Do people really fish around here?",
    "Maybe you should've brought a beach towel.",
    "Who planted these bushes?",
    "The beach feels a little deserted.",
    "There's definitely no one playing volleyball here.",
    "Both water and sky are azure.",
    "It must be beautiful when the sun sets.",
    "Reading under a palm tree... ah.",
    "Are there clams here?",
    "You wonder what the weirdest thing to wash ashore is."
  ],
  "scene_mountain": [
    "The mountain is still."
  ]
}
