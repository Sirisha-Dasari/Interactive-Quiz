const quizData = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Multi Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
        ],
        correct: 0
    },
    {
        question: "Which property is used to change the background color in CSS?",
        options: [
            "color",
            "bgcolor",
            "background-color",
            "bg-color"
        ],
        correct: 2
    },
    {
        question: "Which JavaScript method is used to access an HTML element by id?",
        options: [
            "getElementById()",
            "querySelector()",
            "getElementsByClassName()",
            "innerHtml()"
        ],
        correct: 0
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Computer Style Sheets",
            "Creative Style Sheets",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: [
            "Venus",
            "Mars",
            "Jupiter",
            "Saturn"
        ],
        correct: 1
    },
    {
        question: "What is the chemical symbol for gold?",
        options: [
            "Go",
            "Gd",
            "Au",
            "Ag"
        ],
        correct: 2
    },
    {
        question: "What is the capital of Japan?",
        options: [
            "Beijing",
            "Seoul",
            "Tokyo",
            "Bangkok"
        ],
        correct: 2
    },
    {
        question: "Which ocean is the largest?",
        options: [
            "Atlantic Ocean",
            "Indian Ocean",
            "Arctic Ocean",
            "Pacific Ocean"
        ],
        correct: 3
    },
    {
        question: "Who painted the Mona Lisa?",
        options: [
            "Vincent van Gogh",
            "Pablo Picasso",
            "Leonardo da Vinci",
            "Michelangelo"
        ],
        correct: 2
    },
    {
        question: "Which is the smallest prime number?",
        options: [
            "0",
            "1",
            "2",
            "3"
        ],
        correct: 2
    }
];

const csQuizData = {
    easy: [
        {
            question: "What does CPU stand for?",
            options: [
                "Central Processing Unit",
                "Computer Personal Unit",
                "Central Process Unit",
                "Central Processor Unit"
            ],
            correct: 0
        },
      
    ],
    medium: [
        {
            question: "Which data structure uses LIFO?",
            options: [
                "Queue",
                "Stack",
                "Linked List",
                "Tree"
            ],
            correct: 1
        },
     
    ],
    hard: [
        {
            question: "What is the worst-case time complexity of quicksort?",
            options: [
                "O(n)",
                "O(n²)",
                "O(log n)",
                "O(n log n)"
            ],
            correct: 1
        },
        
    ]
};


const difficultyContainer = document.getElementById('difficulty-container');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const difficultyDisplay = document.getElementById('difficulty-display');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const questionNumber = document.getElementById('question-number');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const restartButton = document.getElementById('restart-btn');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const totalQuestionsElement = document.getElementById('total-questions');
const resultMessageElement = document.getElementById('result-message');
const progressBar = document.getElementById('progress');
const timerDisplay = document.getElementById('timer-display');
const timerProgress = document.getElementById('timer-progress');
const playerNameInput = document.getElementById('player-name');
const saveScoreBtn = document.getElementById('save-score-btn');
const viewHighScoresBtn = document.getElementById('view-high-scores');
const highScoresOverlay = document.getElementById('high-scores-overlay');
const highScoresList = document.getElementById('high-scores-list');
const closeHighScoresBtn = document.getElementById('close-high-scores');
const clearHighScoresBtn = document.getElementById('clear-high-scores');
const tabButtons = document.querySelectorAll('.tab-btn');


let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = [];
let currentQuestions = [];
let usedQuestionIndices = { easy: [], medium: [], hard: [] };
let currentDifficulty = '';
let timerInterval;
let timeLeft = 0;
let userAnswers = [];
let apiQuestions = { easy: [], medium: [], hard: [] };

function init() {
    if (highScoresOverlay) {
        highScoresOverlay.classList.add('hide');
    }
    setupEventListeners();
}

