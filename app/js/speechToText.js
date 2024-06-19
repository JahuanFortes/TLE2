const speechButton = document.getElementById('voiceButton');
const chatHistory = document.getElementById('history');
const speechStart = document.getElementById('startSpeech');
const speechEnd = document.getElementById('endSpeech');

const outputText = document.getElementById('input');
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition);

recognition.lang = 'nl-NL';
recognition.interimResults = true;
recognition.continuous = true;

speechEnd.style.display = "none";

recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
    if(transcript != ""){
      CreateTranslatedMessage(transcript);
    }
    //outputText.innerText = " " + transcript;
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
        outputText.textContent = "...";
    }
});

speechButton.addEventListener('mouseup', function () {

    recognition.stop();
    speechStart.style.display = "block";
    speechEnd.style.display = "none";
})





const synth = window.speechSynthesis;

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt");

const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

let voices = [];
const defaultVoiceName = "Google Nederlands"; // Set your desired voice name here

function populateVoiceList() {
  voices = synth.getVoices().sort((a, b) => {
    const aname = a.name.toUpperCase();
    const bname = b.name.toUpperCase();
    return aname.localeCompare(bname);
  });
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }

  if (inputTxt.value !== "") {
    const utterThis = new SpeechSynthesisUtterance(inputTxt.value);

    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    // Find and set the default voice
    const selectedVoice = voices.find(voice => voice.name === defaultVoiceName);
    if (selectedVoice) {
      utterThis.voice = selectedVoice;
    }

    utterThis.pitch = 1
    utterThis.rate = 0.9
    synth.speak(utterThis);
  }
}
/*
inputForm.onsubmit = function (event) {
  event.preventDefault();
  speak();
  inputTxt.blur();
};
*/
function CreateTranslatedMessage(text){
  const translationMessageDiv = document.createElement("div");
  const translationMessageLabel = document.createElement("label");
  translationMessageDiv.classList.add("message");
  translationMessageDiv.classList.add("left");
  translationMessageLabel.classList.add("translation-label");
  translationMessageLabel.innerText = text;
  chatHistory.appendChild(translationMessageDiv);
  translationMessageDiv.appendChild(translationMessageLabel);
}
// pitch.onchange = function () {
//   pitchValue.textContent = pitch.value;
// };

// rate.onchange = function () {
//   rateValue.textContent = rate.value;
// };
