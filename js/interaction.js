---
---

const gameInteractions = {
  "Door--start": function (scene) {
    speak(scene, [
      "The door looms before you.",
      "The paint looks aged.",
      "Will you try going inside?",
      "Yeah Lorem ipsum",
      "you know it baby",
      "ehre's a lot of text ooo boy",
      "whatup in the club",
      "yoasdafsd"
    ],
    function() {
      ageSpeech();
      renderSpeech();
      scene.scene.start("scene_projector");
      speak(scene, [
        "The door looms before you.",
        "The paint looks aged.",
        "Will you try going inside?",
        "Yeah Lorem ipsum",
        "you know it baby",
        "ehre's a lot of text ooo boy this one here is a lrasdfdsf really long line yeah it is",
        "whatup in the club",
        "yoasdafsd"
      ])
    });
  }
};