function setupEventListeners() {
    if (difficultyButtons) {
        difficultyButtons.forEach(button => {
            button.onclick = function() {
                currentDifficulty = button.id;
                startQuizWithDifficulty(currentDifficulty);
            };
        });
    }
    
    if (nextButton) {
        nextButton.onclick = handleNextButton;
    }
    
    if (prevButton) {
        prevButton.onclick = handlePrevButton;
    }
    
    if (restartButton) {
        restartButton.onclick = handleRestartButton;
    }
    
    if (viewHighScoresBtn) {
        viewHighScoresBtn.addEventListener('click', showHighScores);
    }
    
    if (closeHighScoresBtn) {
        closeHighScoresBtn.onclick = function() {
            if (highScoresOverlay) {
                highScoresOverlay.classList.add('hide');
            }
        };
    }
    
    if (clearHighScoresBtn) {
        clearHighScoresBtn.addEventListener('click', clearHighScores);
    }
    
    if (saveScoreBtn) {
        saveScoreBtn.addEventListener('click', saveHighScore);
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const difficulty = button.dataset.difficulty;
            selectTab(button);
            displayHighScores(difficulty);
        });
    });
}

async function startQuizWithDifficulty(difficulty) {
    difficultyContainer.classList.add('hide');
    difficultyDisplay.textContent = `Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
    difficultyDisplay.className = difficulty;
    difficultyDisplay.classList.remove('hide');
    
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = [];
    userAnswers = [];
    
    try {
        currentQuestions = await getUniqueQuestions(difficulty, 10);
        
        if (currentQuestions.length < 10) {
            await fetchMoreQuestions(difficulty);
            currentQuestions = await getUniqueQuestions(difficulty, 10);
        }
        
        for (let i = 0; i < currentQuestions.length; i++) {
            answeredQuestions[i] = false;
            userAnswers[i] = null;
        }
        
        questionContainer.classList.remove('hide');
        resultContainer.classList.add('hide');
        restartButton.classList.add('hide');
        
        nextButton.classList.add('hide');
        prevButton.classList.add('hide');
        
        scoreElement.innerText = score;
        updateProgressBar();
        updateQuestionNumber();
        
        setQuestion(currentQuestionIndex);
        
        document.body.className = '';
        document.body.classList.add('quiz-active', difficulty);
    } catch (error) {
        showErrorMessage('Failed to start quiz. Please try again.');
    }
}

async function getUniqueQuestions(difficulty, count) {
    let allQuestions = [...csQuizData[difficulty], ...apiQuestions[difficulty]];
    let availableIndices = [];

    for (let i = 0; i < allQuestions.length; i++) {
        if (!usedQuestionIndices[difficulty].includes(i)) {
            availableIndices.push(i);
        }
    }

    if (availableIndices.length < count) {
        if (availableIndices.length < count && allQuestions.length < 30) {
            await fetchMoreQuestions(difficulty);
            allQuestions = [...csQuizData[difficulty], ...apiQuestions[difficulty]];

            availableIndices = [];
            for (let i = 0; i < allQuestions.length; i++) {
                if (!usedQuestionIndices[difficulty].includes(i)) {
                    availableIndices.push(i);
                }
            }
        }

        if (availableIndices.length < count) {
            usedQuestionIndices[difficulty] = [];
            availableIndices = Array.from({ length: allQuestions.length }, (_, i) => i);
        }
    }

    availableIndices = shuffleArray(availableIndices);
    const selectedIndices = availableIndices.slice(0, count);
    usedQuestionIndices[difficulty].push(...selectedIndices);

    return selectedIndices.map(index => allQuestions[index]);
}

async function fetchMoreQuestions(difficulty) {
    try {
        const apiDifficulty = difficulty === 'medium' ? 'medium' : (difficulty === 'hard' ? 'hard' : 'easy');

        const response = await fetch(`https://opentdb.com/api.php?amount=10&category=18&difficulty=${apiDifficulty}&type=multiple`);
        const data = await response.json();

        if (data.response_code === 0 && data.results.length > 0) {
            const formattedQuestions = data.results.map(q => {
                const options = [...q.incorrect_answers, q.correct_answer];
                const shuffledOptions = shuffleArray(options);

                return {
                    question: decodeHtmlEntities(q.question),
                    options: shuffledOptions.map(opt => decodeHtmlEntities(opt)),
                    correct: shuffledOptions.indexOf(q.correct_answer)
                };
            });

            apiQuestions[difficulty] = [...apiQuestions[difficulty], ...formattedQuestions];
        }
    } catch (error) {
        console.warn(`Failed to fetch additional questions for ${difficulty} difficulty`);
    }
}

