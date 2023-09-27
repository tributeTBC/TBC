let ASCII_ART; // Declare it at a higher scope level
const ASCII_ART_MOBILE = `
<pre>











████████╗██████╗ ██╗██████╗ ██╗   ██╗████████╗███████╗ 
╚══██╔══╝██╔══██╗██║██╔══██╗██║   ██║╚══██╔══╝██╔════╝ 
   ██║   ██████╔╝██║██████╔╝██║   ██║   ██║   █████╗  
   ██║   ██╔══██╗██║██╔══██╗██║   ██║   ██║   ██╔══╝  
   ██║   ██║  ██║██║██████╔╝╚██████╔╝   ██║   ███████╗
   ╚═╝   ╚═╝  ╚═╝╚═╝╚═════╝  ╚═════╝    ╚═╝   ╚══════╝
</pre>
`;
const ASCII_ART_DESKTOP = `
<pre>









████████╗██████╗ ██╗██████╗ ██╗   ██╗████████╗███████╗ 
╚══██╔══╝██╔══██╗██║██╔══██╗██║   ██║╚══██╔══╝██╔════╝ 
   ██║   ██████╔╝██║██████╔╝██║   ██║   ██║   █████╗  
   ██║   ██╔══██╗██║██╔══██╗██║   ██║   ██║   ██╔══╝  
   ██║   ██║  ██║██║██████╔╝╚██████╔╝   ██║   ███████╗
   ╚═╝   ╚═╝  ╚═╝╚═╝╚═════╝  ╚═════╝    ╚═╝   ╚══════╝
</pre>
`;

document.addEventListener('DOMContentLoaded', (event) => {
    adjustOutputHeight();

    // Adjustments specific to mobile devices
    adjustForMobile();

    // This is just to handle potential edge cases like window resizing.
    window.addEventListener('resize', adjustOutputHeight);
});

function adjustOutputHeight() {
    // Determine total height of everything excluding the output area
    let consoleElement = document.getElementById("console");
    let outputElement = document.getElementById("output");

    // Get computed style of console, so we can consider its padding in our calculations
    let consoleStyle = getComputedStyle(consoleElement);

    let totalOutsideHeight = consoleElement.clientHeight - outputElement.clientHeight + 
                             parseInt(consoleStyle.paddingTop) + 
                             parseInt(consoleStyle.paddingBottom);

    // Calculate the max height for output based on viewport height
    let maxOutputHeight = window.innerHeight - totalOutsideHeight;
    
    // If available space is more than 600px, limit it. Otherwise, use available space.
    outputElement.style.height = (maxOutputHeight > 600 ? 600 : maxOutputHeight) + "px";
}

function adjustForMobile() {
    // Check if device width is less than or equal to 600px
    if (window.innerWidth <= 600) {
        let inputElement = document.getElementById("input");

        // Make input read-only
        inputElement.setAttribute("readonly", true);

        // Update placeholder text
        inputElement.placeholder = "Console is disabled for mobile.<br> use buttons";

        // Update placeholder font size
        let styleElem = document.createElement('style');
        styleElem.innerHTML = `
            #input::placeholder {
                font-size: 12px; /* You can adjust this value as needed */
            }
        `;
        document.head.appendChild(styleElem);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const isMobile = window.innerWidth < 768;
    ASCII_ART = isMobile ? ASCII_ART_MOBILE : ASCII_ART_DESKTOP; // Assign value here

    const outputElement = document.getElementById("output");
    outputElement.innerHTML = ASCII_ART;

    if (isMobile) {
        const asciiElement = outputElement.querySelector('pre');
        asciiElement.style.fontSize = '8px';
    }

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
        setTimeout(() => {
            document.getElementById("output").innerHTML = ASCII_ART;
        }, 800);  // 1500ms is 1.5 seconds
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
