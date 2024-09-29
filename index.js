const spriteRunLeft = "./img/animation/spriteRunLeft.png";
const spriteRunRight = "./img/animation/spriteRunRight.png";
const spriteStandLeft = "./img/animation/spriteStandLeft.png";
const spriteStandRight = "./img/animation/spriteStandRight.png";
const catAnimation = "./img/animation/catAnimation.png";
const cat2Animation = "./img/animation/cat2Animation.png";
const catFaceAnimation = "./img/animation/catFaceAnimation.png";
const catFace2Animation = "./img/animation/catFace2Animation.png";


const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.5;

class Player {
  constructor() {
    this.speed = 5;
    this.position = {
      x: 100,
      y: 270,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.width = 70;
    this.height = 150;
    this.image = createImage(spriteStandRight);
    this.frames = 0;
    this.sprites = {
      // Différentes animations et taille de sprite en fonction de l'idle et de la course
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    // Animation Frame adjustment
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Gravity
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity; // Tire (pousse) le joueur vers le bas
    }
  }
}

class Cat {
  constructor({ x, y, spriteSrc, animationSpeed}) {
    this.position = {
      x,
      y,
    };
    this.width = 80; // Width of each frame in the sprite sheet
    this.height = 62; // Height of each frame in the sprite sheet
    this.sprites = createImage(spriteSrc); // Load the sprite sheet
    this.frames = 0; // Track the current animation frame
    this.totalFrames = 40; // Total number of frames in the sprite sheet
    this.frameInterval = animationSpeed; // Change this value to control the speed (higher = slower)
    this.frameTimer = 0; // Timer to track frame changes
  }

  draw() {
    // Draw the current frame of the animation
    c.drawImage(
      this.sprites,
      this.width * this.frames, // x position on the sprite sheet (crop x)
      0, // y position on the sprite sheet (crop y)
      this.width, // Crop width (each frame's width)
      this.height, // Crop height (each frame's height)
      this.position.x, // x position to draw on the canvas
      this.position.y, // y position to draw on the canvas
      this.width, // Scale the width on the canvas
      this.height // Scale the height on the canvas
    );
  }

  update() {
    // Increment the frameTimer and update frame only if frameTimer exceeds frameInterval
    this.frameTimer++;
    if (this.frameTimer >= this.frameInterval) {
      this.frames++; // Increment the frame counter
      this.frameTimer = 0; // Reset frameTimer

      // Loop the animation once it reaches the last frame
      if (this.frames >= this.totalFrames) {
        this.frames = 0; // Reset back to the first frame
      }
    }

    this.draw(); // Call draw to render the current frame
  }
}

/*

Class Definition

*/

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.width = image.width;
    this.height = image.height;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}


class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.width = image.width;
    this.height = image.height;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

/*

createImage

*/

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

// Object to hold preloaded images without "Src" in the names
const images = {
  firstRoadImage: createImage("./img/firstRoad.png"),
  roadImage: createImage("./img/road.png"),
  firstRoadSurface: createImage("./img/firstRoadSurface.png"),
  treeImage: createImage("./img/tree.png"),
  bikeImage: createImage("./img/bike.png"),
  roadBackgroundImage: createImage("./img/road_background.png"),
  treeRameshImage: createImage("./img/tree_ramesh.png"),
  palmierImage: createImage("./img/palmier.png"),
  shopImage: createImage("./img/shop.png"),
  greenBackgroundImage: createImage("./img/green_background.png"),
  roadMiddleImage: createImage("./img/road_middle.png"),
  grassImage: createImage("./img/grass.png"),
  flowerImage: createImage("./img/flower.png"),
  redFlowerImage: createImage("./img/red_flower.png"),
  truckImage: createImage("./img/truck.png"),
  redTruckImage: createImage("./img/truck_red.png"),
  redlightImage: createImage("./img/redlight.png"),
  panelImage: createImage("./img/panel.png"),
  carImage: createImage("./img/car.png"),
  pizzaImage: createImage("./img/pizza.png")
};

// Initialize player and other elements
let player = new Player();

let cats = [];
let platforms = [];
let genericObjects = [];
let foregroundObjects = [];

let lastKey;
const keys = {
  right: { pressed: false },
  left: { pressed: false },
};

// scrollOffset = win condition = player reach end of screen
let scrollOffset = 0;