function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

function updateQuestionNumber() {
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
}

function setQuestion(index) {
    if (!currentQuestions || !currentQuestions[index]) {
        return;
    }
    
    resetState();
    showQuestion(currentQuestions[index]);
    updateNavButtons();
    updateProgressBar();
    updateQuestionNumber();
    
    if (!answeredQuestions[index]) {
        startTimer();
    } else {
        showPreviousAnswer(index);
    }
}

function updateNavButtons() {
    if (currentQuestionIndex === 0) {
        prevButton.classList.add('hide');
    } else {
        prevButton.classList.remove('hide');
    }
    
    if (answeredQuestions[currentQuestionIndex]) {
        nextButton.classList.remove('hide');
        
        if (currentQuestionIndex === currentQuestions.length - 1) {
            nextButton.innerText = 'See Results';
        } else {
            nextButton.innerText = 'Next';
        }
    } else {
        nextButton.classList.add('hide');
    }
}

function startTimer() {
    switch(currentDifficulty) {
        case 'hard':
            timeLeft = 25;
            break;
        case 'medium':
            timeLeft = 20;
            break;
        case 'easy':
        default:
            timeLeft = 15;
    }
    
    if (timerDisplay) {
        timerDisplay.textContent = timeLeft;
    }
    
    if (timerProgress) {
        timerProgress.style.width = '100%';
        timerProgress.className = '';
    }
    
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        if (timerDisplay) {
            timerDisplay.textContent = timeLeft;
        }
        
        if (timerProgress) {
            const percentage = (timeLeft / (currentDifficulty === 'hard' ? 25 : 
                                (currentDifficulty === 'medium' ? 20 : 15))) * 100;
            timerProgress.style.width = `${percentage}%`;
            
            if (timeLeft <= 5) {
                timerProgress.className = 'danger';
                if (timerDisplay) timerDisplay.className = 'danger';
            } else if (timeLeft <= 10) {
                timerProgress.className = 'warning';
                if (timerDisplay) timerDisplay.className = 'warning';
            }
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        }
    }, 1000);
}

function resetState() {
    const feedback = document.getElementById('feedback-container');
    if (feedback) {
        feedback.remove();
    }
    
    if (questionElement) {
        questionElement.classList.remove('question-animation');
        questionElement.style.display = 'block';
    }
    
    if (answerButtonsElement) {
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }
}

function showQuestion(question) {
    if (!question) {
        return;
    }
    
    if (questionElement) {
        questionElement.innerText = question.question;
        questionElement.classList.add('question-animation');
    }
    
    if (answerButtonsElement) {
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('btn');
            button.style.animationDelay = `${index * 0.1}s`;
            
            button.onclick = function() {
                selectAnswer(index);
            };
            
            answerButtonsElement.appendChild(button);
        });
    }
}

