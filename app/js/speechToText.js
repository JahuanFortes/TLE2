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


function newSpeechMessage(text){
    let messageLeft = document.createElement('div');
    messageLeft.classList.add("message");
    messageLeft.classList.add("left");

    let lableMessage = document.createElement('label');
    lableMessage.htmlFor='speechOnput';
    lableMessage.classList.add("translation-label");
    lableMessage.textContent = ":";

    let output = document.createElement('span');
    output.classList.add("translation-text");
    output.id='speechOnput';

    output.textContent =  text;

    messageLeft.appendChild(lableMessage);
    messageLeft.appendChild(output);

    chathistory[0].appendChild(messageLeft)
}