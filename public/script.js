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
chatForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    appendMessage('user', userMessage);

    if (userMessage === '') {
        return;
    }
    if(chatForm.style.background=="green") {
            chatForm.style.background="skyblue";
            console.log("now white");
            }
    else{
        chatForm.style.background="green";
            console.log("now green");
        }
    
            appendMessage('user',userMessage);
    userInput.value = '';
});

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.innerText = message;
    if(chatForm.style.background=="skyblue"){
        messageElement.style.backgroundColor="green";
            console.log("now green");
            messageElement.style.position="relative";
            messageElement.style.right = "100px";

        }
    else {
        messageElement.style.background="blue";
            console.log("now blue");
            }
    // messageElement.style.color="yellow";
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}