let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'gameDiv',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
        }
    },
    scene: [preload, startScreen, mainGame, gameOver]
};

function resize() {
    let canvas = document.querySelector("canvas");
    let width = (window.innerWidth) * .80;
    let height = (window.innerHeight) * .80;
    let wratio = width / height;
    let ratio = config.width / config.height;
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    }
    else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}

window.onload = () => {
    // new Phaser.Game(C)
    game = new Phaser.Game(config);
    resize()
    window.addEventListener("resize", resize, false)
}
