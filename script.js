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
            let timeoutId = setTimeout(typeChar, 3); // Adjust speed as needed
            currentTimeouts.push(timeoutId);
        }
    }
    typeChar();
}

document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = event.target.value.trim();
        if (inputValue) {
            document.getElementById("output").textContent += '\n' + inputValue;
            handleCommand(inputValue);
            event.target.value = "";
        }
        event.preventDefault();  // Prevent the default action
    }
});

document.getElementById("commands").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN") {
        // Clear current text and stop ongoing typewriter effect
        stopTyping = true;
        currentTimeouts.forEach(timeoutId => clearTimeout(timeoutId)); // Clear all timeouts
        document.getElementById("output").textContent += '\nCommand broke early!\n';

        setTimeout(() => {
            stopTyping = false; // Reset for the next command
            handleCommand(event.target.textContent);
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
        let outputElem = document.getElementById("output");
        // Check if the last character is not a newline, if not then add a newline.
        if (outputElem.textContent.slice(-1) !== '\n') {
            outputElem.textContent += '\n';
        }
        typeWriter(content, outputElem);
    }).catch(err => {
        typeWriter('\nError fetching file content!', document.getElementById("output"));
    });
}
