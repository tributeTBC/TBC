const ASCII_ART = `
<pre>
 _____     _ _           _                                          
|_   _| __(_) |__  _   _| |_ ___                                    
  | || '__| | '_ \| | | | __/ _ \                                   
  | || |  | | |_) | |_| | ||  __/                                   
 _|_||_|  |_|_.__/_\__,_|\__\___| _               _         _       
| |_| |__   ___  | |__   ___  ___| |_    ___ ___ (_)_ __   (_)_ __  
| __| '_ \ / _ \ | '_ \ / _ \/ __| __|  / __/ _ \| | '_ \  | | '_ \ 
| |_| | | |  __/ | |_) |  __/\__ \ |_  | (_| (_) | | | | | | | | | |
 \__|_| |_|\___| |_.__/ \___||___/\__|  \___\___/|_|_| |_| |_|_| |_|
| |_| |__   ___  __      _____  _ __| | __| |                       
| __| '_ \ / _ \ \ \ /\ / / _ \| '__| |/ _` |                       
| |_| | | |  __/  \ V  V / (_) | |  | | (_| |                       
 \__|_| |_|\___|   \_/\_/ \___/|_|  |_|\__,_|                       
</pre>
`;

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("output").innerHTML = ASCII_ART;
    if (window.innerWidth > 600) {
        document.getElementById("input").focus();
    }
});

document.getElementById("commands").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN" && event.target.hasAttribute("data-command")) {
        event.preventDefault();
        const displayCommand = event.target.getAttribute("data-display-command");
        const actualCommand = event.target.getAttribute("data-command");
        
        appendToOutput("root@tribute:~# " + displayCommand);
        executeCommand(actualCommand);
        scrollToBottom();
    }
});

document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = event.target.value.trim();
        if (inputValue) {
            appendToOutput("root@tribute:~# " + inputValue);
            executeCommand(inputValue);
            event.target.value = "";
            scrollToBottom();
        }
        event.preventDefault();
    }
});

function executeCommand(command) {
    const commandsList = ['story', 'contracts', 'buy', 'tokenomics', 'contact', 'clear'];

    if (command === "clear") {
        document.getElementById("output").innerHTML = ASCII_ART;
        return;
    }

    if (commandsList.includes(command.toLowerCase())) {
        fetch(`./${command}.txt`).then(response => {
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
        text = text + '<br>';
    }

    // Get existing lines
    let lines = outputElem.innerHTML.split('<br>');

    // Add the new content
    lines.push(text);

    // Keep only the last 100 lines
    lines = lines.slice(-100);

    // Update the output
    outputElem.innerHTML = lines.join('<br>');
}


function scrollToBottom() {
    const output = document.getElementById("output");
    output.scrollTop = output.scrollHeight;
}
