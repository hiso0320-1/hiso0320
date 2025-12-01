document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const closeBtn = document.querySelector('.close-btn');
    const chatInput = document.querySelector('.chatbot-input input');
    const sendBtn = document.querySelector('.chatbot-input button');
    const messagesContainer = document.querySelector('.chatbot-messages');

    // Toggle Chat Window
    function toggleChat() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatInput.focus();
        }
    }

    chatbotToggle.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Send Message
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add User Message
        addMessage(text, 'user');
        chatInput.value = '';

        // Show Loading
        const loadingId = addLoading();

        try {
            const response = await fetchOpenAI(text);
            removeLoading(loadingId);
            addMessage(response, 'bot');
        } catch (error) {
            removeLoading(loadingId);
            addMessage('죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
            console.error('Chatbot Error:', error);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // UI Helpers
    function addMessage(text, type) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.textContent = text;
        messagesContainer.appendChild(div);
        scrollToBottom();
    }

    function addLoading() {
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.id = id;
        div.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(div);
        scrollToBottom();
        return id;
    }

    function removeLoading(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // OpenAI API Integration
    async function fetchOpenAI(prompt) {
        // ⚠️ SECURITY WARNING: Never use API keys in client-side code in production!
        // This is for demonstration purposes only.
        const API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

        if (API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
            return 'API 키가 설정되지 않았습니다. chatbot.js 파일에서 API 키를 설정해주세요.';
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: "system",
                        content: "당신은 성원볼트의 친절한 AI 상담원입니다. 볼트와 너트, 그리고 회사 제품에 대해 친절하게 답변해주세요."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
});
