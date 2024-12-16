// Select necessary DOM elements
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const workTimer = document.getElementById('work').querySelector('.timer');
const restTimer = document.getElementById('rest').querySelector('.timer');
const productivityNumber = document.getElementById('number');
const workSide = document.getElementById('work');
const restSide = document.getElementById('rest');

// Timer variables
let workTime = Number(localStorage.getItem('workTime')) || 0;
let restTime = Number(localStorage.getItem('restTime')) || 0;
let isWorkTimerActive = localStorage.getItem('isWorkTimerActive') === 'false' ? false : true;
let lastTimestamp = localStorage.getItem('lastTimestamp');
let isRunning = false;

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

    // Save to localStorage
    localStorage.setItem('workTime', workTime);
    localStorage.setItem('restTime', restTime);
    localStorage.setItem('isWorkTimerActive', isWorkTimerActive);
}

// Start timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        lastTimestamp = Date.now();
        localStorage.setItem('lastTimestamp', lastTimestamp);

        // Update the timer periodically
        requestAnimationFrame(updateTime);
    }
}

// Stop timer
function stopTimer() {
    if (isRunning) {
        isRunning = false;
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - lastTimestamp) / 1000);
        if (isWorkTimerActive) {
            workTime += elapsedSeconds;
        } else {
            restTime += elapsedSeconds;
        }
        localStorage.removeItem('lastTimestamp');
        updateTimerDisplay();
    }
}

// Update the time continuously
function updateTime() {
    if (!isRunning) return;

    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - lastTimestamp) / 1000);
    if (isWorkTimerActive) {
        workTimer.textContent = formatTime(workTime + elapsedSeconds);
    } else {
        restTimer.textContent = formatTime(restTime + elapsedSeconds);
    }

    requestAnimationFrame(updateTime);
}

// Reset timer
function resetTimer() {
    stopTimer();
    workTime = 0;
    restTime = 0;
    isWorkTimerActive = true;
    updateTimerDisplay();
}

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

// Restore timer on page load
if (lastTimestamp) {
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - lastTimestamp) / 1000);
    if (isWorkTimerActive) {
        workTime += elapsedSeconds;
    } else {
        restTime += elapsedSeconds;
    }
    updateTimerDisplay();
    if (isRunning) {
        startTimer();
    }
}

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

// Initial display update
updateTimerDisplay();
