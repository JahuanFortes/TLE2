const trainButton = document.getElementById("trainButton");
const trainListener = trainButton.addEventListener("click", fetchJSONData);
const exportButton = document.getElementById("exportButton");
const exportListener = exportButton.addEventListener("click", exportModel);
const nn = ml5.neuralNetwork({ task: 'classification', debug: true})

function fetchJSONData() {
    fetch("data.json")
        .then((res) => res.json())
        .then((data) => trainNN(data))
        .catch((error) => console.error("Unable to fetch data:", error));
}
fetchJSONData();
let completeData = []
function trainNN(data){
    for (const [key, value] of Object.entries(data)) {
        let entries = Object.values(value);
        for(let i = 0; i < entries[1].length; i++){
            completeData.push({sign: entries[1][i], label: entries[0]});
        }
      }
      completeData.sort(() => (Math.random() - 0.5));
      const train = completeData.slice(0, Math.floor(completeData.length * 0.8));
      console.log(train);
      for(let i = 0; i < train.length; i++){
        nn.addData(train[i].sign, {label: train[i].label});
      }
      startTraining();
    }
function startTraining(){
    nn.normalizeData()
    nn.train({ epochs: 500, learningRate: 1  }, () => finishedTraining()) 
}
async function finishedTraining(){
    console.log("Finished training!");
    makePrediction();
}
async function makePrediction(){
    let correctpredictions = 0;
    let totaltestposes = 0;
    completeData.sort(() => (Math.random() - 0.5));
    let test = completeData.slice(Math.floor(completeData.length * 0.8) + 1);
    console.log(test);
    for(let i = 0;  i < test.length; i++){
        totaltestposes++;
        const prediction = await nn.classify(test[i].sign)
        if(prediction[0].label == test[i].label){
            correctpredictions++
        }
    }
    console.log(correctpredictions);
    console.log(totaltestposes);
    let accuracy = correctpredictions / totaltestposes
    console.log(accuracy);
}
function exportModel(){
    nn.save("model", () => console.log("model was saved!"));
}