function selectAnswer(selectedIndex) {
    clearInterval(timerInterval);
    
    userAnswers[currentQuestionIndex] = selectedIndex;
    
    const correct = selectedIndex === currentQuestions[currentQuestionIndex].correct;
    
    if (correct) {
        score++;
        scoreElement.innerText = score;
    }
    
    if (!answerButtonsElement || !answerButtonsElement.children) {
        return;
    }
    
    const buttons = answerButtonsElement.children;
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        if (i === selectedIndex) {
            buttons[i].classList.add(correct ? 'correct' : 'wrong');
        }
        if (i === currentQuestions[currentQuestionIndex].correct) {
            buttons[i].classList.add('correct');
        }
    }
    
    const feedbackContainer = document.createElement('div');
    feedbackContainer.id = 'feedback-container';
    feedbackContainer.className = correct ? 'correct' : 'incorrect';
    
    const correctAnswer = currentQuestions[currentQuestionIndex].options[currentQuestions[currentQuestionIndex].correct];
    
    feedbackContainer.innerHTML = `
        <div id="feedback-message">${correct ? 'Correct!' : 'Incorrect!'}</div>
        <div id="feedback-explanation">${correct ? 
            'Great job! That\'s the right answer.' :
            `The correct answer was: ${correctAnswer}`}
        </div>
    `;
    
    questionContainer.appendChild(feedbackContainer);
    
    answeredQuestions[currentQuestionIndex] = true;
    
    updateNavButtons();
}

function handleTimeUp() {
    if (answerButtonsElement && answerButtonsElement.children) {
        const buttons = answerButtonsElement.children;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
            if (i === currentQuestions[currentQuestionIndex].correct) {
                buttons[i].classList.add('correct', 'time-up-highlight');
            }
        }
    }
    
    const feedbackContainer = document.createElement('div');
    feedbackContainer.id = 'feedback-container';
    feedbackContainer.className = 'incorrect';
    
    const correctAnswer = currentQuestions[currentQuestionIndex].options[currentQuestions[currentQuestionIndex].correct];
    
    feedbackContainer.innerHTML = `
        <div id="feedback-message">Time's Up!</div>
        <div id="feedback-explanation">The correct answer was: ${correctAnswer}</div>
    `;
    
    if (questionContainer) {
        questionContainer.appendChild(feedbackContainer);
    }
    
    answeredQuestions[currentQuestionIndex] = true;
    
    updateNavButtons();
}

function showPreviousAnswer(index) {
    const selectedAnswer = userAnswers[index];
    const correct = selectedAnswer === currentQuestions[index].correct;
    
    const buttons = answerButtonsElement.children;
    
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        
        if (i === selectedAnswer) {
            buttons[i].classList.add(correct ? 'correct' : 'wrong');
        }
        
        if (i === currentQuestions[index].correct) {
            buttons[i].classList.add('correct');
        }
    }
    
    const feedbackContainer = document.createElement('div');
    feedbackContainer.id = 'feedback-container';
    feedbackContainer.className = correct ? 'correct' : 'incorrect';
    
    const correctAnswer = currentQuestions[index].options[currentQuestions[index].correct];
    
    feedbackContainer.innerHTML = `
        <div id="feedback-message">${correct ? 'Correct!' : 'Incorrect!'}</div>
        <div id="feedback-explanation">${correct ? 
            'Great job! That\'s the right answer.' :
            `The correct answer was: ${correctAnswer}`}
        </div>
    `;
    
    questionContainer.appendChild(feedbackContainer);
}

function handleNextButton() {
    if (currentQuestionIndex === currentQuestions.length - 1 && answeredQuestions[currentQuestionIndex]) {
        showResults();
        return;
    }
    
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        setQuestion(currentQuestionIndex);
    }
}

function handlePrevButton() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        setQuestion(currentQuestionIndex);
    }
}

function handleRestartButton() {
    difficultyDisplay.classList.add('hide');
    resultContainer.classList.add('hide');
    difficultyContainer.classList.remove('hide');
    
    nextButton.innerText = 'Next';
    
    document.body.className = '';
    
    clearInterval(timerInterval);
}

function showErrorMessage(message) {
    let errorElement = document.getElementById('quiz-error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'quiz-error-message';
        errorElement.className = 'error-message';
        
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer) {
            quizContainer.prepend(errorElement);
        }
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }, 5000);
}

