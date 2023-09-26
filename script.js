let inputElem = document.getElementById("input");
let outputElem = document.getElementById("output");
let typeDelay = 8; // Time delay between characters for typing effect in milliseconds
let isTyping = false;

// Command to filename mapping
const commandMappings = {
    "showstory -f Tribute": "story.txt",
    "showcontracts -a Tribute": "contracts.txt",
    "buy -thebestcoinintheworld": "buy.txt",
    "showtokenomics Tribute": "tokenomics.txt",
    "how to follow the satoshi": "contact.txt"
};

inputElem.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        if (!isTyping) {
            let command = inputElem.value.trim();
            addTextToOutput("\nroot@tribute:~# " + command);
            inputElem.value = "";
            handleCommand(command);
        }
    }
});

function handleCommand(command) {
    isTyping = true;

    if (commandMappings[command]) {
        fetch(commandMappings[command])
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error fetching file content!");
                }
                return response.text();
            })
            .then(content => {
                addTextToOutput("\n" + content);
                addTextToOutput("\nroot@tribute:~# ");
                isTyping = false;
            })
            .catch(error => {
                addTextToOutput("\n" + error.message);
                addTextToOutput("\nroot@tribute:~# ");
                isTyping = false;
            });
    } else {
        addTextToOutput("\nCommand not found or file doesn't exist!");
        addTextToOutput("\nroot@tribute:~# ");
        isTyping = false;
    }
}

function addTextToOutput(text) {
    let startPos = 0;
    let interval = setInterval(() => {
        if (startPos < text.length) {
            outputElem.textContent += text[startPos];
            startPos++;
        } else {
            clearInterval(interval);
        }
    }, typeDelay);
}

document.getElementById("commands").addEventListener("click", function(event) {
    if (event.target.tagName.toLowerCase() === "span") {
        let command = event.target.textContent.trim();
        if (!isTyping) {
            inputElem.value = "";
            handleCommand(command);
        }
    }
});
