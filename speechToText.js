const speechButton = document.getElementById('startButton');
const outputText = document.getElementById('input');
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition);

recognition.lang = 'nl-NL';
recognition.interimResults = true;


recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
    outputText.innerText = " " + transcript;
}

recognition.onend = function() {
    speechButton.style.display = "block";
}

speechButton.addEventListener('click', function() {
    if (recognition.recording) {
        setTimeout(() => {
            recognition.stop();
        }, 9000);
        speechButton.style.display = "block";
    } else {
        recognition.start();
        speechButton.style.display = "none";
        outputText.textContent = "...";
    }
});

