const bgImageInput = document.getElementById('bg-image-input');
const bgColorInput = document.getElementById('bg-color-input');
const resetBgButton = document.getElementById('reset-bg');

bgImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.body.style.backgroundImage = `url(${e.target.result})`;
            document.body.style.animation = 'none';
        };
        reader.readAsDataURL(file);
    }
});

bgColorInput.addEventListener('input', (e) => {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = e.target.value;
    document.body.style.animation = 'none';
});

resetBgButton.addEventListener('click', () => {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '';
    document.body.style.animation = 'gradientBackground 15s ease infinite';
});

const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

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
    } catch (err) {
        console.error('Error:', err);
    }

    userInput.value = '';
});

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}