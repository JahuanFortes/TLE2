const speechButton = document.getElementById('voiceButton');

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
    outputText.innerText = " " + transcript;
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

