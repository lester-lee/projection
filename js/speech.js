---
---
let freshMessages = [];
let staleMessages = [];
let archivedMessages = [];
let archiveLimit = 100;

function sendSpeech(msg){
  freshMessages.push(msg);
}

function clearSpeech(){
  freshMessages = [];
  staleMessages = [];
}

function ageSpeech(){
  // archive oldest stale message
  if (staleMessages[0] != null) {
    archivedMessages.unshift(staleMessages.pop());
  }

  // dump messages over limit
  var aLen = archivedMessages.length;
  while (aLen > archivedMessageLimit) {
    archivedMessages.pop();
    aLen--;
  }

  // move fresh messages to stale
  while (freshMessages[0] != null) {
    staleMessages.unshift(freshMessages.shift());
  }
}

function clearSpeechBox(){
  let speechBox = document.getElementById("DialogueBox");
  while (speechBox.lastChild){
    speechBox.removeChild(speechBox.lastChild);
  }
}

function createSpan(msg, isFresh){
  spanClass = isFresh ? "--fresh" : "--stale";
  let newSpan = document.createElement("span");
  newSpan.textContent = msg;
  newSpan.classList.add(spanClass);
  return newSpan;
}

function renderSpeech(){
  let flen = freshMessages.length;
  let slen = staleMessages.length;
  let speechBox = document.getElementById("DialogueBox");
  let span, msg;
  clearSpeechBox();
  for (let fdx = flen-1; f > -1; f--){
    msg = freshMessages[fdx];
    span = createSpan(msg,true);
    speechBox.appendChild(span);
  }
  for(let sdx = slen-1; s > -1; s--){
    msg = staleMessages[sdx];
    span = createSpan(msg, false);
    speechBox.appendChild(span);
  }
}