const ASCII_ART = `
<pre>

___________      ._____.           __                                                                                                            
\__    ___/______|__\_ |__  __ ___/  |_  ____                                                                                                    
  |    |  \_  __ \  || __ \|  |  \   __\/ __ \                                                                                                   
  |    |   |  | \/  || \_\ \  |  /|  | \  ___/                                                                                                   
  |____|   |__|  |__||___  /____/ |__|  \___  >                                                                                                  
                         \/                 \/                                                                                                   
  __  .__             ___.                    __                 .__         .__           __  .__                                 .__       .___
_/  |_|  |__   ____   \_ |__   ____   _______/  |_    ____  ____ |__| ____   |__| ____   _/  |_|  |__   ____   __  _  _____________|  |    __| _/
\   __\  |  \_/ __ \   | __ \_/ __ \ /  ___/\   __\ _/ ___\/  _ \|  |/    \  |  |/    \  \   __\  |  \_/ __ \  \ \/ \/ /  _ \_  __ \  |   / __ | 
 |  | |   Y  \  ___/   | \_\ \  ___/ \___ \  |  |   \  \__(  <_> )  |   |  \ |  |   |  \  |  | |   Y  \  ___/   \     (  <_> )  | \/  |__/ /_/ | 
 |__| |___|  /\___  >  |___  /\___  >____  > |__|    \___  >____/|__|___|  / |__|___|  /  |__| |___|  /\___  >   \/\_/ \____/|__|  |____/\____ | 
           \/     \/       \/     \/     \/              \/              \/          \/             \/     \/                                 \/ 

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
