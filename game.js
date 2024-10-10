// Seleziona il canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Imposta la dimensione del canvas per adattarlo alla finestra
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Definizione delle variabili di fisica e cane
let gravity = 0.6;
let jumpStrength = 15;
let groundLevel = canvas.height - 80; // Regolato per far apparire il cane correttamente

// Definizione dell'immagine del cane
let dogImage = new Image();
dogImage.src = 'cane bolla.png';  // Usa l'immagine che hai inserito

// Definizione del cane
let dog = {
    x: 50,
    y: groundLevel - 150, // Imposta Y più alto per il cane
    width: 200,  // Larghezza dell'immagine del cane
    height: 150, // Altezza dell'immagine del cane
    velocityY: 0,
    isOnGround: true,
};

// Definizione degli ostacoli
let obstacles = [];
let obstacleSpeed = 5;

function generateObstacle() {
    const size = Math.random() * 50 + 20;
    obstacles.push({
        x: canvas.width,
        y: groundLevel - size,
        width: size,
        height: size,
        color: '#FF0000' // Rosso per i regali/ostacoli
    });
}

setInterval(generateObstacle, 2000); // Genera un nuovo ostacolo ogni 2 secondi

// Event listener per il salto tramite tasto
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && dog.isOnGround) {
        dog.velocityY = -jumpStrength;
        dog.isOnGround = false;
    }
});

// Event listener per il salto tramite touch
canvas.addEventListener('touchstart', function (event) {
    event.preventDefault(); // Previene lo scrolling del browser
    if (dog.isOnGround) {
        dog.velocityY = -jumpStrength;
        dog.isOnGround = false;
    }
});

// Funzione per aggiornare la posizione del cane e degli ostacoli
function update() {
    // Gravità
    if (!dog.isOnGround) {
        dog.velocityY += gravity;
        dog.y += dog.velocityY;
        if (dog.y >= groundLevel - dog.height) {
            dog.y = groundLevel - dog.height;
            dog.isOnGround = true;
            dog.velocityY = 0;
        }
    }

    // Aggiornamento ostacoli
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;
    });

    // Rimuovi gli ostacoli fuori dallo schermo
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Controllo collisioni
    obstacles.forEach(obstacle => {
        if (
            dog.x < obstacle.x + obstacle.width &&
            dog.x + dog.width > obstacle.x &&
            dog.y < obstacle.y + obstacle.height &&
            dog.y + dog.height > obstacle.y
        ) {
            alert("Hai perso! Il cane ha colpito un ostacolo!");
            document.location.reload();
        }
    });
}

// Funzione per disegnare il cane e gli ostacoli
function draw() {
    // Pulire il canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Disegna il cane (usando l'immagine)
    ctx.drawImage(dogImage, dog.x, dog.y, dog.width, dog.height);

    // Disegna gli ostacoli
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Disegna l'albero di Natale
    ctx.fillStyle = tree.color;
    ctx.fillRect(tree.x, tree.y, tree.width, tree.height);
}

// Definizione dell'albero di Natale
let tree = {
    x: canvas.width - 100, // Posizionato verso la fine dello schermo
    y: groundLevel - 100,
    width: 50,
    height: 100,
    color: '#008000' // Verde per l'albero
};

// Controllo per vedere se il cane ha raggiunto l'albero
function checkWin() {
    if (dog.x + dog.width >= tree.x) {
        alert("Hai vinto! Il cane ha raggiunto l'albero di Natale!");
        document.location.reload();
    }
}

// Avvia il gioco solo dopo che l'immagine è stata caricata
dogImage.onload = function() {
    gameLoop(); // Inizia il gioco
};

// Ciclo di gioco
function gameLoop() {
    update();
    draw();
    checkWin();
    requestAnimationFrame(gameLoop);
}