function init() {
  // Initialize the player and cat objects
  player = new Player();

  cats = [
    new Cat({x: 20, y: 227, spriteSrc: catFace2Animation, animationSpeed: 9}),
    new Cat({ x: 300, y: 200, spriteSrc: catAnimation , animationSpeed: 10}),
    new Cat({ x: 500, y: 230, spriteSrc: cat2Animation, animationSpeed: 10 }),
    new Cat({x: 850, y: 310, spriteSrc: catFaceAnimation, animationSpeed: 8}),
 
  ];

  platforms = [
    new Platform({ x: 0, y: 420, image: images.firstRoadImage }),
    new Platform({
      x: images.roadImage.width + 121,
      y: 420,
      image: images.roadImage,
    }),
  ];

  genericObjects = [
    new GenericObject({ x: 0, y: 0, image: images.greenBackgroundImage }),
    new GenericObject({ x: 30, y: 0, image: images.shopImage }),
    new GenericObject({ x: 668, y: 380, image: images.roadMiddleImage }),
    new GenericObject({ x: 0, y: 380, image: images.firstRoadSurface }),
    new GenericObject({
      x: images.roadBackgroundImage.width + 82,
      y: 380,
      image: images.roadBackgroundImage,
    }),
    new GenericObject({ x: 190, y: 145, image: images.bikeImage }),
    new GenericObject({ x: 10, y: 50, image: images.treeImage }),
    new GenericObject({ x: 550, y: 75, image: images.treeImage }),
    new GenericObject({x: 670, y: 50, image: images.carImage}),    
    new GenericObject({x: 830, y: -20, image: images.pizzaImage}),

  
    new GenericObject({ x: 120, y: 220, image: images.grassImage }),
    new GenericObject({ x: 320, y: 220, image: images.grassImage }),
    new GenericObject({ x: 400, y: 300, image: images.grassImage }),
    new GenericObject({ x: 700, y: 200, image: images.grassImage }),
    new GenericObject({ x: 900, y: 220, image: images.grassImage }),
    new GenericObject({ x: 1100, y: 230, image: images.grassImage }),
    new GenericObject({ x: 1300, y: 235, image: images.grassImage }),



    new GenericObject({ x: 0, y: 300, image: images.grassImage }),
    new GenericObject({ x: 200, y: 300, image: images.grassImage }),
    new GenericObject({ x: 400, y: 300, image: images.grassImage }),
    new GenericObject({ x: 600, y: 300, image: images.grassImage }),
    new GenericObject({ x: 800, y: 300, image: images.grassImage }),
    new GenericObject({ x: 1000, y: 300, image: images.grassImage }),  
    new GenericObject({ x: 1200, y: 300, image: images.grassImage }),
    new GenericObject({ x: 1400, y: 300, image: images.grassImage }),
    new GenericObject({ x: 1640, y: 300, image: images.grassImage }),




    new GenericObject({x : 620, y: 257, image: images.redlightImage}),
    new GenericObject({x : 740, y: 210, image: images.panelImage})

  ];

  foregroundObjects = [
    new GenericObject({ x: 250, y: 490, image: images.palmierImage }),
    new GenericObject({ x: 250, y: 450, image: images.truckImage }),
    new GenericObject({ x: 60, y: 460, image: images.palmierImage }),
    new GenericObject({ x: 200, y: 520, image: images.palmierImage }),
    new GenericObject({ x: 520, y: 510, image: images.palmierImage }),
    new GenericObject({ x: 1040, y: 360, image: images.redTruckImage }),
  ];

  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();
  cats.forEach((cat) => {
    cat.update();
  });

  foregroundObjects.forEach((foregroundObject) => {
    foregroundObject.draw();
  });

  // Player movement
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    // Platform & GenericObjects & foregroundObjects Scrolling
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      cats.forEach((cat) => {
        cat.position.x -= player.speed;
      });

      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed;
      });
      foregroundObjects.forEach((foregroundObject) => {
        foregroundObject.position.x -= player.speed;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      cats.forEach((cat) => {
        cat.position.x += player.speed;
      });
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed;
      });
      foregroundObjects.forEach((foregroundObject) => {
        foregroundObject.position.x += player.speed;
      });
    }
  }

  // Collision Detection
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

  // Sprites switching
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  // Win condition
  if (scrollOffset > 2000) {
    console.log("you win");
  }

  // Lose condition
  if (player.position.y > canvas.height) {
    init();
  }
}
init();
animate();

/*

Keys Listener

*/
window.addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 81:
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case 90:
      if (player.velocity.y === 0) {
        player.velocity.y -= 14;
      }

      break;
  }
});

window.addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 81:
      keys.left.pressed = false;
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = false;
      break;
    case 90:
      break;
  }
});
