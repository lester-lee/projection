---
---

let freshMessages = [];
let staleMessages = [];
let archivedMessages = [];
let archiveLimit = 100;

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