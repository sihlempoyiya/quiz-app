// Questions
let quizData = {
    science: [
        {text: "How many planets are in the solar sytem?", options: ["7", "8", "9", "10" ], answer: 1},
        {text: "What gas do plants take in?", options: ["Oxygen", "Nitrogen","Carbon Dioxide", "Helium"], answer: 2},
        {text: "What is H2O?", options: ["Salt","Water", "Sugar", "Air"], answer: 1}
    ],
    history: [
        {text: "Who was the first president of democratic South Africa?", options: ["Thabo Mbeki","Nelson Mandela","Jacob Zuma", "FW de Klerk"], answer: 1},
        {text: "In which year did World War II end?", options: ["1939", "1945", "1950", "1918"], answer: 1},
        {text: "Which people built the pyramids of Giza?", options: ["Romans", "Greeks","Egyptians", "Aztecs"], answer: 2}
    ]
};

// Quiz class
class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.current = 0;
        this.score = 0;
        this.chosen = [];
        }
    
    getQuestion() {
        return this.questions[this.current];
    }

    answer(index) {
        this.chosen.push(index);
        if (index === this.getQuestion().answer) {
            this.score = this.score + 1;
        }
    }

    next() {
        this.current = this.current + 1;
    }

    isOver() {
        return this.current >= this.questions.length;
    }

    percentage() {
        return Math.round((this.score / this.questions.length) * 100);
    }
}

//Page elements
let homeScreen = document.getElementById("home-screen");
let quizScreen = document.getElementById("quiz-screen");
let resultScreen = document.getElementById("results-screen");

let counter = document.getElementById("counter");
let scoreDisplay = document.getElementById("score-display");
let progressBar = document.getElementById("progress-bar");
let questionText = document.getElementById("question-text");
let optionsContainer = document.getElementById("options-container");
let nextBtn = document.getElementById("next-btn");

let scoreText = document.getElementById("score-text");
let percentText = document.getElementById("percent-text");
let reviewBox = document.getElementById("review");

let quiz;
let topic;

//Functions 
function showScreen(screen) {
    homeScreen.classList.remove("active");
    quizScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    screen.classList.add("active");
}

function startQuiz(chosenTopic) {
    topic = chosenTopic;
    quiz = new Quiz(quizData[topic]);
    showQuestion();
}

function showQuestion() {
    let q = quiz.getQuestion();
    let total = quiz.questions.length;
    
    showScreen(quizScreen);
    counter.innerText = "Question " + (quiz.current + 1) + " of " + total;
    scoreDisplay.innerText = "Score: " + quiz.score;
    progressBar.style.width = (quiz.current / total * 100) + "%";
    questionText.innerText = q.text;
    nextBtn.style.display = "none";
    optionsContainer.innerHTML = "";

    for (let i=0; i < q.options.length; i++) {
        let button = document.createElement("button");
        button.className = "option";
        button.innerText = q.options[i];
        button.onclick = function() {
            pickAnswer(i);
        };
        optionsContainer.appendChild(button);
    }
    }

    function pickAnswer(index) {
        let q = quiz.getQuestion();
        quiz.answer(index);

        let buttons = optionsContainer.getElementsByTagName("button");
        for (let i=0; i < buttons.length; i++) {
            buttons[i].disabled = true;
            if (i === q.answer) {
                buttons[i].classList.add("correct");
            }
            if (i === index && i !== q.answer) {
                buttons[i].classList.add("wrong");
            }
        }

        scoreDisplay.innerText = "Score: " + quiz.score;

        if (quiz.current === quiz.questions.length - 1) {
            nextBtn.innerText = "See Results";
        } else {
            nextBtn.innerText = "Next";
        }
        nextBtn.style.display = "inline-block";
    }

    function nextQuestion() {
        quiz.next();
        if (quiz.isOver()) {
            showResults();
        } else {
            showQuestion();
        }
    }

    // results screen
    function showResults() {
        scoreText.innerText = "You scored " + quiz.score + " out of " + quiz.questions.length;
        percentageText.innerText = quiz.percentage() + "%";
        reviewBox.innerHTML = "";

        for (let i=0; i < quiz.questions.length; i++) {
            let q = quiz.questions[i];
            let picked = quiz.chosen[i];
            let item = document.createElement("div");

            let text = (i + 1) + ". " + q.text + "<br> Your answer: " + q.options[picked];

            if (picked === q.answer) {
                item.className = "review-item right";
            } else {
                item.className = "review-item wrong-item";
                text = text + "<br> Correct answer: " + q.options[q.answer];
            }

            item.innerHTML = text;
            reviewBox.appendChild(item);
        }

        showScreen(resultScreen);
    }
    function restartQuiz() {
        startQuiz(topic);
    }

    function goHome() {
        showScreen(homeScreen);
    }
