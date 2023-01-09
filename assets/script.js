//questions & answer choices
const questions = [
    {
      questionContent: "What is the output of this code: console.log(typeofNaN)",
      choices: [
        "1. NaN", 
        "2. Number", 
        "3. Null", 
        "4. Undefined"
      ],
      answer: "2. Number",
    },
   
    {
      questionContent: "What is the output of this code: console.log(typeof typeof 1);",
      choices: [
        "1. String",
        "2. Number",
        "3. 1",
        "4. True",
      ],
      answer: "1. String",
    },
   
    {
      questionContent: "Inside which HTML element do we put the Javascript?",
      choices: [
        "1. js tag", 
        "2. javascript tag", 
        "3. script tag", 
        "4. scripting tag"
      ],
      answer: "3. script tag",
    },
    
    {
      questionContent: "How does a FOR loop begin?",
      choices: [
        "1. for (i=0; i<=5; i++)",
        "2. for i=1 to 5",
        "3. for (loops)",
        "4. for [i=1 && i<5]",
      ],
      answer: "1. for (i=0; i<=5; i++)",
    },
    
    {
      questionContent:
        "Which event is specific to the keyboard?",
      choices: [
        "1. onclick", 
        "2. onfocus", 
        "3. onkeydown", 
        "4. onkeyboardpress"],
      answer: "3. onkeydown",
    },
  ];
  
const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const highScoreCard = document.querySelector("#highscore-card");
  
//set all cards to hidden
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  highScoreCard.setAttribute("hidden", true);
}

const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");

//hide results
function hideResultText() {
  resultDiv.style.display = "none";
}

//set global variables
var currentQuestion;
var time;
var intervalID;

document.querySelector("#start-button").addEventListener("click", startQuiz);

function startQuiz() {
  //hide visible cards; display question card
  hideCards();

  questionCard.removeAttribute("hidden");

  currentQuestion = 0;
  displayQuestion();

  time = questions.length * 10;

  intervalID = setInterval(countdown, 1000);
  displayTime();
}

//begin count down
function countdown() {
  time--;
  displayTime();
  //end the quiz if time runs out
  if (time < 1) {
    endQuiz();
  }
}

//display time
const timeDisplay = document.querySelector("#time");
function displayTime() {
  timeDisplay.textContent = time;
}

function displayQuestion() {
  let question = questions[currentQuestion];
  let choices = question.choices;

  let questionElement = document.querySelector("#question-content");
  questionElement.textContent = question.questionContent;

  for (let i = 0; i < choices.length; i++) {
    let choice = choices[i];
    let choiceButton = document.querySelector("#choice" + i);
    choiceButton.textContent = choice;
  }
}

//checks answer upon click
document.querySelector("#answer-choices").addEventListener("click", checkAnswer);

//validate answer choice
function choiceIsCorrect(choiceButton) {
  return choiceButton.textContent === questions[currentQuestion].answer;
}

//time penalty for incorrect answer selection
function checkAnswer(eventObject) {
  let choiceButton = eventObject.target;
  resultDiv.style.display = "block";
  if (choiceIsCorrect(choiceButton)) {
    resultText.textContent = "CORRECT.";
    setTimeout(hideResultText, 1500);
  } 
  else {
    resultText.textContent = "INCORRECT!";
    setTimeout(hideResultText, 1500);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } 
    //once time hits 0, end the quiz
    else {
      time = 0;
      displayTime();
      endQuiz();
    }
  }

  //move to next question
  currentQuestion++;
  if (currentQuestion < questions.length) {
    displayQuestion();
  } 
  else {
    endQuiz();
  }
}

//display score
const score = document.querySelector("#score");

function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

const submitButton = document.querySelector("#submit-button");

const inputInitials = document.querySelector("#initials");

submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  event.preventDefault();
  if (!inputInitials.value) {
    alert("Invalid Response. Enter initials in textbox.");
    return;
  }
  let highScoreItem = {
    initials: inputInitials.value,
    score: time,
  };
  updateStoredHighScore(highScoreItem);
  hideCards();
  highScoreCard.removeAttribute("hidden");
  renderHighScore();
}

//update High Score
function updateStoredHighScore(highScoreItem) {
  let highScoreArray = getHighScore();
  //Add new high score
  highScoreArray.push(highScoreItem);
  localStorage.setItem("highScoreArray", JSON.stringify(highScoreArray));
}

//call for high score in local storage
function getHighScore() {
  let storedHighScore = localStorage.getItem("highScoreArray");
  if (storedHighScore !== null) {
    let highScoreArray = JSON.parse(storedHighScore);
    return highScoreArray;
  } 
  else {
    highScoreArray = [];
  }
  return highScoreArray;
}

//display high score
function renderHighScore() {
  let sortedHighScoreArray = sortHighScore();
  const highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < sortedHighScoreArray.length; i++) {
    let highScoreEntry = sortedHighScoreArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
      highScoreEntry.initials + ": " + highScoreEntry.score;
    highscoreList.append(newListItem);
  }
}

//sort scores from highest to lowest
function sortHighScore() {
  let highScoreArray = getHighScore();
  if (!highScoreArray) {
    return;
  }
  highScoreArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return highScoreArray;
}

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

//clear high scores
function clearHighscores() {
  localStorage.clear();
  renderHighScore();
}

//return to quiz
const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}

document.querySelector("#highscore-link").addEventListener("click", showHighScore);

function showHighScore() {
  hideCards();
  highScoreCard.removeAttribute("hidden");
  //stop countdown
  clearInterval(intervalID);
  time = undefined;
  displayTime();
  //display High Scores on HS card
  renderHighScore();
}