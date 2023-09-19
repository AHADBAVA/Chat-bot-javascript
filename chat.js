const sampleCommands = [
    { question: "Who made this?", answer: "Abdul Ahad S." },
    { question: "What is JavaScript?", answer: "JavaScript is a client-side scripting language used for web interactivity." },
];

const customCommands = [
    { question: "Custom Command 1", answer: "Response to Custom Command 1." },
    { question: "Custom Command 2", answer: "Response to Custom Command 2." },
    { question: "What is the capital of France?", answer: "Paris" },
];

const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const jsImage = document.getElementById("js-image"); // Get the image element

function addMessage(message, isUser) {
    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "user-message" : "bot-message";
    if (isUser) {
        messageDiv.innerText = message;
    } else {
        const messageText = document.createElement("span");
        messageText.innerText = message;
        messageDiv.appendChild(messageText);
        chatBody.appendChild(messageDiv);
        chatBody.appendChild(jsImage); // Append the image to the chat body
    }
    chatBody.appendChild(messageDiv);
}

function handleSampleQuestionClick(question, answer) {
    addMessage(question, true);
    setTimeout(() => {
        addMessage(answer, false);
        // Check if the answer is for "What is JavaScript?" and show the image
        if (question === "What is JavaScript?") {
            jsImage.style.display = "block";
        }
    }, 500);
}

sampleCommands.forEach(qa => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "bot-message";
    questionDiv.innerText = qa.question;
    questionDiv.addEventListener("click", () => {
        handleSampleQuestionClick(qa.question, qa.answer);
    });
    chatBody.appendChild(questionDiv);
});

function handleUserInput(userMessage) {
    addMessage(userMessage, true);

    let matchedQAPair = null;
    let highestSimilarity = 0;

    for (const qa of sampleCommands.concat(customCommands)) {
        const similarity = stringSimilarity(userMessage.toLowerCase(), qa.question.toLowerCase());
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            matchedQAPair = qa;
        }
    }

    if (matchedQAPair && highestSimilarity >= 0.7) {
        addMessage(matchedQAPair.answer, false);
        // Check if the answer is for "What is JavaScript?" and show the image
        if (matchedQAPair.question === "What is JavaScript?") {
            jsImage.style.display = "block";
        }
    } else {
        addMessage("I'm sorry, I don't understand that question.", false);
        // Hide the image when a question is not recognized
        jsImage.style.display = "none";
    }
}

sendButton.addEventListener("click", function () {
    const userMessage = userInput.value;
    if (userMessage.trim() === "") return;

    handleUserInput(userMessage);
    userInput.value = "";
});

userInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        sendButton.click();
    }
});

function stringSimilarity(str1, str2) {
    const maxLength = Math.max(str1.length, str2.length);
    const editDistance = levenshteinDistance(str1, str2);
    return 1 - editDistance / maxLength;
}

function levenshteinDistance(str1, str2) {
    const dp = Array.from({ length: str1.length + 1 }, () => Array(str2.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i++) {
        dp[i][0] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[str1.length][str2.length];
}
