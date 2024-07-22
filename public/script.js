const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const imageInput = document.getElementById('image-input');
const voiceButton = document.getElementById('voice-btn');
const stopButton = document.getElementById('stop-btn');
const scrollDownButton = document.getElementById('scroll-down-button');
const settingsBtn = document.getElementById('settings-btn');
const settingsDropdown = document.getElementById('settings-dropdown');
const bgColorInput = document.getElementById('bg-color');
const bgImageInput = document.getElementById('bg-image');

settingsBtn.addEventListener('click', () => {
    settingsDropdown.style.display = settingsDropdown.style.display === 'block' ? 'none' : 'block';
});

bgColorInput.addEventListener('change', (e) => {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = e.target.value;
});

bgImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        }
        reader.readAsDataURL(file);
    }
});

// Function to set default background
function setDefaultBackground() {
    document.body.style.backgroundImage = 'none';
    document.body.style.background = 'linear-gradient(270deg, #ff7e5f, #feb47b, #86a8e7, #91eae4)';
    document.body.style.backgroundSize = '800% 800%';
    document.body.style.animation = 'gradientBackground 15s ease infinite';
}

// Set default background on page load
setDefaultBackground();

let recognition;
let synth = window.speechSynthesis;
let speaking = false;

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        chatForm.dispatchEvent(new Event('submit'));
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };
} else {
    console.error('Speech recognition not supported');
    voiceButton.style.display = 'none';
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    const imageFile = imageInput.files[0];

    if (userMessage === '' && !imageFile) return;

    if (userMessage) {
        appendMessage('user', userMessage);
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });
            const data = await response.json();
            appendMessage('bot', data.message);
            speak(data.message);
        } catch (err) {
            console.error('Error:', err);
        }
    }

    if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        appendMessage('user', 'Image uploaded');
        try {
            const response = await fetch('/describe-image', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            appendMessage('bot', data.description);
            speak(data.description);
        } catch (err) {
            console.error('Error:', err);
        }
    }

    userInput.value = '';
    imageInput.value = '';
    scrollChatToBottom();
});

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    
    const logoElement = document.createElement('img');
    logoElement.classList.add('logo', sender === 'user' ? 'user-logo' : 'bot-logo');
    logoElement.src = sender === 'user' ? 'user-icon.png' : 'bot-icon.png';
    logoElement.alt = sender === 'user' ? 'User Logo' : 'Bot Logo';
    
    const textElement = document.createElement('div');
    textElement.classList.add('text');
    textElement.innerText = message;
    
    messageElement.appendChild(logoElement);
    messageElement.appendChild(textElement);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const scrollDownButton = document.getElementById("scroll-down-button");

    chatBox.addEventListener("scroll", () => {
        if (chatBox.scrollTop + chatBox.clientHeight < chatBox.scrollHeight) {
            scrollDownButton.style.display = 'block';
        } else {
            scrollDownButton.style.display = 'none';
        }
    });

    scrollDownButton.addEventListener("click", () => {
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
        });
    });

    scrollDownButton.style.display = 'none';
});

voiceButton.addEventListener('click', () => {
    if (!speaking) {
        const botResponse = chatBox.lastElementChild.innerText;
        speak(botResponse);
    }
});

stopButton.addEventListener('click', () => {
    if (synth.speaking) {
        synth.cancel();
        speaking = false;
    }
});

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
    speaking = true;

    utterance.onend = () => {
        speaking = false;
    };
}
