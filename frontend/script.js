// ==========================================
// 1. CHATBOT UI LOGIC
// ==========================================

const chatToggle = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");
const heroChatBtn = document.getElementById("hero-chat-btn");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

// Toggle Chat Window Open/Close
chatToggle.addEventListener("click", () => {
  chatWindow.classList.toggle("hidden");
});

heroChatBtn.addEventListener("click", () => {
  chatWindow.classList.remove("hidden");
  chatInput.focus();
});

closeChat.addEventListener("click", () => {
  chatWindow.classList.add("hidden");
});

// Function to Add Messages to the UI
function addMessageToUI(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  // Auto-scroll to the bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to Send Message to Backend
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return; // Don't send empty messages

  // 1. Add user message to UI
  addMessageToUI(text, "user");
  chatInput.value = ""; // Clear input

  // 2. Add temporary "Thinking..." message
  const loadingId = "loading-" + Date.now();
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message bot";
  loadingDiv.id = loadingId;
  loadingDiv.textContent = "Thinking...";
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    // 3. Send request to your Node.js Backend
    const apiUrl = (window.PORTFOLIO_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const response = await fetch(`${apiUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: text }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // 4. Remove loading message and add AI response
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();

    addMessageToUI(data.answer, "bot");
  } catch (error) {
    console.error("Chat Error:", error);
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();

    addMessageToUI(
      "Sorry, I'm having trouble connecting right now. Please try again later.",
      "bot",
    );
  }
}

// Event Listeners for Sending Messages
sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// ==========================================
// 2. SCROLL ANIMATIONS
// ==========================================

// This uses the Intersection Observer API to fade in sections as you scroll down
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1, // Trigger when 10% of the section is visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // When element enters viewport, make it visible
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
      // Stop observing once animated
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply initial hidden state to all sections and observe them
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    // Set initial state (hidden and pushed down slightly)
    section.style.opacity = 0;
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";

    // Tell the observer to watch this section
    observer.observe(section);
  });
});
