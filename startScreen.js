class startScreen extends Phaser.Scene {
  constructor() {
    super({ key: "startScreen" });
  }
  preload() {
    this.load.audio('music', ['assets/firstSong.mp3']);


  }

  create() {

    this.add.image(400, 300, 'sky');
    let startText1 = this.add.text(180, 100, `Colonel Bunniesworth: \n A Journey Through Space & Time`, { fontSize: '32px', fill: '#fff', fontFamily: 'Roboto', align: 'center' });
    let clickText = this.add.text(330, 200, "~Click to Start~", { fontSize: '24px', fill: '#fff', fontFamily: 'Roboto' });
    this.soundFX = this.sound.add('music', { loop: "true" });


    this.input.keyboard.on('keydown', function(e) {
      if (e.key == "o") {
        this.soundFX.pause();
      }
      if (e.key == "p") {
        this.soundFX.resume();
      }
    }, this);
    this.input.once('pointerdown', function(event) {
      this.soundFX.play();
      // this.soundFX.resume();

      console.log('From SceneB to SceneC');

      this.scene.start('mainGame');

    }, this);
  };
};
