const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const [window_height, window_width] = [window.innerHeight, window.innerWidth];
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    Object.assign(this, { posX: x, posY: y, radius, color, text, speed, dx: 2 * speed, dy: 2 * speed });
    this.collideFrames = this.lineWidth = 0;
    this.isColliding = false;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.isColliding || this.collideFrames > 0 ? "#0000FF" : this.color;
    context.font = "20px Arial";
    context.textAlign = context.textBaseline = "center";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = this.lineWidth = 6;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    context.stroke();
  }

  update() {
    this.draw(ctx);
    if (this.collideFrames > 0) this.collideFrames--;
    this.posX += this.dx;
    this.posY += this.dy;
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) this.dx = -this.dx;
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) this.dy = -this.dy;
  }
}

let circles = [];

const isOverlapping = (newCircle) =>
  circles.some(({ posX, posY, radius }) =>
    Math.hypot(newCircle.posX - posX, newCircle.posY - posY) < newCircle.radius + radius + 10
  );

function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 40 + 30;
    let x = Math.random() * (window_width - 2 * radius) + radius;
    let y = window_height - radius;
    let newCircle = new Circle(x, y, radius, `#${Math.floor(Math.random() * 16777215).toString(16)}`, `C${i + 1}`, Math.random() * 2 + 1);
    while (isOverlapping(newCircle)) newCircle.posX = Math.random() * (window_width - 2 * radius) + radius;
    circles.push(newCircle);
  }
}

function animate() {
  ctx.clearRect(0, 0, window_width, window_height);
  checkCollisions();
  circles.forEach((circle) => circle.update());
  requestAnimationFrame(animate);
}

const detectCollision = (circle1, circle2) =>
  Math.hypot(circle1.posX - circle2.posX, circle1.posY - circle2.posY) < circle1.radius + circle2.radius;

function checkCollisions() {
  circles.forEach((circle, i) => {
    circle.isColliding = false;
    for (let j = i + 1; j < circles.length; j++) {
      if (detectCollision(circle, circles[j])) {
        circle.isColliding = circles[j].isColliding = true;
        [circle.dx, circle.dy, circles[j].dx, circles[j].dy] = [-circle.dx, -circle.dy, -circles[j].dx, -circles[j].dy];
        circle.collideFrames = circles[j].collideFrames = 20;
      }
    }
  });
}

canvas.addEventListener("click", ({ clientX, clientY }) => {
  circles = circles.filter(({ posX, posY, radius, lineWidth }) =>
    Math.hypot(clientX - posX, clientY - posY) >= radius + lineWidth
  );
});

generateCircles(10);
animate();
