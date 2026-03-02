const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let score = 0;
let isGameOver = false;
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// 플레이어 비행기
const player = {
    x: 100,
    y: canvas.height / 2,
    width: 60,
    height: 30,
    speed: 7,
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 몸체
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 날개
        ctx.fillStyle = '#DDD';
        ctx.fillRect(-10, -30, 15, 60);
        
        // 조종석
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(10, -5, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    },
    update() {
        if (keys['ArrowUp'] && this.y > 30) this.y -= this.speed;
        if (keys['ArrowDown'] && this.y < canvas.height - 30) this.y += this.speed;
        if (keys['ArrowLeft'] && this.x > 40) this.x -= this.speed;
        if (keys['ArrowRight'] && this.x < canvas.width - 40) this.x += this.speed;
    }
};

// 적 기체
const enemies = [];
function spawnEnemy() {
    if (isGameOver) return;
    enemies.push({
        x: canvas.width + 50,
        y: Math.random() * (canvas.height - 60) + 30,
        width: 50,
        height: 25,
        speed: 4 + Math.random() * 4,
        color: '#2F4F4F'
    });
    setTimeout(spawnEnemy, 1000 + Math.random() * 1000);
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y);
        ctx.lineTo(enemy.x + enemy.width, enemy.y - enemy.height/2);
        ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height/2);
        ctx.closePath();
        ctx.fill();
        
        // 충돌 감지
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 40) {
            endGame();
        }

        // 화면 밖으로 나가면 제거 및 점수 획득
        if (enemy.x + enemy.width < 0) {
            enemies.splice(index, 1);
            score += 10;
            scoreElement.innerText = score;
        }
    });
}

// 구름 배경
const clouds = [];
for (let i = 0; i < 8; i++) {
    clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 40 + Math.random() * 60,
        speed: 0.5 + Math.random() * 1.5
    });
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.fill();
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.size < 0) cloud.x = canvas.width + cloud.size;
    });
}

function endGame() {
    isGameOver = true;
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.innerText = score;
}

function animate() {
    if (isGameOver) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 그라데이션
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#1E90FF');
    grad.addColorStop(1, '#87CEEB');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawClouds();
    drawEnemies();
    player.update();
    player.draw();

    requestAnimationFrame(animate);
}

spawnEnemy();
animate();