const input = document.getElementById('input');
const output = document.getElementById('output');

input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        handleCommand(this.value);
        this.value = '';
    }
});

function handleCommand(command) {
    output.innerHTML += "\n" + command;
    let fileName;

    switch (command) {
        case 'showstory -f Tribute':
            fileName = 'story.txt';
            break;
        case 'showcontracts -a Tribute':
            fileName = 'contracts.txt';
            break;
        case 'buy -thebestcoinintheworld':
            fileName = 'buy.txt';
            break;
        case 'showtokenomics Tribute':
            fileName = 'tokenomics.txt';
            break;
        case 'how to follow the satoshi':
            fileName = 'contact.txt';
            break;
        default:
            output.innerHTML += "\n" + "Command not found!";
            return;
    }

    fetch(fileName)
        .then(response => response.text())
        .then(data => typeWriteText(data))
        .catch(error => output.innerHTML += "\n" + "Error fetching file content!");
}


function typeWriteText(text) {
    let index = 0;
    function typeCharacter() {
        if (index < text.length) {
            output.innerHTML += text[index];
            index++;
            setTimeout(typeCharacter, 50);
        } else {
            output.scrollTop = output.scrollHeight;
        }
    }
    typeCharacter();
}
