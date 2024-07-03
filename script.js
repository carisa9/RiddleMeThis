const riddles = [

    { 
        answer: "larceny", 
        riddle: "Nearly fail to arrest criminal leader for petty crime (7)", 
        hint: "The word fail suggest that a word didn't get arranged properly. 'Petty crime' is the definitional part of this riddle" 
    },
    { 
        answer: "unclad", 
        riddle: "Dad's brother didn't finish commercial and is still not dressed (6)", 
        hint: "The wordplay part of this clue is 'Dad's brother didnt finish commercial'" 
    },
    { 
        answer: "stonehenge", 
        riddle: "English monument gets stuffed, with single layer inside (10)", 
        hint: " Think of 'layer' as a word decribing the job and object does. The wordplay part of this riddle is 'stuffed withsingle layer inside' " 
    },
    { 
        answer: "fair", 
        riddle: "Just for show", 
        hint: "A word that means both 'just' and 'show'" 
    },
    { 
        answer: "unclad", 
        riddle: "Dad's brother didn't finish commercial and is still not dressed (6)", 
        hint: "The wordplay part of this clue is 'Dad's brother didnt finish commercial'" 
    },
    { 
        answer: "scents", 
        riddle: "Recognises smell, hearing, sight taste, or touch? (6)", 
        hint: "The definition part of this riddle is 'recognises smell'" 
    },
    { 
        answer: "perfume", 
        riddle: "Fragrance for each vaporous emission (7)", 
        hint: "The wordplay is in 'for each' and 'vaporous emission'" 
    },
    { 
        answer: "goblin", 
        riddle: "Almost lose sight of bugbear (6)", 
        hint: "The wordplay part of this clue is 'almost lose sight' where almost indicates an unfinished word or phrase. The definition is 'bugbear'" 
    },
    { 
        answer: "oedipus", 
        riddle: "Complex character first seen in pseudo complex (7)", 
        hint: "The wordplay part of this clue is 'Dad's brother didnt finish commercial'" 
    },


];

let currentRiddleIndex = 0;
const inputBoxes = document.getElementById('input-boxes');
const submitBtn = document.getElementById('submit-btn');
const revealLetterBtn = document.getElementById('reveal-letter-btn');
const checkAnswerBtn = document.getElementById('submit-btn');
const triesCounter = document.getElementById('tries-counter');
const hintButton = document.getElementById('hint-button');
const hintPopup = document.getElementById('hint-popup');
const hintContent = document.getElementById('hint-content');
const closeHintBtn = document.getElementById('close-hint');
const streakBox = document.getElementById('streak-box');
const riddleContainer = document.getElementById('riddle');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

let triesLeft = 3;
let streak = 0;


function generateInputBoxes() {
    inputBoxes.innerHTML = ''; 
    const answer = getCurrentRiddle().answer;
    for (let i = 0; i < answer.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.addEventListener('input', moveToNextInput);
        inputBoxes.appendChild(input);
    }
    updateButtonVisibility();
}


function moveToNextInput(event) {
    const currentInput = event.target;
    const currentIndex = Array.from(inputBoxes.children).indexOf(currentInput);
    
    if (event.data === null && event.inputType === 'deleteContentBackward') {
        const prevInput = currentInput.previousElementSibling;
        if (prevInput) {
            prevInput.focus();
        }
    } else if (currentInput.value.length === 1) {
        const nextInput = currentInput.nextElementSibling;
        if (nextInput) {
            nextInput.focus();
        }
    }

   
    if (currentInput.value !== '' && currentIndex < inputBoxes.children.length - 1) {
        const nextEmptyInput = getNextEmptyInput(currentIndex);
        if (nextEmptyInput) {
            nextEmptyInput.focus();
        }
    }

    updateButtonVisibility(); 
}


function getNextEmptyInput(startIndex) {
    const inputs = Array.from(inputBoxes.children);
    for (let i = startIndex + 1; i < inputs.length; i++) {
        if (inputs[i].value === '') {
            return inputs[i];
        }
    }
    return null;
}


submitBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('#input-boxes input');
    let userAnswer = '';
    
    inputs.forEach(input => {
        userAnswer += input.value;
    });

    if (userAnswer.toLowerCase() === getCurrentRiddle().answer) {
        inputs.forEach(input => {
            input.style.backgroundColor = 'pink';
        });
        streak++;
        streakBox.textContent = `Streak: ${streak}`;
        correctSound.play();
        setTimeout(() => {
            goToNextRiddle();
        }, 1000); 
    } else {
        triesLeft--;
        triesCounter.textContent = `Tries until streak lost: ${triesLeft}`;
        wrongSound.play();
        if (triesLeft === 0) {
            streak = 0;
            streakBox.textContent = `Streak: ${streak}`;
            triesLeft = 3;
            triesCounter.textContent = `Tries until streak lost: ${triesLeft}`;
        }
        inputs.forEach(input => {
            input.value = '';
            input.classList.add('shake');
        });
        setTimeout(() => {
            inputs.forEach(input => {
                input.classList.remove('shake');
            });
            inputs[0].focus();
        }, 500);
    }
});


hintButton.addEventListener('click', () => {
    const currentRiddle = getCurrentRiddle();
    hintContent.textContent = currentRiddle.hint;
    hintPopup.classList.add('visible');
});


closeHintBtn.addEventListener('click', () => {
    hintPopup.classList.remove('visible');
});


revealLetterBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('#input-boxes input');
    let emptyInputs = [];
    inputs.forEach((input, index) => {
        if (input.value === '') {
            emptyInputs.push(index);
        }
    });
    if (emptyInputs.length > 0) {
        const randomIndex = emptyInputs[Math.floor(Math.random() * emptyInputs.length)];
        inputs[randomIndex].value = getCurrentRiddle().answer[randomIndex];
        moveToNextInput({ target: inputs[randomIndex] });
    }
});


function updateButtonVisibility() {
    const inputs = document.querySelectorAll('#input-boxes input');
    const allFilled = Array.from(inputs).every(input => input.value !== '');
    if (allFilled) {
        revealLetterBtn.style.display = 'none';
        checkAnswerBtn.style.display = 'inline-block';
    } else {
        revealLetterBtn.style.display = 'inline-block';
        checkAnswerBtn.style.display = 'none';
    }
}


function resetGame() {
    generateInputBoxes();
    const inputs = document.querySelectorAll('#input-boxes input');
    inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
    });
    inputs[0].focus();
    triesLeft = 3;
    triesCounter.textContent = `Tries until streak lost: ${triesLeft}`;
    updateRiddle(); 
}


function getCurrentRiddle() {
    return riddles[currentRiddleIndex];
}


function updateRiddle() {
    riddleContainer.textContent = getCurrentRiddle().riddle;
}


function goToNextRiddle() {
    currentRiddleIndex++;
    if (currentRiddleIndex >= riddles.length) {
        currentRiddleIndex = 0; 
    }
    updateRiddle();
    generateInputBoxes();
    document.getElementById('input-boxes').querySelector('input').focus(); 
    triesLeft = 3; 
    triesCounter.textContent = `Tries until streak lost: ${triesLeft}`;
    streakBox.textContent = `Streak: ${streak}`;
    hintPopup.classList.remove('visible'); 
    revealLetterBtn.style.display = 'inline-block'; 
    checkAnswerBtn.style.display = 'none'; 
}

generateInputBoxes();
updateRiddle();
inputBoxes.querySelector('input').focus();



document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('background-music');
    const settingsLink = document.getElementById('settings-link');
    const settingsMenu = document.getElementById('settings-menu');
    const closeSettings = document.getElementById('close-settings');
    const playMusic = document.getElementById('play-music');
    const stopMusic = document.getElementById('stop-music');
  
    settingsLink.addEventListener('click', () => {
        settingsMenu.classList.toggle('hidden');
    });
  
    closeSettings.addEventListener('click', () => {
        settingsMenu.classList.add('hidden');
    });
  
    playMusic.addEventListener('click', () => {
        audio.play();
    });
  
    stopMusic.addEventListener('click', () => {
        audio.pause();
    });
  });