import data from "../src/data.json"

let playerCount = 4;
const maxPlayer = 16;
const minPlayer = 3;
let settingStatus = 0;


let gameData = [...data['GOT']]

let playerCountBox = document.getElementById("playerCountBox");
let addButton = document.getElementById("add")
let subButton = document.getElementById("sub")
let settingButton = document.getElementById("setting-hide")
let settingBox = document.getElementById("setting");
let saveAndRestartButton = document.getElementById("save-button")
let startButton = document.getElementById("start-button")
let wordBox = document.getElementById("wordBox")
let playerBox = document.getElementById("player-box")


function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomGenerator(min, max) {
    let numbers = [];
    let index = 0;

    function shuffle() {
        numbers = [];
        for (let i = min; i <= max; i++) {
            numbers.push(i);
        }

        // Fisher–Yates shuffle
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        index = 0;
    }

    shuffle();

    return function () {
        if (index >= numbers.length) {
            shuffle(); // reset when finished
        }

        return numbers[index++];
    };
}



addButton.addEventListener("click", increment)
subButton.addEventListener("click", decrement)
saveAndRestartButton.addEventListener("click", saveAndRestart)
startButton.addEventListener("click", buttonClick)

settingButton.addEventListener("click", () => {

    if (settingStatus) {
        settingBox.classList.add("hidden")
        settingStatus = 0;

    } else {
        settingStatus = 1
        settingBox.classList.remove("hidden")
    }
})

function increment() {
    subButton.style.cursor = "pointer";
    subButton.style.opacity = 1;
    if (playerCount == maxPlayer) {
        return;
    }
    playerCount++;
    if (playerCount == maxPlayer) {
        addButton.style.cursor = 'not-allowed';
        addButton.style.opacity = 0.5;
    }
    render()
}

function decrement() {
    addButton.style.cursor = "pointer"
    addButton.style.opacity = 1;
    if (playerCount == minPlayer) {
        return;
    }
    playerCount--;
    if (playerCount == minPlayer) {
        subButton.style.cursor = "not-allowed"
        subButton.style.opacity = 0.5;
    }
    render();
}



function render() {
    playerCountBox.innerText = playerCount
}

let word = "";
let imposter = 0;
let currentViewer = 1;
let inView = false;


function buttonClick() {
    if (!inView) {

        if (currentViewer == 1) {
            startGame()
            startButton.innerText = "Hide and Pass"
        }
        else if (currentViewer == playerCount) {
            wordRender();
            startButton.innerText = "Hide and Exit"
        }
        else if (currentViewer == playerCount + 1) {
            startButton.innerText = "Reveal Imposter";
            currentViewer++;
        } else if (currentViewer == playerCount + 2) {
            playerBox.innerText = `Player ${imposter} is `
            wordBox.innerText = `Imposter`
            startButton.innerText = "Restart Game"
            currentViewer++;

        }
        else if (currentViewer == playerCount + 3) {
            endGame()
        }
        else {
            wordRender();
            startButton.innerText = "Hide and Pass"
        }
    } else {

        if (currentViewer == playerCount + 1) {
            playerBox.innerText = `Guess The Word`;
            wordBox.innerText = "Guess The Imposter";
            startButton.innerText = "Reveal Imposter";
        } else {
            playerBox.innerText = ` `;
            wordBox.innerText = `Player ${currentViewer}`;
            startButton.innerText = "Reveal Word";
        }
        inView = false
    }
}

let wordGenerator = createRandomGenerator(0, gameData.length - 1);
function startGame() {
    word = gameData[wordGenerator()];
    imposter = generateRandom(1, playerCount);

    wordRender()
}

function wordRender() {
    playerBox.innerText = `Player ${currentViewer}`;
    wordBox.innerText = currentViewer === imposter ? "Imposter" : word;
    currentViewer++;
    inView = true;
}

function endGame() {
    playerBox.innerText = `Ready?`;
    wordBox.innerText = "Game of Thrones Edition";
    startButton.innerText = "Show my Word";
    word = "";
    imposter = 0;
    currentViewer = 1;
    inView = false;
}


function saveAndRestart() {
    gameData = [];
    document.querySelectorAll(".series-checkbox").forEach((e) => {
        if (e.checked) {
            gameData = [...gameData, ...data[e.value]]
        }
    })
    if (gameData.length < 1) {
        gameData = [...data['GOT']]
        document.getElementById("GOT").checked = true;
    }
    settingBox.classList.add("hidden")
    settingStatus = 0;
    endGame();
    wordGenerator = createRandomGenerator(0, gameData.length - 1);
}
