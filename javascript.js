// --- OBJECT-ORIENTED PROGRAMMING (OOP) CLASSES ---

class Question {
    constructor(text, options, correctAnswer) {
        this.text = text;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
    isCorrect(choice) {
        return choice === this.correctAnswer;
    }
}

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.index = 0;
        this.score = 0;
    }
    getCurrentQuestion() {
        return this.questions[this.index];
    }
    hasEnded() {
        return this.index >= this.questions.length;
    }
    guess(choice) {
        if (this.getCurrentQuestion().isCorrect(choice)) {
            this.score++;
        }
        this.index++;
    }
    reset() {
        this.index = 0;
        this.score = 0;
    }
}

// --- DATASETS ---
const quizData = {
    science: [
        new Question("What planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter"], "Mars"),
        new Question("What gas do plants absorb?", ["Oxygen", "Carbon Dioxide", "Nitrogen"], "Carbon Dioxide"),
        new Question("What is H2O commonly known as?", ["Water", "Salt", "Hydrogen"], "Water")
    ],
    history: [
        new Question("Who was the first US President?", ["Lincoln", "Washington", "Jefferson"], "Washington"),
        new Question("In what year did WWII end?", ["1940", "1945", "1950"], "1945"),
        new Question("The ancient city of Rome was built on how many hills?", ["5 hills", "7 hills", "10 hills"], "7 hills")
    ]
};

let currentQuiz = null;

// --- APP LOGIC ---

function startQuiz(topic) {
    currentQuiz = new Quiz(quizData[topic]);
    switchScreen('quiz-screen');
    renderQuestion();
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function renderQuestion() {
    if (currentQuiz.hasEnded()) {
        document.getElementById('final-score').textContent = `You scored ${currentQuiz.score} out of ${currentQuiz.questions.length}`;
        switchScreen('results-screen');
        return;
    }

    const q = currentQuiz.getCurrentQuestion();
    document.getElementById('counter').textContent = `Question ${currentQuiz.index + 1} of ${currentQuiz.questions.length}`;
    document.getElementById('question-text').textContent = q.text;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = option;
        btn.onclick = () => handleAnswer(option, btn);
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selectedOption, selectedBtn) {
    const q = currentQuiz.getCurrentQuestion();
    const allBtns = document.querySelectorAll('#options-container .btn');

    // Disable buttons so user can't spam click
    allBtns.forEach(b => b.disabled = true);

    // Visual feedback requirement (Green for correct, Red for incorrect)
    if (q.isCorrect(selectedOption)) {
        selectedBtn.classList.add('correct');
    } else {
        selectedBtn.classList.add('incorrect');
        // Highlight the correct one
        allBtns.forEach(b => {
            if (b.textContent === q.correctAnswer) b.classList.add('correct');
        });
    }

    // Pause for 1 second, then move to next question
    setTimeout(() => {
        currentQuiz.guess(selectedOption);
        renderQuestion();
    }, 1000);
}

function goHome() {
    if (currentQuiz) currentQuiz.reset();
    switchScreen('home-screen');
}