---
---

let freshMessages = [];
let staleMessages = [];
let archivedMessages = [];
let archiveLimit = 100;

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
    "When did you learn how to drive?",
    "It's hard to walk through all these people.",
    "How tall are these buildings?",
    "So much smog..."
  ]
}

function sendSpeech(msg) {
  freshMessages.push(msg);
}

function speak(scn, msgs, callback) {
  let idx = 0;
  let counter = 0;
  scn.paused = true;
  // Send first message
  ageSpeech();
  sendSpeech(msgs[idx++]);
  renderSpeech();
  // Wait for button press to send next messages
  loop();
  function loop(){
    counter++;
    if (idx < msgs.length){
      if (interactKey.isDown && counter > 100){
        sendSpeech(msgs[idx++]);
        renderSpeech();
        counter = 0;
      }
      setTimeout(loop, 0);
    }
    else{
      scn.paused = false;
      // console.log("done!");
      if (callback){
        callback();
      }
    }
  }
}

function speakBubble(scn) {
  let possible_messages = bubbleMessages[scn.scene.key];
  speak(scn, [
    possible_messages[Math.floor(Math.random() * possible_messages.length)]
  ]);
}

function clearSpeech() {
  freshMessages = [];
  staleMessages = [];
}

function ageSpeech() {
  // archive oldest stale message
  if (staleMessages[0] != null) {
    archivedMessages.unshift(staleMessages.pop());
  }

  // dump messages over limit
  var aLen = archivedMessages.length;
  while (aLen > archiveLimit) {
    archivedMessages.pop();
    aLen--;
  }

  // move fresh messages to stale
  while (freshMessages[0] != null) {
    staleMessages.unshift(freshMessages.shift());
  }
}

function clearSpeechBox() {
  let speechBox = document.getElementById("SpeechBox");
  while (speechBox.lastChild) {
    speechBox.removeChild(speechBox.lastChild);
  }
}

function createSpan(msg, isFresh) {
  spanClass = isFresh ? "--fresh" : "--stale";
  let newSpan = document.createElement("span");
  newSpan.textContent = msg;
  newSpan.classList.add(spanClass);
  return newSpan;
}

function renderSpeech() {
  let flen = freshMessages.length;
  let slen = staleMessages.length;
  let speechBox = document.getElementById("SpeechBox");
  let span, msg;
  clearSpeechBox();
  for (let fdx = flen - 1; fdx > -1; fdx--) {
    msg = freshMessages[fdx];
    span = createSpan(msg, true);
    speechBox.appendChild(span);
  }
  for (let sdx = 0; sdx < slen; sdx++) {
    msg = staleMessages[sdx];
    span = createSpan(msg, false);
    speechBox.appendChild(span);
  }
}