(function () {
    // Helper function to get visible text content from the webpage
    function getVisibleTextContent() {
      let textContent = '';
  
      function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const parentStyle = window.getComputedStyle(node.parentElement);
          if (
            parentStyle &&
            parentStyle.visibility === 'visible' &&
            parentStyle.display !== 'none'
          ) {
            textContent += node.textContent.trim() + ' ';
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const style = window.getComputedStyle(node);
          if (style.visibility === 'visible' && style.display !== 'none') {
            for (let child of node.childNodes) {
              traverseNodes(child);
            }
          }
        }
      }
  
      traverseNodes(document.body);
      return textContent.trim().replace(/\s+/g, ' ');
    }
  
    // Helper function to split text into sentences
    function splitIntoSentences(text) {
      return text.match(/[^.!?]*[.!?]/g) || [text];
    }
  
    // Function to create and configure a white canvas
    function createWhiteCanvas() {
      // Clear the page content safely
      console.clear();
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
  
      // Create the canvas
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.backgroundColor = 'white';
      canvas.style.display = 'block';
      canvas.style.margin = '0';
      document.body.style.margin = '0'; // Remove body margin to fit canvas
      document.body.style.overflow = 'hidden'; // Prevent scrollbars
      document.body.appendChild(canvas);
      return canvas;
    }
  
    // Function to animate text on the canvas
    function animateTextOnCanvas(canvas, sentences) {
      const context = canvas.getContext('2d');
      let index = 0;
  
      function displaySentence() {
        if (index >= sentences.length) {
          console.log("Animation complete!");
          return;
        }
  
        const sentence = sentences[index];
        const duration = Math.max(sentence.length * 100, 2000); // Calculate duration based on sentence length
  
        console.log(`Displaying sentence: "${sentence}" for ${duration}ms`);
  
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        // Draw sentence
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = 'black';
        const maxWidth = canvas.width * 0.8;
        const lines = wrapText(context, sentence, maxWidth);
        const lineHeight = 30;
  
        lines.forEach((line, i) => {
          const yOffset = (lineHeight * lines.length) / 2;
          context.fillText(line, canvas.width / 2, canvas.height / 2 - yOffset + i * lineHeight);
        });
  
        // Proceed to the next sentence after duration
        setTimeout(() => {
          index++;
          displaySentence();
        }, duration);
      }
  
      // Start animation
      displaySentence();
    }
  
    // Helper function to wrap text into lines
    function wrapText(context, text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];
  
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
  
      lines.push(currentLine);
      return lines;
    }
  
    // Main execution
    try {
      const textContent = getVisibleTextContent(); // Extract text from the webpage
      if (!textContent) {
        console.error("No visible text found on the webpage!");
        return;
      }
  
      const sentences = splitIntoSentences(textContent); // Split text into sentences
      console.log(`Extracted sentences:`, sentences);
  
      const canvas = createWhiteCanvas(); // Create the white canvas
      animateTextOnCanvas(canvas, sentences); // Animate the text
    } catch (error) {
      console.error("An error occurred:", error);
    }
  })();
  