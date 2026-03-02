const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기 설정
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 게임 상태
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// 비행기 객체
const player = {
    x: 100,
    y: canvas.height / 2,
    width: 50,
    height: 30,
    speed: 5,
    color: '#FF4500',
    draw() {
        ctx.fillStyle = this.color;
        // 비행기 몸체
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 날개
        ctx.fillStyle = '#DDD';
        ctx.fillRect(this.x - 5, this.y - 25, 10, 50);
        
        // 꼬리
        ctx.beginPath();
        ctx.moveTo(this.x - 20, this.y);
        ctx.lineTo(this.x - 35, this.y - 15);
        ctx.lineTo(this.x - 35, this.y + 15);
        ctx.closePath();
        ctx.fill();
    },
    update() {
        if (keys['ArrowUp'] && this.y > this.height) this.y -= this.speed;
        if (keys['ArrowDown'] && this.y < canvas.height - this.height) this.y += this.speed;
        if (keys['ArrowLeft'] && this.x > this.width) this.x -= this.speed;
        if (keys['ArrowRight'] && this.x < canvas.width - this.width) this.x += this.speed;
    }
};

// 배경 구름
const clouds = [];
for (let i = 0; i < 10; i++) {
    clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 30 + Math.random() * 50,
        speed: 1 + Math.random() * 2
    });
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.5, cloud.y - cloud.size * 0.3, cloud.size * 0.7, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
        ctx.fill();

        cloud.x -= cloud.speed;
        if (cloud.x + cloud.size * 2 < 0) {
            cloud.x = canvas.width + cloud.size * 2;
            cloud.y = Math.random() * canvas.height;
        }
    });
}

// 메인 루프
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 (그라데이션)
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#1E90FF');
    grad.addColorStop(1, '#87CEEB');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawClouds();
    player.update();
    player.draw();

    requestAnimationFrame(animate);
}

animate();