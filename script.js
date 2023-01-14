// UI vars
const introDiv = document.getElementById('intro');
let introMessage = document.getElementById('intro-message').innerText;
const textarea = document.getElementById('textarea');
const main = document.querySelector('main');
const cancel = document.getElementById('cancel');
const greetings = document.getElementById('greetings');


// Init speech synth
const message = new SpeechSynthesisUtterance();

// Set message
function setMessage(introMessage) {
    message.text = introMessage
}

// Show intro message
function showIntro() {
    setTimeout(() => {
        introDiv.style.opacity = '1'
        introDiv.classList.add('show');

        setMessage(introMessage);
        speakMessage();

        setTimeout(() => {
            // Start recognition
            recognition.start();

            // Get the recognition result
            recognition.addEventListener('result', onSpeak)
        }, 4000);



    }, 2000);
}

// Hide Intro 
function hideIntro(name) {
    introDiv.classList.add('hide');
    setTimeout(() => {
        introDiv.classList.remove('hide');
        introDiv.classList.add('show');
        const newMessage = document.getElementById('intro-message');
        newMessage.innerText = `Hey ${name} you have a lovely name, click in the textarea and tell me everything about your day, talk clearly and slowly because i would like to get the full gist`

        setMessage(newMessage.innerText);
        speakMessage();
    }, 2000);

}

// Speak intro message
function speakMessage() {
    speechSynthesis.speak(message);
}

// Validate time
function validateTime() {
    const today = new Date();
    const hours = today.getHours();

    if (hours === 6 || hours > 6 && hours < 12) {
        greetings.innerText = 'Good morning, hope you had a delicious breakfast, let talk all about your day 🌞';
    } else if (hours > 11 && hours < 16 || hours === 16) {
        greetings.innerText = 'You had a stressful day you deserve some ice-cream 🍦, let talk all about your day ☀';
    } else if (hours > 16 && hours < 20) {
        greetings.innerText = "I would love to cook you dinner but I am just an AI 😔, let talk all about your day 🌒🌑";
    } else if (hours > 19 || hours > 0 || hours === 0 && hours < 6) {
        greetings.innerText = "It's is quite late, let talk all about your day 🌚";
    }
}

validateTime();

// Speech Recognition
window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

// let recognition = new window.SpeechRecognition();

if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    var recognition = new window.SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
}

// Capture user speak
function onSpeak(e) {
    const reply = e.results[0][0].transcript;
    let replyArr = [];
    replyArr = reply.split(' ');
    const replyArrLenght = replyArr.length

    if (replyArrLenght === 1) {
        hideIntro(replyArr[0]);
    } else if (replyArrLenght > 1) {
        hideIntro(replyArr[replyArrLenght - 1]);
    }
}


// Discussion speech recognition
let discussionrecognition = new window.SpeechRecognition();


// Click textarea and start discussion
function startDiscussion(e) {
    introDiv.classList.add('hide');

    // Start recognition
    discussionrecognition.start();

    // Get the recognition result
    discussionrecognition.addEventListener('result', writeDownDiscussion);
}

// Write down discussion
function writeDownDiscussion(e) {
    const discussions = e.results[0][0].transcript;

    const text = document.createElement('span');
    text.contentEditable = true;
    text.innerText = discussions;
    textarea.appendChild(text);

    setToLocalStorage(text.innerText);

    e.preventDefault();
}

//  Set text to local storage
function setToLocalStorage(text) {
    let texts;
    if (localStorage.getItem('texts') === null) {
        texts = [];
    } else {
        texts = JSON.parse(localStorage.getItem('texts'));
    }

    texts.push(text);
    localStorage.setItem('texts', JSON.stringify(texts));

}

// Get text from local storage
function getText(e) {
    let texts;
    if (localStorage.getItem('texts') === null) {
        texts = [];
    } else {
        texts = JSON.parse(localStorage.getItem('texts'));
    }

    texts.forEach((textLS) => {
        const text = document.createElement('span');
        text.contentEditable = true;
        text.id = gen.next().value;
        text.innerText = textLS;
        textarea.appendChild(text);

        Edit(text);
    });

}

// Generate Id
function* generateIndex() {
    let index = 0;

    while(true) {
        yield index++;
    }
}

const gen = generateIndex();

// Edit text from local storage
function EditInLocalStorage(e) {
    let texts;
    if (localStorage.getItem('texts') === null) {
        texts = [];
    } else {
        texts = JSON.parse(localStorage.getItem('texts'));
    }

    // Target Index to edit in local storage
    const index = e.target.id;
    texts[index] = e.target.innerText;

    // Delete empty index
    if(texts[index] === '') {
        texts.splice(index, 1)
    }

    localStorage.setItem('texts', JSON.stringify(texts));

}


// Event Listeners

// Remove welcome message
cancel.addEventListener('click', () => {
    document.querySelector('.container').style.display = 'flex'
    main.style.display = 'none'
});

// Show intro message
cancel.addEventListener('click', showIntro);

// Click text area and start discussion
textarea.addEventListener('click', startDiscussion);

// Continue the discussion speech recognition
discussionrecognition.addEventListener('end', () => discussionrecognition.start());

// Get text from local storage
document.addEventListener('DOMContentLoaded', getText);

// Edit text from local storage
function Edit(text) {
    text.addEventListener('input', EditInLocalStorage);

    text.addEventListener('click', EditInLocalStorage);
}