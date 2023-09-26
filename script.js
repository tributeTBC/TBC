document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("input").focus();
});

let currentTimeouts = []; // Store all ongoing timeouts
let stopTyping = false; // Flag to control the typewriter

function typeWriter(txt, outputElem) {
    let index = 0;
    function typeChar() {
        if (index < txt.length && !stopTyping) {
            outputElem.textContent += txt.charAt(index);
            index++;
            let timeoutId = setTimeout(typeChar, 1); // Adjust speed as needed
            currentTimeouts.push(timeoutId);
        } else if (index >= txt.length) {  // This checks if the typing has finished
            stopTyping = false;
        }
    }
    typeChar();
}

document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = event.target.value.trim();
        if (inputValue) {
            stopAndClear(); // Clear existing text and stop ongoing typing
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
        if (!stopTyping) {  // If the typewriter isn't running, execute the command directly
            handleCommand(event.target.textContent);
            return;
        }
        
        stopAndClear(); // Clear existing text and stop ongoing typing
        
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
            scrollToBottom();
            return;
    }

    fetch(`./${fileName}.txt`).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    }).then(content => {
        let outputElem = document.getElementById("output");
        // Check if the last character is not a newline, if not then add a newline.
        if (outputElem.textContent.slice(-1) !== '\n') {
            outputElem.textContent += '\n';
        }
        typeWriter(content, outputElem);
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
    document.getElementById("output").textContent += '\nCommand broke early!\n';
}
