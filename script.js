document.addEventListener('DOMContentLoaded', (event) => {
    if (window.innerWidth > 600) {  
        document.getElementById("input").focus();
    }
});

document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = event.target.value.trim().toLowerCase();
        appendToOutput("root@tribute:~# " + inputValue);
        handleCommand(inputValue, inputValue);
        event.target.value = "";
        scrollToBottom();
        event.preventDefault();
    }
});

document.getElementById("commands").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN" && event.target.hasAttribute("data-command")) {
        const actualCommand = event.target.getAttribute("data-command").trim().toLowerCase();
        const displayCommand = event.target.getAttribute("data-display-command").trim();
        appendToOutput("root@tribute:~# " + displayCommand);
        handleCommand(actualCommand, displayCommand);
        scrollToBottom();
    }
});

function handleCommand(commandInput, displayCommand) {
    const commandsList = ['story', 'contracts', 'buy', 'tokenomics', 'contact', 'clear'];

    if (commandInput === "clear") {
        document.getElementById("output").textContent = "";
        return;
    }

    if (commandsList.includes(commandInput)) {
        fetch(`./${commandInput}.txt`).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        }).then(content => {
            content = content.replace(/\/n/g, '<br>');
            appendToOutput(content, true);
            scrollToBottom();
        }).catch(err => {
            appendToOutput('Error fetching file content!');
            scrollToBottom();
        });
    } else {
        appendToOutput('Command not found!');
    }
}

function appendToOutput(text, isHTML = false) {
    const outputElem = document.getElementById("output");
    if (text.startsWith("root@tribute:~# ")) {
        text = `<div class="command-line">${text}</div>`;
    } else if (isHTML) {
        text += '<br>';
    } else {
        text = text + '\n';
    }

    if (isHTML) {
        outputElem.innerHTML += text;
    } else {
        const textNode = document.createTextNode(text);
        outputElem.appendChild(textNode);
    }

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
