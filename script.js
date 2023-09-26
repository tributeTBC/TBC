document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("input").focus();
});

document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = event.target.value.trim();
        if (inputValue) {
            appendToOutput(`root@tribute:~# ${inputValue}`);
            handleCommand(inputValue);
            event.target.value = "";
        }
        event.preventDefault();
    }
});

document.getElementById("commands").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN") {
        appendToOutput(`root@tribute:~# ${event.target.textContent}`);
        handleCommand(event.target.textContent);
    }
});

function appendToOutput(content) {
    const outputElem = document.getElementById("output");
    const currentContent = outputElem.textContent.split('\n');
    
    currentContent.push(content);

    // Ensure only the last 42 lines are displayed
    while (currentContent.length > 42) {
        currentContent.shift();
    }

    outputElem.textContent = currentContent.join('\n');
    outputElem.scrollTop = outputElem.scrollHeight;
}

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
document.getElementById("clear-output").addEventListener("click", function() {
    document.getElementById("output").textContent = '';
});
