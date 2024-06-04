let slideIndex = 1;
window.addEventListener('load', function (slideIndex) {
  showSlides(slideIndex);
})

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slides");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

// div slider
let slideIndex2 = 1;
showDivs(slideIndex2);

function plusDivs(n) {
  showDivs(slideIndex2 += n);
}

function showDivs(n) {
  let i;
  let x = document.getElementsByClassName("my-slides");
  if (n > x.length) { slideIndex2 = 1 }
  if (n < 1) { slideIndex2 = x.length };
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex2 - 1].style.display = "block";
}



// speech function 
const speechButton = document.getElementById('voiceButton');

const speechStart = document.getElementById('startSpeech');
const speechEnd = document.getElementById('endSpeech');

const outputText = document.getElementById('input');
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition);

recognition.lang = 'nl-NL';
recognition.interimResults = true;
recognition.continuous = true;

speechEnd.style.display = "none";



console.log("deze code wordt gelden")



recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript;
  console.log(transcript);
  outputText.innerText = " " + transcript;
}

speechButton.addEventListener('mousedown', function () {
  if (!recognition.recording) {
    recognition.start();
    outputText.textContent = "...";
  } 
});

speechButton.addEventListener('mouseup', function () {

  recognition.stop();
})

