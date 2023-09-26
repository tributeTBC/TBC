document.addEventListener('DOMContentLoaded', (event) => {
    if (window.innerWidth > 600) {
        document.getElementById("input").focus();
    }
});

document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = event.target.value.trim().toLowerCase();
        if (inputValue) {
            handleCommand(inputValue, inputValue);
            event.target.value = "";
            scrollToBottom();
        }
        event.preventDefault();
    }
});

document.getElementById("commands").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN" && event.target.hasAttribute("data-actual-command")) {
        event.preventDefault();
        const commandToShow = event.target.textContent.trim().toLowerCase();
        const actualCommand = event.target.getAttribute("data-actual-command").trim().toLowerCase();
        handleCommand(actualCommand, commandToShow);
        scrollToBottom();
    }
});

function handleCommand(commandInput, actualCommand = commandInput) {
    appendToOutput("root@tribute:~# " + actualCommand);

    const commandsList = ['story', 'contracts', 'buy', 'tokenomics', 'contact', 'clear'];
    const commandLower = actualCommand.toLowerCase();

    if (commandLower === "clear") {
        document.getElementById("output").textContent = "";
        return;
    }

    if (commandsList.includes(commandLower)) {
        fetch(`./${commandLower}.txt`).then(response => {
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
    if (text.startsWith("root@tribute:~# ")) {
        text = `<div class="command-line">${text}</div>`;
    } else {
        text = text + '\n';
    }
    outputElem.innerHTML += text;
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
