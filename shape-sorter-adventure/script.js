document.addEventListener('DOMContentLoaded', () => {
    const shapeDisplay = document.getElementById('shape-display');
    const targetArea = document.getElementById('target-area');
    const scoreDisplay = document.getElementById('score-display');
    const instructionsDisplay = document.getElementById('instructions');

    const shapes = ['circle', 'square', 'triangle'];
    const shapeImages = {
        circle: 'assets/shapes/circle.png',
        square: 'assets/shapes/square.png',
        triangle: 'assets/shapes/triangle.png'
    };
    const shapeSounds = {
        circle: new Audio('assets/sounds/circle_name.mp3'),
        square: new Audio('assets/sounds/square_name.mp3'),
        triangle: new Audio('assets/sounds/triangle_name.mp3')
    };
    const correctSound = new Audio('assets/sounds/correct.mp3');
    const incorrectSound = new Audio('assets/sounds/incorrect.mp3');

    let currentShapeElement = null;
    let currentShapeType = '';
    let score = 0;

    let scanIndex = 0;
    let scanMode = 'shape'; // 'shape' or 'targets'
    let intervalId;
    const scanSpeed = 1000; // Milliseconds to highlight each item

    const selectableElements = []; // Will hold the current shape and target slots

    function speakShapeName(shape) {
        if (shapeSounds[shape]) {
            shapeSounds[shape].play();
        }
    }

    function generateNewShape() {
        if (currentShapeElement) {
            currentShapeElement.remove();
            currentShapeElement = null;
        }

        const randomIndex = Math.floor(Math.random() * shapes.length);
        currentShapeType = shapes[randomIndex];

        const img = document.createElement('img');
        img.src = shapeImages[currentShapeType];
        img.alt = currentShapeType;

        currentShapeElement = document.createElement('div');
        currentShapeElement.classList.add('current-shape');
        currentShapeElement.dataset.shape = currentShapeType;
        currentShapeElement.appendChild(img);
        shapeDisplay.appendChild(currentShapeElement);

        speakShapeName(currentShapeType);
        instructionsDisplay.textContent = `Match the ${currentShapeType}! Press Spacebar to select.`;

        // Reset scanning to shape mode
        resetScanning();
    }

    function resetScanning() {
        // Clear all existing highlights
        selectableElements.forEach(el => el.classList.remove('highlighted'));

        // Rebuild selectable elements for the new turn
        selectableElements.length = 0; // Clear array
        if (currentShapeElement) {
            selectableElements.push(currentShapeElement);
        }
        document.querySelectorAll('.target-slot').forEach(slot => {
            selectableElements.push(slot);
        });

        scanIndex = 0;
        scanMode = 'shape'; // Always start by highlighting the shape
        startScanning();
    }

    function startScanning() {
        clearInterval(intervalId); // Clear any existing interval
        if (selectableElements.length === 0) return; // No items to scan

        intervalId = setInterval(() => {
            // Remove highlight from previous
            selectableElements[scanIndex].classList.remove('highlighted');

            scanIndex = (scanIndex + 1) % selectableElements.length;

            // Add highlight to current
            selectableElements[scanIndex].classList.add('highlighted');
        }, scanSpeed);
    }

    function stopScanning() {
        clearInterval(intervalId);
        selectableElements.forEach(el => el.classList.remove('highlighted')); // Clear all highlights
    }

    function handleSelection() {
        if (selectableElements.length === 0) return;

        stopScanning(); // Stop scanning when an item is selected

        const selectedElement = selectableElements[scanIndex];

        if (scanMode === 'shape') {
            // User has selected the shape to be sorted
            if (selectedElement === currentShapeElement) {
                // Now, switch scan mode to targets
                scanMode = 'targets';
                instructionsDisplay.textContent = `Now select the matching slot for the ${currentShapeType}.`;
                // Remove highlight from shape and start scanning targets
                currentShapeElement.classList.remove('highlighted');
                selectableElements.length = 0; // Clear array
                document.querySelectorAll('.target-slot').forEach(slot => {
                    selectableElements.push(slot);
                });
                scanIndex = 0; // Start target scan from the beginning
                startScanning();
            }
        } else if (scanMode === 'targets') {
            // User has selected a target slot
            const selectedSlot = selectedElement;
            if (selectedSlot.dataset.shape === currentShapeType) {
                // Correct match!
                correctSound.play();
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
                selectedSlot.classList.add('correct-match'); // Add animation class
                // Briefly show feedback then generate new shape
                setTimeout(() => {
                    selectedSlot.classList.remove('correct-match');
                    generateNewShape();
                }, 700);
            } else {
                // Incorrect match
                incorrectSound.play();
                selectedSlot.classList.add('incorrect-match'); // Add animation class
                instructionsDisplay.textContent = `Oops! Try again for the ${currentShapeType}.`;
                setTimeout(() => {
                    selectedSlot.classList.remove('incorrect-match');
                    // Resume scanning targets for another try
                    startScanning();
                }, 700);
            }
        }
    }

    // Event listener for the single switch (Spacebar)
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // Prevent default spacebar action (e.g., scrolling)
            handleSelection();
        }
    });

    // Initial setup
    generateNewShape();
    startScanning(); // Start scanning immediately after generating the first shape
});