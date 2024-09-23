const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gravity = 0.1;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.width = 30;
    this.height = 30;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    
    // Apply gravity only if the player is in the air
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.position.y += this.velocity.y;
      this.velocity.y += gravity; // Increase velocity due to gravity
    } else {
      // Stop the player at the bottom

      this.velocity.y = 0;
    
    }
  }
}

const player = new Player();

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
}

animate();

window.addEventListener('keydown',  ({ keyCode }) => {
    console.log(keyCode)
})