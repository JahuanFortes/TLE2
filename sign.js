import { GestureRecognizer,FilesetResolver,DrawingUtils,PoseLandmarker} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
  
  const demosSection = document.getElementById("demos");
  let gestureRecognizer = GestureRecognizer;
  let runningMode = "IMAGE";
  let enableWebcamButton = HTMLButtonElement;
  let webcamRunning = false;
  // const videoHeight = "360px";
  // const videoWidth = "480px";
  let explanationSection = document.getElementById("explanation");
  let predictionSection = document.getElementById("prediction");
  let prediction = document.createElement("h3");
  let collectorTimer = 0;
  let dataArray = [];
const nn = ml5.neuralNetwork({ task: 'classification', debug: true })
const modelDetails = {
    model: '../model/model.json',
    metadata: '../model/model_meta.json',
    weights: '../model/model.weights.bin'
}
nn.load(modelDetails, () => console.log("het model is geladen!"))
function fetchJSONData() {
    fetch("../data.json")
        .then((res) => res.json())
        .then((data) => appInit(data))
        .catch((error) => console.error("Unable to fetch data:", error));
}
fetchJSONData();

const chatHistory = document.getElementById('history');
function CreateTranslatedMessage(text){
  const translationMessageDiv = document.createElement("div");
const translationMessageLabel = document.createElement("label");
  translationMessageDiv.classList.add("message");
  translationMessageDiv.classList.add("right");
  translationMessageLabel.classList.add("translation-label");
  translationMessageLabel.innerText = text;
  chatHistory.appendChild(translationMessageDiv);
  translationMessageDiv.appendChild(translationMessageLabel);
}
function appInit(data){
  /*
    let keys = Object.keys(data);
    let explanationText = document.createElement("p");
    let explanationBR = document.createElement("br");
    explanationText.innerText = "Deze website probeert te raden welke letter jij gebaart.";
    explanationSection.appendChild(explanationText);
    /*
    let ul = document.createElement("ul");
    ul.classList.add("list-group");
    ul.classList.add("list-group-flush");
    explanationSection.appendChild(ul);
    for (const key of keys){
        console.log(key);
        let item = document.createElement("li");
        item.innerText = key;
        item.classList.add("list-group-item");
        ul.appendChild(item);
    }
    */


}
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
    //enableWebcamButton.innerText = "ENABLE PREDICTIONS";
  } else {
    webcamRunning = true;
    //enableWebcamButton.innerText = "DISABLE PREDICTIONS";
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
    await gestureRecognizer.setOptions({ runningMode: "VIDEO", numHands: 1 });
  }
  let nowInMs = Date.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    results = gestureRecognizer.recognizeForVideo(video, nowInMs);
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  const drawingUtils = new DrawingUtils(canvasCtx);

  // canvasElement.style.height = videoHeight;
  // webcamElement.style.height = videoHeight;
  // canvasElement.style.width = videoWidth;
  // webcamElement.style.width = videoWidth;
  //console.log(results.landmarks);
  if (results.landmarks.length > 0) {
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
 
  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }
  //Landmarks
  if (results.landmarks.length > 0) {
    checkPose(results.landmarks);
  }
  async function checkPose(landmarks) {
    if(landmarks != null){
      if(collectorTimer < 50){
        for(const landmark of landmarks){
            for (let i in landmark){
                dataArray.push(landmark[i].x, landmark[i].y, landmark[i].z);
            }
        }
        collectorTimer++;
      } else {
        //console.log(dataArray);
        collectorTimer = 0;
        let predictionResult = await nn.classify(dataArray);
        console.log(predictionResult);
        if(typeof predictionResult !== undefined){
          dataArray = [];
        }
        const label = predictionResult[0].label;
        prediction.innerText = `Ik denk dat jij ${label} gebaart!`;
        //predictionSection.appendChild(prediction);
        console.log("Your label is " + label);
        CreateTranslatedMessage(label);
      }
    }
  }

}
