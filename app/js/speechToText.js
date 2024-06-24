const speechButton = document.getElementById('voiceButton');

const speechStart = document.getElementById('startSpeech');
const speechEnd = document.getElementById('endSpeech');

const chathistory = document.getElementsByClassName("chat-history");
// const outputText = document.getElementById('speechOnput');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition);

recognition.lang = 'nl-NL';
// recognition.interimResults = true;
recognition.continuous = true;

speechEnd.style.display = "none";

let transcript;


recognition.onresult = function (event) {
    transcript = event.results[0][0].transcript;
    console.log(transcript);
    // output.innerText = " " + transcript;
    newSpeechMessage(transcript);
}

recognition.onend = function () {
    speechStart.style.display = "block";
    speechEnd.style.display = "none";
}

speechButton.addEventListener('mousedown', function () {
    if (recognition.recording) {
        speechStart.style.display = "block";
        speechEnd.style.display = "none";

    } else {
        recognition.start();
        speechStart.style.display = "none";
        speechEnd.style.display = "block";
        // outputText.textContent = "...";


    }
});

speechButton.addEventListener('mouseup', function () {

    recognition.stop();
    speechStart.style.display = "block";
    speechEnd.style.display = "none";
})

function CreateTranslatedMessage(text){
  const translationMessageDiv = document.createElement("div");
  const translationMessageLabel = document.createElement("label");
  translationMessageDiv.classList.add("message");
  translationMessageDiv.classList.add("left");
  translationMessageLabel.classList.add("translation-label");
  translationMessageLabel.innerText = text;
  chatHistory.appendChild(translationMessageDiv);
  translationMessageDiv.appendChild(translationMessageLabel);
  speakText(text); // Speak the text when it's generated
}




// Text-to-speech functionality
const synth = window.speechSynthesis;
let isMuted = false;

const speakerButton = document.getElementById('speakerButton');
const unmutedIcon = document.getElementById('unmutedIcon');
const mutedIcon = document.getElementById('mutedIcon');

speakerButton.addEventListener('click', () => {
  isMuted = !isMuted;
  if (isMuted) {
      unmutedIcon.style.display = 'none';
      mutedIcon.style.display = 'block';
  } else {
      unmutedIcon.style.display = 'block';
      mutedIcon.style.display = 'none';
  }
  console.log('Mute state:', isMuted);
});

function speakText(text) {
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'nl-NL';
    utterance.rate = 0.5; 
    synth.speak(utterance);
}
