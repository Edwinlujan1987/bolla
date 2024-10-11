// Seleziona il canvas e imposta il contesto 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Imposta le dimensioni del canvas per la modalità verticale
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Larghezza e altezza del cane
const dogWidth = 200; 
const dogHeight = 150;

// Carica l'immagine del cane e lo sfondo
const dogImage = new Image();
dogImage.src = 'cane bolla.png'; // Assicurati che il nome del file sia corretto

const backgroundImage = new Image();
backgroundImage.src = 'buon natale.jpeg'; // Assicurati che il nome del file sia corretto

// Carica le immagini degli ostacoli
const obstacleImages = [
    'regalo.png',
    'bastone.png',
    'campana.png',
    'pallina.png'
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Posizione iniziale del cane
let dogX = 50; // Posizione orizzontale
let dogY = canvas.height - dogHeight - 30; // Posizione verticale regolata

// Variabili di gioco
let isJumping = false;
let jumpHeight = 400;
let gameOver = false;
let obstacles = [];
let obstacleSpeed = 8; // Velocità iniziale degli ostacoli
let gravity = 1.2;
let velocity = 0;
let score = 0; // Punteggio per contare i salti
let obstaclesPassed = 0; // Numero di ostacoli superati

// Crea un ostacolo (immagine)
function createObstacle() {
    const randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
    const obstacleWidth = randomImage.width / 4;  // Riduci le dimensioni degli ostacoli (un quarto delle dimensioni originali)
    const obstacleHeight = randomImage.height / 4;
    
    let obstacle = {
        x: canvas.width,
        y: canvas.height - obstacleHeight - 30, // Posiziona l'ostacolo a livello del terreno
        width: obstacleWidth,
        height: obstacleHeight,
        image: randomImage // Immagine dell'ostacolo
    };
    obstacles.push(obstacle);
}

// Funzione per disegnare lo sfondo
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Funzione per disegnare il cane
function drawDog() {
    ctx.drawImage(dogImage, dogX, dogY, dogWidth, dogHeight);
}

// Funzione per disegnare gli ostacoli (immagini)
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Funzione per disegnare il punteggio
function drawScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Salti: ${score}`; // Aggiorna il punteggio
}

// Funzione per aggiornare la posizione degli ostacoli
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed; // Sposta l'ostacolo a sinistra
    });

    // Rimuovi gli ostacoli che escono dal canvas
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

// Funzione per rilevare collisioni
function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            dogX + dogWidth > obstacle.x && // Parte destra del cane rispetto all'ostacolo
            dogX < obstacle.x + obstacle.width && // Parte sinistra del cane
            dogY + dogHeight > obstacle.y // Parte inferiore del cane
        ) {
            gameOver = true; // Collisione rilevata, il gioco termina
        }
    });
}

// Funzione per il salto
function jump() {
    if (!isJumping) {
        isJumping = true;
        velocity = -35; // Impulso iniziale per il salto
        score++; // Incrementa il punteggio per ogni salto
    }
}

// Funzione per aggiornare la velocità degli ostacoli
function updateSpeed() {
    obstaclesPassed++;
    if (obstaclesPassed % 5 === 0) {
        obstacleSpeed++; // Aumenta la velocità di 1 ogni 5 ostacoli
    }
}

// Funzione principale del gioco
function gameLoop() {
    if (!gameOver) {
        drawBackground(); // Disegna lo sfondo
        drawDog(); // Disegna il cane
        drawObstacles(); // Disegna gli ostacoli
        drawScore(); // Disegna il punteggio
        updateObstacles(); // Aggiorna la posizione degli ostacoli
        checkCollision(); // Controlla le collisioni

        // Gravità e movimento del salto
        if (isJumping) {
            dogY += velocity; // Muovi il cane in base alla velocità
            velocity += gravity; // Aggiungi la gravità alla velocità

            if (dogY >= canvas.height - dogHeight - 30) { // Se il cane tocca il terreno
                dogY = canvas.height - dogHeight - 30; // Fissalo a terra
                isJumping = false; // Fine del salto
            }
        }

        requestAnimationFrame(gameLoop); // Ripeti il loop del gioco
    } else {
        // Messaggio di fine gioco
        alert('Game Over! Hai sbattuto contro un ostacolo. Riprova!');
        document.location.reload();
    }
}

// Genera ostacoli in intervalli di tempo regolari
setInterval(() => {
    createObstacle(); // Crea un nuovo ostacolo
    updateSpeed(); // Aggiorna la velocità degli ostacoli
}, 2000); // Crea un nuovo ostacolo ogni 2 secondi

// Controllo touch per dispositivi mobili
canvas.addEventListener('touchstart', function() {
    jump();
});

// Controllo per il tasto spazio
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        jump(); // Salta quando viene premuto il tasto spazio
    }
});

// Avvia il loop del gioco
gameLoop();
