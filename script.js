document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("input").focus();
});

let typingInProgress = false;

function typeWriter(txt, outputElem) {
    if (typingInProgress) return; // Prevent overlapping typeWriter calls

    let index = 0;
    typingInProgress = true;
    
    function typeChar() {
        if (index < txt.length) {
            outputElem.textContent += txt.charAt(index);
            index++;
            setTimeout(typeChar, 50);
        } else {
            typingInProgress = false;
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

    fetch(`./${fileName}.txt`).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    }).then(content => {
        document.getElementById("output").textContent = ''; // Clear the output
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
