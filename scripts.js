// Select necessary DOM elements
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const workTimer = document.getElementById('work').querySelector('.timer');
const restTimer = document.getElementById('rest').querySelector('.timer');
const productivityNumber = document.getElementById('number');
const workSide = document.getElementById('work');
const restSide = document.getElementById('rest');

// Timer variables
let workTime = 0;
let restTime = 0;
let timerInterval = null;
let isRunning = false;
let isWorkTimerActive = true;

// Format time to HH:MM:SS
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [hours, minutes, remainingSeconds]
        .map(val => val.toString().padStart(2, '0'))
        .join(':');
}

// Update timer display
function updateTimerDisplay() {
    workTimer.textContent = formatTime(workTime);
    restTimer.textContent = formatTime(restTime);
    
    // Calculate and update productivity ratio
    const totalTime = workTime + restTime;
    const ratio = totalTime > 0 ? (workTime / totalTime).toFixed(2) : 0;
    productivityNumber.textContent = ratio;
}

// Start timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (isWorkTimerActive) {
                workTime++;
            } else {
                restTime++;
            }
            updateTimerDisplay();
        }, 1000);
    }
}

// Stop timer
function stopTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
    }
}

// Reset timer
function resetTimer() {
    stopTimer();
    workTime = 0;
    restTime = 0;
    isWorkTimerActive = true;
    updateTimerDisplay();
}

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

// Switch between work and rest timers
workSide.addEventListener('click', () => {
    if (isWorkTimerActive) return;
    stopTimer();
    isWorkTimerActive = true;
    startTimer();
});

restSide.addEventListener('click', () => {
    if (!isWorkTimerActive) return;
    stopTimer();
    isWorkTimerActive = false;
    startTimer();
});

// Initial display update
updateTimerDisplay();