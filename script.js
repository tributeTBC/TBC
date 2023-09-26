document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("input").focus();
});

let currentTimeouts = [];
let stopTyping = false;

function typeWriter(txt, outputElem) {
    //stopAllTyping();  // Clear any ongoing typing
    let index = 0;
    function typeChar() {
        if (index < txt.length && !stopTyping) {
            outputElem.textContent += txt.charAt(index);
            index++;
            let timeoutId = setTimeout(typeChar, 50);
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
        stopAllTyping();  // Interrupt any ongoing typing
        handleCommand(event.target.textContent);
        scrollToBottom();
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

    fetch(`./${fileName}.txt`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(content => {
            typeWriter(content, document.getElementById("output"));
            scrollToBottom();
        })
        .catch(err => {
            typeWriter('\nError fetching file content!', document.getElementById("output"));
            scrollToBottom();
        });
}

function scrollToBottom() {
    const output = document.getElementById("output");
    output.scrollTop = output.scrollHeight;
}

function stopAllTyping() {
    stopTyping = true;
    currentTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    currentTimeouts = [];
}
