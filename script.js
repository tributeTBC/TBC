document.addEventListener('DOMContentLoaded', (event) => {
    if (window.innerWidth > 600) {  
        document.getElementById("input").focus();
    }
});

document.getElementById("commands").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN" && event.target.hasAttribute("data-actual-command")) {
        event.preventDefault(); 
        const commandToShow = event.target.getAttribute("data-actual-command").trim(); 
        appendToOutput("root@tribute:~# " + commandToShow);
        handleCommand(commandToShow);
        scrollToBottom();
    }
});

document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = event.target.value.trim();
        if (inputValue) {
            appendToOutput("root@tribute:~# " + inputValue);
            handleCommand(inputValue); 
            event.target.value = "";
            scrollToBottom();
        }
        event.preventDefault();
    }
});

function handleCommand(commandInput) {
    const commandsList = ['showstory -f tribute', 'contracts', 'buy', 'tokenomics', 'contact', 'clear'];

    if (commandInput === "clear") {
        document.getElementById("output").textContent = "";
        return;
    }

    if (commandsList.includes(commandInput.toLowerCase())) {
        const commandEndpoint = commandInput.split(' ')[0];
        fetch(`./${commandEndpoint}.txt`).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        }).then(content => {
            content = content.replace(/(http:\/\/[^\s]+|https:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
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
