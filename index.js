
const spriteRunLeft = './img/animation/spriteRunLeft.png';
const spriteRunRight = './img/animation/spriteRunRight.png';
const spriteStandLeft = './img/animation/spriteStandLeft.png';
const spriteStandRight = './img/animation/spriteStandRight.png';

const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;



/*

Player Class

*/



class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 270,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.width = 66
    this.height = 150;
    this.image = createImage(spriteStandRight)
    this.frames = 0
    this.sprites = {
      // Différentes animations et taille de sprite en fonction de l'idle et de la course
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875
      }
    }


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
      this.height)
  }

  update() {

    // Animation Frame adjustment
    this.frames++
    if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) {
      this.frames = 0;
    } else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) {
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
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

// TODO: Special class pour les ParallaxObjects
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
    c.drawImage(this.image, this.position.x, this.position.y)
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
const roadImageSrc = './img/road.png'
const treeImageSrc = './img/tree.png'
const bikeImageSrc = './img/bike.png'
const roadBackgroundImageSrc = './img/road_background.png'
const treeRameshImageSrc = './img/tree_ramesh.png'



let roadImage = createImage(roadImageSrc)
let treeImage = createImage(treeImageSrc)
let bikeImage = createImage(bikeImageSrc)
let roadBackgroundImage = createImage(roadBackgroundImageSrc)
let treeRameshImage = createImage(treeRameshImageSrc)

let player = new Player();


let platforms = [];
let genericObjects = []; 



let lastKey;
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

// scrollOffset = win condition = player reach end of screen
let scrollOffset = 0;




/*

Init

*/



function init() {

 roadImage = createImage(roadImageSrc)
 treeImage = createImage(treeImageSrc)
bikeImage = createImage(bikeImageSrc)
roadBackgroundImage = createImage(roadBackgroundImageSrc)
treeRameshImage = createImage(treeRameshImageSrc)

player = new Player()

      /*

      Init Platforms

      */


 platforms = [
  new Platform({ x: 0, y: 420, image: roadImage }),
  new Platform({ x: roadImage.width + 250, y: 420, image: roadImage })
  
];


      /* 

      Init Generic Object

      */


genericObjects = [
  new GenericObject({
    x:0,
    y: 380,
    image: roadBackgroundImage
  }),  
  new GenericObject({
    x:roadBackgroundImage.width + 250,
    y: 380,
    image: roadBackgroundImage
  }),
  new GenericObject({
    x: 200,
    y: 10,
    image: treeRameshImage
  }),
  new GenericObject({
    x: 10,
    y: 40,
    image: treeImage
  }),
  new GenericObject({
    x: 500,
    y: 150,
    image: treeImage
  }),
  new GenericObject({
    x: 400,
    y: 230,
    image: bikeImage
  }),
  new GenericObject({
    x: 700,
    y: 280,
    image: bikeImage
  }),
  new GenericObject({
    x: 900,
    y: 230,
    image: bikeImage
  }) 

];


scrollOffset = 0;



}

/*

End Init


*/












/*

  ANIMATE


*/


function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw()
  })

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();



  // Player movement
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) || 
 ( keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;




    // Platform & GenericObject Scrolling
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed;
      })
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed;
      })
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
    lastKey === 'right' &&
    player.currentSprite !== player.sprites.run.right) 
    {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  } else if (
    keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite !== player.sprites.run.left) 
    {
    player.currentSprite = player.sprites.run.left
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  }
  else if (
    !keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite !== player.sprites.stand.left) 
    {
    player.currentSprite = player.sprites.stand.left
    player.currentCropWidth = player.sprites.stand.cropWidth
    player.width = player.sprites.stand.width
  }
  else if (
    !keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite !== player.sprites.stand.right) 
    {
    player.currentSprite = player.sprites.stand.right
    player.currentCropWidth = player.sprites.stand.cropWidth
    player.width = player.sprites.stand.width
  }

  
  
  // Win condition
  if (scrollOffset > 2000) {
    console.log("you win")
  }


  // Lose condition
  if (player.position.y > canvas.height ) {
    init();
  }

}
init()
animate();









/*

Keys Listener

*/
window.addEventListener("keydown", ({ keyCode }) => {

  switch (keyCode) {
    case 81:
      keys.left.pressed = true;
      lastKey = "left"
      break;
    case 83:

      break;
    case 68:
      keys.right.pressed = true;
      lastKey = "right"
      break;
    case 90:
      if (player.velocity.y === 0  ) {
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
