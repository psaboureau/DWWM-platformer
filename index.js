const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;

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
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Applique la gravité seulement quand le joueur est en l'air
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity; // Tire (pousse) le joueur vers le bas
    } else {
      // Arrête le joueur quand il touche le bas du canvas
      this.velocity.y = 0;
    }
  }
}

// Définition d'un classe plateforme avec un position(x, y), un largeur(width) et une hauteur(height)
class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.width = 200;
    this.height = 20;
  }

  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

// Instanciate les class Player et Plateform
const player = new Player();
const platforms = [
  new Platform({ x: 200, y: 400 }),
  new Platform({ x: 500, y: 200 }),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

// Track la distance que le joueur a parcouru pour lancer ou non une condition de victoire
// Determine la fin du niveau
let scrollOffset = 0;

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  platforms.forEach((platform) => {
    platform.draw();
  });

  // Si les touches Q ou D sont enfoncés déplacent le joueur vers la gauche ou la droite
  // Vérifie également la position du joueur en bloquant sa position en l'empechant d'atteindre les bords de l'écran
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    // Scroll le background dans la direction opposé du joueur si celui ci est au bords de l'écran
    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
    }
  }

  // Gère la collision avec les plateformes
  // ( collision présente du haut vers le bas mais pas l'inverse)
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });


  if (scrollOffset > 2000) {
    console.log("you win")
  }
}

animate();

// Ecoute si les touches ZQSD sont enfoncés
window.addEventListener("keydown", ({ keyCode }) => {
  // console.log(keyCode);
  switch (keyCode) {
    case 81:
      console.log("left");
      keys.left.pressed = true;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = true;
      break;
    case 90:
      console.log("up");
      player.velocity.y -= 30;
      break;
  }
});

// Ecoute si les touches ZQSD sont relachés
window.addEventListener("keyup", ({ keyCode }) => {
  // console.log(keyCode);
  switch (keyCode) {
    case 81:
      console.log("left");
      keys.left.pressed = false;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = false;
      break;
    case 90:
      console.log("up");
      break;
  }
});
