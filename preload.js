class preload extends Phaser.Scene {
  constructor(){
    super({key:"preload"});
  }
 preload ()
{
  let player;
  let stars;
  let bombs;
  let platforms;
  let cursors;
  let score = 0;
  let gameOver = false;
  let scoreText;
  let conditionText;
    this.load.image('sky', '../assets/bg1.png');
    this.load.image('platform', '../assets/platform.png');
    this.load.image('ground', '../assets/ground.jpeg');
    this.load.image('carrot', '../assets/carrot.png');
    this.load.image('bomb', '../assets/bomb.png');
    this.load.spritesheet('dude', '../assets/bunn.png', { frameWidth: 32, frameHeight: 48 });
}
create(){
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
    setScale: 2
  });
  this.scene.start("startScreen");
}
}
