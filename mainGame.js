class mainGame extends Phaser.Scene {
  constructor() {
    super({ key: "mainGame" });
  }

  create() {
    let gameOver;
    this.gameOver = false;
    this.platsHidden = false;
    let player;
    let carrots;
    let bombs;
    let cursors;
    let score = 0;
    let scoreText;
    let conditionText;
    let platforms;

    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    const platCreator = () => {

      //  The platforms group contains the ground and the 2 ledges we can jump on
      this.platforms = this.physics.add.staticGroup();

      function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }

      //  Here we create the ground.
      //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
      this.platforms.create(400, 568, 'ground').refreshBody();
      //  Now let's create some ledges

      let xRands = [getRndInteger(70, 730), getRndInteger(70, 730), getRndInteger(70, 730), getRndInteger(70, 730)];
      let yRands = [getRndInteger(450, 475), 0, 0, 0];
      for (let i = 1; i < yRands.length; i++) {
        yRands[i] = yRands[i - 1] - 80;
      }
      let y = false;
      checkRanges(400, xRands, 70, 730);


      // Checks that the X ranges are close enough to each other to avoid being unreachable
      function checkRanges(range, array, min, max) {
        let i = 0;
        // sets loop name to be continued if needed
        checkRanges:
          while (true) {
            for (i = 0; i < array.length - 1; i++) {
              // sets the sum to be evaluated to a non-negative number
              let sum = array[i] - array[i + 1];
              // If it is a negative than it needs to be swapped and re-evaluated
              if (sum < 0) {
                sum = array[i + 1] - array[i];
              }

              // Confirms that current and next platform are within 100 of each other
              // If they are not they are both re-evaluated
              if (sum < range && sum > 75) {}
              else {
                array[i] = getRndInteger(min, max);
                array[i + 1] = getRndInteger(min, max);
                // set i back to zero to begin loop again to confirm all still in range
                i = 0;
                checkRanges(range, array, min, max);
              }
            }
            break;
          }

      } // Prints values to console
      xRands.forEach(function(value, i) { console.log("Rand X " + i + ": " + value) });
      yRands.forEach(function(value, i) { console.log("Rand Y " + i + ": " + value) });

      //Platforms are finally added to the staticGroup
      this.platforms.create(xRands[0], yRands[0], 'platform');
      this.platforms.create(xRands[1], yRands[1], 'platform');
      this.platforms.create(xRands[2], yRands[2], 'platform');
      this.platforms.create(xRands[3], yRands[3], 'platform');
    }

    // The player and its settings
    this.player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some carrots to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    carrots = this.physics.add.group({
      key: 'carrot',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    carrots.children.iterate(function(child) {

      //  Give each carrot a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(0, 5, 'Score: 0', { fontSize: '32px', fill: '#fff', fontFamily: 'Roboto' });

    // Shows texting depending on current state
    this.conditionText = this.add.text(350, 300, 'Game Over', { fontSize: '32px', fill: '#fff', fontFamily: 'Roboto' });
    this.conditionText.visible = false;

    const addCollide = () => {

      //  Collide the player and the carrots with the platforms
      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(carrots, this.platforms);
      this.physics.add.collider(bombs, this.platforms);
    }
    // Calls the creation of the platforms
    platCreator();
    // Wrapped the collider in function so that the collision is always added after platform creation
    addCollide();
    const collectCarrot = (player, carrot) => {
      carrot.disableBody(true, true);

      //  Add and update the score
      score += 10;
      scoreText.setText('Score: ' + score);

      if (carrots.countActive(true) === 0) {
        // First make the platforms invisible
        this.platforms.toggleVisible();
        // Get all children of the platforms
        let kinder = this.platforms.getChildren();
        // Iterate through the platforms and remove and clear them
        for (let i = 0; i < kinder.length; i++) {
          this.platforms.clear(true);
        }
        platCreator();
        addCollide();

        //  A new batch of carrots to collect
        carrots.children.iterate(function(child) {

          child.enableBody(true, child.x, 0, true, true);

        });

        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        let bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

      }
    }

    const hitBomb = (player, bomb) => {
      this.physics.destroy();

      this.player.setTint(0xff0000);

      this.player.anims.play('turn');
      this.gameOver = true;
    }
    //  Checks to see if the player overlaps with any of the carrots, if he does call the collectCarrot function
    this.physics.add.overlap(this.player, carrots, collectCarrot, null, this);

    this.physics.add.collider(this.player, bombs, hitBomb, null, this);
    //  Text a
    this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.key_Enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

  }

  update() {
    if (this.gameOver) {
      if (this.platsHidden == false) {
        // First make the platforms invisible
        this.platforms.toggleVisible();
        this.platsHidden = true;
      }
      this.conditionText.visible = true;
      const gameLost = setTimeout(() => {
        this.conditionText.visible = false;

        this.scene.start("gameOver");

      }, 2000);

    }
    let cursors = this.input.keyboard.createCursorKeys();
    this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.key_Space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    if (cursors.left.isDown || this.key_A.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    }
    else if (cursors.right.isDown || this.key_D.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    }
    else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if ((cursors.up.isDown || this.key_W.isDown || this.key_Space.isDown) && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
    if (cursors.down.isDown || this.key_S.isDown) {
      this.player.setVelocityY(165);

    }
  }

};