function updateProgressBar() {
    if (!progressBar || !currentQuestions || currentQuestions.length === 0) {
        return;
    }
    
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function showResults() {
    clearInterval(timerInterval);
    questionContainer.classList.add('hide');
    resultContainer.classList.remove('hide');
    nextButton.classList.add('hide');
    prevButton.classList.add('hide');
    restartButton.classList.remove('hide');
    
    finalScoreElement.innerText = score;
    totalQuestionsElement.innerText = currentQuestions.length;
    
    const percentage = (score / currentQuestions.length) * 100;
    resultMessageElement.innerText = getResultMessage(percentage);
    
    finalScoreElement.classList.add('pulse-animation');
}

function getResultMessage(percentage) {
    if (currentDifficulty === 'hard') {
        if (percentage >= 90) {
            return "Outstanding! You're a computer science expert!";
        } else if (percentage >= 70) {
            return "Impressive knowledge of advanced computer science concepts!";
        } else if (percentage >= 50) {
            return "Good job on these challenging questions!";
        } else {
            return "These were tough questions. Keep studying advanced topics!";
        }
    } else if (currentDifficulty === 'medium') {
        if (percentage >= 90) {
            return "Excellent! Your computer science knowledge is strong!";
        } else if (percentage >= 70) {
            return "Great job! You have solid understanding of programming concepts!";
        } else if (percentage >= 50) {
            return "Good effort! Keep strengthening your programming knowledge!";
        } else {
            return "Keep practicing! You'll master these concepts soon!";
        }
    } else { // easy
        if (percentage >= 90) {
            return "Perfect! You've mastered the fundamentals!";
        } else if (percentage >= 70) {
            return "Great job! Your computer basics are strong!";
        } else if (percentage >= 50) {
            return "Good start! Keep learning the basics!";
        } else {
            return "Keep studying the fundamentals and try again!";
        }
    }
}

function saveHighScore() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert("Please enter your name to save your score!");
        return;
    }
    
    let highScores = JSON.parse(localStorage.getItem(`highScores_${currentDifficulty}`)) || [];
    
    const newScore = {
        name: playerName,
        score: score,
        date: new Date().toLocaleDateString(),
        percentage: Math.round((score / currentQuestions.length) * 100)
    };
    
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10);
    
    localStorage.setItem(`highScores_${currentDifficulty}`, JSON.stringify(highScores));
    
    const saveScoreContainer = document.getElementById('save-score-container');
    saveScoreContainer.innerHTML = `<p class="score-saved">Your score has been saved!</p>`;
    
    setTimeout(() => {
        showHighScores();
        selectTab(document.querySelector(`.tab-btn[data-difficulty="${currentDifficulty}"]`));
        displayHighScores(currentDifficulty);
    }, 1000);
}

function displayHighScores(difficulty) {
    const highScores = JSON.parse(localStorage.getItem(`highScores_${difficulty}`)) || [];
    highScoresList.innerHTML = '';
    
    if (highScores.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" class="no-scores">No scores yet for ${difficulty} level</td>`;
        highScoresList.appendChild(row);
        return;
    }
    
    highScores.forEach((score, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${score.name}</td>
            <td>${score.score} (${score.percentage}%)</td>
            <td>${score.date}</td>
        `;
        highScoresList.appendChild(row);
    });
}

function showHighScores() {
    if (!highScoresOverlay) {
        return;
    }
    
    highScoresOverlay.classList.remove('hide');
    
    selectTab(document.querySelector('.tab-btn[data-difficulty="easy"]'));
    displayHighScores('easy');
    
    const closeBtn = document.getElementById('close-high-scores');
    if (closeBtn) {
        closeBtn.onclick = function() {
            highScoresOverlay.classList.add('hide');
            return false;
        };
    }
}

function clearHighScores() {
    const activeDifficulty = document.querySelector('.tab-btn.active').dataset.difficulty;
    
    if (confirm(`Are you sure you want to clear all high scores for ${activeDifficulty} level?`)) {
        localStorage.removeItem(`highScores_${activeDifficulty}`);
        displayHighScores(activeDifficulty);
    }
}

function selectTab(selectedTab) {
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    selectedTab.classList.add('active');
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

init();
