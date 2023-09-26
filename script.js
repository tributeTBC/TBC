document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("input").focus();
});

document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = event.target.value.trim();
        if (inputValue) {
            appendToOutput('> ' + inputValue);
            handleCommand(inputValue);
            event.target.value = "";
        }
        event.preventDefault(); // Prevent the default action
    }
});

document.getElementById("commands").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN") {
        handleCommand(event.target.textContent);
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
            appendToOutput('Command not found!');
            return;
    }

    fetch(`./${fileName}.txt`).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    }).then(content => {
        appendToOutput(content);
    }).catch(err => {
        appendToOutput('Error fetching file content!');
    });
}

function appendToOutput(content) {
    const output = document.getElementById("output");
    output.textContent += content + '\n';
    limitLinesToLast(output, 42);
    scrollToBottom();
}

function limitLinesToLast(element, lineCount) {
    const lines = element.textContent.split('\n');
    if (lines.length > lineCount) {
        element.textContent = lines.slice(-lineCount).join('\n');
    }
}

function scrollToBottom() {
    const output = document.getElementById("output");
    output.scrollTop = output.scrollHeight;
}
