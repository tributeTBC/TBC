document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("input").focus();
});

let currentTimeouts = []; // Store all ongoing timeouts
let stopTyping = false; // Flag to control the typewriter

function typeWriter(txt, outputElem) {
    stopAndClear(); // Ensure any previous content is cleared and typing is stopped
    let index = 0;
    function typeChar() {
        if (index < txt.length && !stopTyping) {
            outputElem.textContent += txt.charAt(index);
            index++;
            let timeoutId = setTimeout(typeChar, 1); // Adjust speed as needed
            currentTimeouts.push(timeoutId);
        }
    }
    typeChar();
}

document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = event.target.value.trim();
        if (inputValue) {
            document.getElementById("output").textContent += inputValue + '\n';
            handleCommand(inputValue);
            event.target.value = "";
            scrollToBottom();
        }
        event.preventDefault();
    }
});

document.getElementById("commands").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN") {
        if (!stopTyping) {  
            handleCommand(event.target.textContent);
            scrollToBottom();
            return;
        }
        
        stopTyping = true;
        setTimeout(() => {
            handleCommand(event.target.textContent);
            scrollToBottom();
        }, 1000);
    }
});

function handleCommand(command) {
    let fileName = '';

    switch (command.toLowerCase()) {
        case 'story':
            fileName = 'story';
            break;
        case 'contracts':
            fileName = 'contracts';
            break;
        case 'buy':
            fileName = 'buy';
            break;
        case 'tokenomics':
            fileName = 'tokenomics';
            break;
        case 'contact':
            fileName = 'contact';
            break;
        default:
            typeWriter('Command not found!', document.getElementById("output"));
            return;
    }

    fetch(`./${fileName}.txt`).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    }).then(content => {
        typeWriter(content, document.getElementById("output"));
        scrollToBottom();
    }).catch(err => {
        typeWriter('\nError fetching file content!', document.getElementById("output"));
        scrollToBottom();
    });
}

function scrollToBottom() {
    const output = document.getElementById("output");
    output.scrollTop = output.scrollHeight;
}

function stopAndClear() {
    stopTyping = true;
    currentTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    document.getElementById("output").textContent = ''; // Clear the output
}
