
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from  "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import * as storage from './local-storage.js';

const submitHighScoreButton = document.body.querySelector("#submit-high-score");
const nameField = document.body.querySelector("#name-input");
const scoreList = document.body.querySelector("#high-score-content");
const hiddenSubmit = document.body.querySelector("#hidden");
const showHiScore = document.body.querySelector("#showHiScore");

const firebaseConfig = {
    apiKey: "AIzaSyC86_nxebzXq3V2wp-DNbcD982QvKvYtJ4",
    authDomain: "beat-master-highscores.firebaseapp.com",
    projectId: "beat-master-highscores",
    storageBucket: "beat-master-highscores.appspot.com",
    messagingSenderId: "342554971419",
    appId: "1:342554971419:web:56c5692899bc0ac5cf57be"
};

let highscores = [];
showHiScore.innerHTML = `Your Highest Score: ${storage.getHighScore()}`;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const scoresRef = ref(db, 'scores');

const writeHighScoreData = (userId,score) => {
    set(ref(db, 'scores/' + userId), {
      score
    });
};

//get the high scores stored on the database
const getHighScores = (snapshot) => {
    let temp = []
    snapshot.forEach(score => {

        temp.push([score.key,score.val().score]);
    });
    //sort the high score from highest to lowest
    highscores = temp;
    highscores.sort(function(a,b) {
        return b[1] - a[1];
    });
    displayHighScores();
}

//displays the top 5 high scores to the page
const displayHighScores = () => {
    let counter = 0;
    scoreList.innerHTML = "";
    for (const user of highscores) {
        if(counter === 5) return;

        let node = document.createElement('li');
        node.appendChild(document.createTextNode(`${user[0]}: ${user[1]}`));
        document.querySelector("#high-score-content").appendChild(node);
        counter++;
    }
}

//submits the user high score to the database when the button is clicked
submitHighScoreButton.onclick = () => {
    if(nameField.value.length === 0){
        alert("Please input a name before submitting");
        return;
    }
    writeHighScoreData(nameField.value,storage.getHighScore());
    hiddenSubmit.style.visibility = "visible";
};

//check for any changes to the object
onValue(scoresRef,getHighScores);
