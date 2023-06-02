'use strict';

// ! =========== Variables ===========
const apiUrl = 'http://api.quotable.io/random',
    containerEl = document.getElementById('container'),
    timerEl = document.getElementById('timer'),
    quoteEl = document.getElementById('quote'),
    wpmEl = document.getElementById('wpm');
let timerInterval, quote, correctStrokes,
    characterSpanArray = [], typedQuoteArray = [];

// ! =========== Functions ===========

// ? fetch quote from the api 
const getRandomQuote = (api) => fetch(api).then(res => res.json()).then(data => data.content);

// ? render new quote 
async function renderNewQuote() {
    quote = await getRandomQuote(apiUrl);
    typedQuoteArray.length = 0;
    characterSpanArray.length = 0;
    quoteEl.innerHTML = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteEl.appendChild(characterSpan);
        characterSpanArray.push(characterSpan);
    });
    correctStrokes = 0;
    document.body.backgroundColor = 'Green';
    setTimeout(() => {
        document.body.backgroundColor = '#30113f';
    }, 100)
}
renderNewQuote();

// ? start the timer
const startTimer = () => {
    clearInterval(timerInterval);
    timerEl.innerText = 0;
    let startTime = new Date();
    timerInterval = setInterval(() => {
        timerEl.innerText = Math.floor((new Date() - startTime) / 1000);
    }, 1000);
}

// ? updating wpm for every stroke
function updateWPM() {
    const timeElapsed = +timerEl.innerText;
    const wpm = Math.round((parseFloat(correctStrokes) / 5.0) / (parseFloat(timeElapsed) / 60.0));
    wpmEl.innerText = `${wpm}`;
}

// ? reset the game
function reset() {
    timerEl.innerText = 0;
    correctStrokes = 0;
    clearInterval(timerInterval);
    timerInterval = null;
    typedQuoteArray.forEach((_, index) => characterSpanArray[index].className = '');
    typedQuoteArray.length = 0;
}

// ? useless key pressed
function uselessKeyPressed(currentChar) {
    currentChar === 'Shift' || currentChar === 'CapsLock' || currentChar === 'Tab' || currentChar === 'Enter' || currentChar === 'Control' || currentChar === 'Meta' || currentChar === 'Alt' || currentChar === 'AltGraph'
}

// ? handle keydown event
function handleKeydownEvent(e) {
    e.preventDefault();
    if (uselessKeyPressed(e.key)) return;

    const currentChar = e.key,
        currentIndex = typedQuoteArray.length;

    if (currentChar === 'Backspace') {
        typedQuoteArray.pop();
        currentIndex === 0 || (characterSpanArray[currentIndex - 1].className = '');
        return;
    }
    if (currentChar === quote[typedQuoteArray.length]) {
        correctStrokes++;
        characterSpanArray[currentIndex].className = 'correct';
    } else {
        characterSpanArray[currentIndex].className = 'incorrect';
    }
    typedQuoteArray.push(currentChar);

    updateWPM();

    if (typedQuoteArray.join('') === quote) {
        renderNewQuote();
        reset();
        startTimer();
    }
};


// ! =========== Event Listeners ===========

// event listener to start and stop the game
document.addEventListener('click', (e) => {
    if (containerEl.contains(e.target)) {
        if (timerInterval) return;
        startTimer();
        document.addEventListener('keydown', handleKeydownEvent);
    } else {
        document.removeEventListener('keydown', handleKeydownEvent);
        reset();
    }
});



