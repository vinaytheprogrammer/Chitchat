const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const animationToggle = document.getElementById('toggle-animation');
const bgCircles  = document.getElementById('bg-circles');

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
    const messageContent = document.createElement('p');
    messageContent.innerText = message;
    messageElement.appendChild(messageContent);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

animationToggle.addEventListener('click', () => {
    let circles = bgCircles.children;
    console.log(circles);
    for (circle of circles) {
        circle.classList.contains('move') ? circle.classList.remove('move') : circle.classList.add('move');
    }
    animationToggle.classList.contains('button-off') ? animationToggle.classList.remove('button-off') : animationToggle.classList.add('button-off');
})