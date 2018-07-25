class gameOver extends Phaser.Scene{
  constructor(){
    super({key:"gameOver"});
  }

  create(){
    this.add.image(400, 300, 'sky');
    let startText = this.add.text(250, 100, "Want to play again?", { fontSize: '32px', fill: '#fff', fontFamily : 'Roboto'});
    let clickText = this.add.text(350, 150, "Press ENTER to start!", { fontSize: '24px', fill: '#fff', fontFamily : 'Roboto'});

    this.key_Enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

};
update(){
  let keydownTime;
  keydownTime = this.key_Enter.duration;
  if(this.key_Enter.duration != 0){
    this.scene.start('mainGame');
    this.key_Enter.duration = 0;
  };
};
  }
