import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const demosSection = document.getElementById("demos");
let gestureRecognizer = GestureRecognizer;
let runningMode = "IMAGE";
let enableWebcamButton = HTMLButtonElement;
let webcamRunning = false;
const videoHeight = "360px";
const videoWidth = "480px";
let timeLog = false;
let time = setInterval(timer, 1000);
let recording = false;
let appended = false;
let currentSign = {
  label: "placeholder",
  data: []
}
const exportPoses = () => (
  Object.assign(document.createElement("a"), {
    href: `data:application/JSON, ${encodeURIComponent(
      JSON.stringify(
        Object.keys(localStorage).reduce(
          (obj, k) => ({ ...obj, [k]: JSON.parse(localStorage.getItem(k)) }),
          {}
        ),
        null,
        2
      )
    )}`,
    download: "data",
  }).click()
)

const recordingButton = document.getElementById("recordButton");
const recordingListener = recordingButton.addEventListener("click", setrecording);
const addButton = document.getElementById("addButton");
const addListener = addButton.addEventListener("click", addToLocalStorage);
const exportButton = document.getElementById("poseExport");
const exportListener = exportButton.addEventListener("click", exportPoses);
const loadButton = document.getElementById("poseLoad");
const loadListener = document.addEventListener("click", loadPoses);
let select = document.getElementById("poses");
let ShowingCords = false;
let recordsamplesize = 40;
function timer(){
    timeLog =! timeLog;
}
function setrecording(){
  recording = true;
}
function addToLocalStorage(){
  if(select.value == "placeholder"){
    let signLabel = document.getElementById('label');
    let label = signLabel.value;
    localStorage.setItem(label, JSON.stringify(currentSign));
  } else {
    localStorage.setItem(select.value, JSON.stringify(currentSign));
  }
}
function loadPoses(){
  const items = {...localStorage};
  //console.log(items);
  if(!appended){
  for (const [key, value] of Object.entries(items)) {
    console.log(key);
    let option = document.createElement("option");
    option.text = key;
    option.value = key;
    
    select.appendChild(option);
  }
  appended = true;
}
}
console.log(recording);
console.log(timeLog);

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU"
    },
    runningMode: runningMode
  });
  demosSection.classList.remove("invisible");
};
createGestureRecognizer();


/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam(event) { 
  if (!gestureRecognizer) {
    alert("Please wait for gestureRecognizer to load");
    return;
  }

  if (webcamRunning === true) {
    webcamRunning = false;
    enableWebcamButton.innerText = "ENABLE PREDICTIONS";
  } else {
    webcamRunning = true;
    enableWebcamButton.innerText = "DISABLE PREDICTIONS";
  }

  // getUsermedia parameters.
  const constraints = {
    video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

let lastVideoTime = -1;
let results = undefined;
async function predictWebcam() {
  const webcamElement = document.getElementById("webcam");
  // Now let's start detecting the stream.
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await gestureRecognizer.setOptions({ runningMode: "VIDEO", numHands: 2 });
  }
  let nowInMs = Date.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    results = gestureRecognizer.recognizeForVideo(video, nowInMs);
  }
/*
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  const drawingUtils = new DrawingUtils(canvasCtx);

  canvasElement.style.height = videoHeight;
  webcamElement.style.height = videoHeight;
  canvasElement.style.width = videoWidth;
  webcamElement.style.width = videoWidth;

  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        GestureRecognizer.HAND_CONNECTIONS,
        {
          color: "#00FF00",
          lineWidth: 5
        }
      );
      drawingUtils.drawLandmarks(landmarks, {
        color: "#FF0000",
        lineWidth: 2
      });
    }
  }
 
  canvasCtx.restore();
  */
  if (results.gestures.length > 0) {
    gestureOutput.style.display = "block";
    gestureOutput.style.width = videoWidth;
    const categoryName = results.gestures[0][0].categoryName;
    const categoryScore = parseFloat(
      results.gestures[0][0].score * 100
    ).toFixed(2);
    const handedness = results.handednesses[0][0].displayName;
    gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
  } else {
    gestureOutput.style.display = "none";
  }
  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }
  let cleandata = [];
  //Landmarks
  if (results.landmarks && timeLog) {
    if(results.landmarks.length != 0){
    console.log(results.landmarks);
    }
    for(let i = 0; i < results.landmarks.length; i++)
    {
      cleandata.push(results.landmarks[0][i].x, results.landmarks[0][i].y, results.landmarks[0][i].z);
      if(results.landmarks[1]){
        cleandata.push(results.landmarks[1][i].x, results.landmarks[1][i].y, results.landmarks[1][i].z);
      }
      timeLog = false;
    }
    if(recording && cleandata.length != 0){
      recordPose(cleandata);
    };
    
  }
  function recordPose(arr) {
    console.log("test");
    if(currentSign.data.length<recordsamplesize){
      currentSign.data.push(arr)
      console.log("Fuck");
    }
    else
    {
      console.log("Finished recording");
      console.log(select.value);
      if(select.value == "placeholder"){
      let signLabel = document.getElementById('label');
      let label = signLabel.value;
      currentSign.label = label;
      } else{
        currentSign.label = select.value;
      }
      recording = false;
    }
  }
}
