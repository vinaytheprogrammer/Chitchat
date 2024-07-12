const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;

  appendMessage("user", userMessage);
  showTypingIndicator();

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await response.json();
    removeTypingIndicator();
    appendMessage("bot", data.message);
  } catch (err) {
    console.error("Error:", err);
    removeTypingIndicator();
  }

  userInput.value = "";
});

function appendMessage(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "message",
    sender === "user" ? "user-message" : "bot-message"
  );
  messageElement.innerText = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("message", "typing-indicator");
  typingIndicator.innerHTML =
    '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typingIndicator = chatBox.querySelector(".typing-indicator");
  if (typingIndicator) {
    chatBox.removeChild(typingIndicator);
  }
}
