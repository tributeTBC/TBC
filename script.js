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

document.addEventListener("DOMContentLoaded", (event) => {
  adjustOutputHeight();

  // Adjustments specific to mobile devices
  adjustForMobile();

  // This is just to handle potential edge cases like window resizing.
  window.addEventListener("resize", adjustOutputHeight);
});

function adjustOutputHeight() {
  // Determine total height of everything excluding the output area
  let consoleElement = document.getElementById("console");
  let outputElement = document.getElementById("output");

  // Get computed style of console, so we can consider its padding in our calculations
  let consoleStyle = getComputedStyle(consoleElement);

  let totalOutsideHeight =
    consoleElement.clientHeight -
    outputElement.clientHeight +
    parseInt(consoleStyle.paddingTop) +
    parseInt(consoleStyle.paddingBottom);

  // Calculate the max height for output based on viewport height
  let maxOutputHeight = window.innerHeight - totalOutsideHeight;

  // If available space is more than 600px, limit it. Otherwise, use available space.
  outputElement.style.height =
    (maxOutputHeight > 600 ? 600 : maxOutputHeight) + "px";
}

function adjustForMobile() {
  // Check if device width is less than or equal to 600px
  if (window.innerWidth <= 600) {
    let inputElement = document.getElementById("input");

    // Make input read-only
    inputElement.setAttribute("readonly", true);

    // Update placeholder text
    inputElement.placeholder = "<Console is disabled for mobile. Use buttons>";

    // Update placeholder font size
    let styleElem = document.createElement("style");
    styleElem.innerHTML = `
            #input::placeholder {
                font-size: 12px; /* You can adjust this value as needed */
            }
        `;
    document.head.appendChild(styleElem);
  }
}

document.addEventListener("DOMContentLoaded", setupDisplay);

function setupDisplay() {
  const isMobile = window.innerWidth < 768;
  ASCII_ART = isMobile ? ASCII_ART_MOBILE : ASCII_ART_DESKTOP;

  const outputElement = document.getElementById("output");
  outputElement.innerHTML = ASCII_ART;

  const asciiElement = outputElement.querySelector("pre");

  // Explicitly set/reset styles
  if (isMobile) {
    asciiElement.style.fontSize = "8px";
  } else {
    asciiElement.style.fontSize = ""; // Reset to default or specify a default size if needed
  }

  if (window.innerWidth > 600) {
    document.getElementById("input").focus();
  }
}

document.getElementById("commands").addEventListener("click", function (event) {
  if (
    event.target.tagName === "SPAN" &&
    event.target.hasAttribute("data-command")
  ) {
    event.preventDefault();
    const displayCommand = event.target.getAttribute("data-display-command");
    const actualCommand = event.target.getAttribute("data-command");

    appendToOutput("root@tribute:~# " + displayCommand);
    executeCommand(actualCommand);
    scrollToBottom();
  }
});

document.getElementById("input").addEventListener("keydown", function (event) {
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
  const commandsList = [
    "story",
    "contracts",
    "buy",
    "tokenomics",
    "contact",
    "clear",
    //"vote",
    "cdaa",
    "brotherhood",
    "42",
  ];
  //if (command === "vote") {
    //setupDisplay();
   // document.getElementById("output").innerHTML = "";
   // embedHTMLPage();
  // return;
 // }
  if (command === "42") {
    setupDisplay();
    document.getElementById("output").innerHTML = "";
    embedHTMLvid();
    return;
  }
  if (command === "clear") {
    setTimeout(() => {
      setupDisplay();
      document.getElementById("output").innerHTML = ASCII_ART;
    }, 800); // 800ms delay
    return;
  }

  if (commandsList.includes(command.toLowerCase())) {
    fetch(`./${command}.txt`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((content) => {
        content = content.replace(
          /(http:\/\/[^\s]+|https:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank">$1</a>'
        );
        appendToOutput(content);
        scrollToBottom();
      })
      .catch((err) => {
        appendToOutput("\nError fetching file content!");
        scrollToBottom();
      });
  } else {
    appendToOutput("Command not found!");
  }
}

function appendToOutput(text) {
  const outputElem = document.getElementById("output");

  if (text.startsWith("root@tribute:~# ")) {
    text = `<div class="command-line">${text}</div>`;
  } else {
    text = text + "<br>";
  }

  // Get existing lines
  let lines = outputElem.innerHTML.split("<br>");

  // Add the new content
  lines.push(text);

  // Keep only the last 100 lines
  lines = lines.slice(-100);

  // Update the output
  outputElem.innerHTML = lines.join("<br>");
}

function scrollToBottom() {
  const output = document.getElementById("output");
  output.scrollTop = output.scrollHeight;
}
function embedHTMLPage() {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("src", "vote.html");
  iframe.style.width = "100%";
  iframe.style.border = "none";

  document.getElementById("output").appendChild(iframe);
  let lastHeight = 0; // variable to store the last known height of the iframe content

  const adjustHeight = () => {
    const currentHeight = iframe.contentWindow.document.body.scrollHeight;

    // Check if the height has changed
    if (lastHeight !== currentHeight) {
      const newHeight = currentHeight + 100;

      iframe.style.height = newHeight + "px";

      // Scroll the #output area to the bottom
      const outputDiv = document.getElementById("output");
      outputDiv.scrollTop = outputDiv.scrollHeight;
      lastHeight = currentHeight + 100;
      // Update lastHeight to the current height
    }
  };

  iframe.onload = function () {
    adjustHeight();
    setInterval(adjustHeight, 2000); // Check for height changes every half a second
  };
}
function embedHTMLvid() {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("src", "vid.html");
  iframe.style.width = "100%";
  iframe.style.border = "none";

  document.getElementById("output").appendChild(iframe);
  let lastHeight = 0; // variable to store the last known height of the iframe content

  const adjustHeight = () => {
    const currentHeight = iframe.contentWindow.document.body.scrollHeight;

    // Check if the height has changed
    if (lastHeight !== currentHeight) {
      const newHeight = currentHeight + 100;

      iframe.style.height = newHeight + "px";

      // Scroll the #output area to the bottom
      const outputDiv = document.getElementById("output");
      outputDiv.scrollTop = outputDiv.scrollHeight;
      lastHeight = currentHeight + 100;
      // Update lastHeight to the current height
    }
  };

  iframe.onload = function () {
    adjustHeight();
    setInterval(adjustHeight, 2000); // Check for height changes every half a second
  };
}
