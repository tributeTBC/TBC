document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("input").focus();
});

document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = event.target.value.trim().toLowerCase(); // Normalize to lowercase
        if (inputValue) {
            appendToOutput("root@tribute:~# " + inputValue);
            handleCommand(inputValue);
            event.target.value = "";
            scrollToBottom();
        }
        event.preventDefault();
    }
});

document.getElementById("commands").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN") {
        const command = event.target.textContent.trim().toLowerCase(); // Normalize to lowercase
        appendToOutput("root@tribute:~# " + command);
        handleCommand(command);
        scrollToBottom();
    }
});

function handleCommand(command) {
    const commandsList = ['story', 'contracts', 'buy', 'tokenomics', 'contact'];
    if (commandsList.includes(command)) {
        fetch(`./${command}.txt`).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        }).then(content => {
            appendToOutput(content);
            scrollToBottom();
        }).catch(err => {
            appendToOutput('\nError fetching file content!');
            scrollToBottom();
        });
    } else {
        appendToOutput('Command not found!');
    }
}

function appendToOutput(text) {
    const outputElem = document.getElementById("output");
    outputElem.textContent += text + '\n';
    trimOutputToLastLines(42);
}

function trimOutputToLastLines(lineCount) {
    const outputElem = document.getElementById("output");
    const lines = outputElem.textContent.split('\n');
    if (lines.length > lineCount) {
        const trimmedContent = lines.slice(-lineCount).join('\n');
        outputElem.textContent = trimmedContent;
    }
}

function scrollToBottom() {
    const output = document.getElementById("output");
    output.scrollTop = output.scrollHeight;
}
