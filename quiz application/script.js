const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
      "Hyper Text Markup Language",
      "Hyper Tool Multi Language"
    ],
    correct: "Hyper Text Markup Language"
  },
  {
    question: "Which language is used for styling web pages?",
    answers: ["HTML", "JQuery", "CSS", "XML"],
    correct: "CSS"
  },
  {
    question: "Which is not a JavaScript Framework?",
    answers: ["React", "Angular", "Vue", "C++"],
    correct: "C++"
  },
  {
    question: "Which is used to connect database in PHP?",
    answers: ["mysqli_connect()", "connect_db()", "db_connect()", "mysql_open()"],
    correct: "mysqli_connect()"
  }
];

let currentIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 60;

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("next-btn");
const timerEl = document.getElementById("timer");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  startQuiz();
});

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});

function startQuiz() {
  currentIndex = 0;
  score = 0;
  scoreEl.textContent = "Score: 0";
  nextBtn.textContent = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  startTimer();
  const currentQuestion = questions[currentIndex];
  questionEl.textContent = currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.addEventListener("click", () => selectAnswer(btn, currentQuestion.correct));
    answerButtons.appendChild(btn);
  });
}

function resetState() {
  feedbackEl.textContent = "";
  answerButtons.innerHTML = "";
  nextBtn.classList.add("hidden");
  stopTimer();
  timeLeft = 60;
  timerEl.textContent = `⏳ ${timeLeft}`;
}

function selectAnswer(button, correctAnswer) {
  const selected = button.textContent;
  const buttons = answerButtons.querySelectorAll("button");

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
  });

  if (selected === correctAnswer) {
    correctSound.play();
    feedbackEl.textContent = "✅ Correct!";
    score++;
    scoreEl.textContent = `Score: ${score}`;
  } else {
    wrongSound.play();
    feedbackEl.textContent = `❌ Wrong! Correct: ${correctAnswer}`;
  }

  stopTimer();
  nextBtn.classList.remove("hidden");
}

function autoSelectCorrect(correctAnswer) {
  const buttons = answerButtons.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
  });
  feedbackEl.textContent = `⌛ Time's up! Correct: ${correctAnswer}`;
  nextBtn.classList.remove("hidden");
}

function endQuiz() {
  resetState();
  questionEl.textContent = "🎉 Quiz Completed!";
  feedbackEl.textContent = `Final Score: ${score}/${questions.length}`;
  nextBtn.textContent = "Restart";
  nextBtn.classList.remove("hidden");
  nextBtn.onclick = () => {
    startQuiz();
  };
  if (score === questions.length) {
    launchConfetti();
  }
}

function startTimer() {
  timerEl.textContent = `⏳ ${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏳ ${timeLeft}`;
    if (timeLeft <= 0) {
      stopTimer();
      const correct = questions[currentIndex].correct;
      autoSelectCorrect(correct);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function launchConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.3, 0.7), y: Math.random() - 0.2 }
    }));
  }, 250);
}