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
  /* Mountain */
  "Person--mountain": function (scene) {
    speak(scene, ['Hey!', 'Nice to meet you.', 'It’s good to see another face around here.', 'Not many people hike up here in the winter.', 'The mountain is still.', 'It’s mighty cold, isn’t it?', 'I like it, though.', 'I try to come at least once a week, if not more often.', 'Depends on my schedule, but I try to make time.', 'Being up here makes me feel so alive.', 'The mountain is still.', 'Sometimes I like to bring my dog with me, but today she didn’t look like she wanted to trudge through the snow.', 'I don’t blame her.', 'I’m a little surprised you made it all the way up, what with the snowstorm that just blew by.', 'Me? I’m used to it.', 'A little snow can’t stop me.', 'The person smiles.', 'I guess it didn’t stop you, either.', 'The mountain is still.', 'I can’t remember the first time I hiked up here.', 'You would think that the first time coming up a mountain like this would be unforgettable, but here I am, having forgotten it.', 'That’s alright.', 'It just makes each time that much better.', 'You should come back in the fall, right when the leaves start changing.', 'It’s a beautiful sight. Makes me excited just thinking about it.', 'The person leans back and stretches their arms, their breath hanging in the air.', 'You want some hot chocolate?', 'X: Yes, Y: No'],
    function() {
      waitForKeys(scene, {
        "X": function() {
          ageSpeech();
          renderSpeech();
          speak(scene, ['Sweet!', 'Why don’t you head inside and make yourself comfortable?', 'I’ll be in right after you.', 'I just want to enjoy the view for a little longer.', 'The person falls silent.', 'The mountain is still.'],
          function(){
            spokenTo["Person--mountain"] = true;
            inventory["Key"] = true;
          });
        },
        "Y": function() {
          speak(scene, [
            "Oh, that's alright.",
            "Didn't mean to chatter away like that.",
            "The person falls silent.",
            "You feel dizzy."
          ], function() {
            fadeTransition(scene, 2000, "scene_ending");
          })
        }
      })
    });
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
