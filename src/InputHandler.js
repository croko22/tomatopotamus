export default class InputHandler {
  constructor(game, player, playerKeys) {
    this.game = game;
    this.player = player;
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === playerKeys.up ||
          e.key === playerKeys.down ||
          e.key === playerKeys.left ||
          e.key === playerKeys.right) &&
        this.player.keys.indexOf(e.key) === -1
      )
        this.player.keys.push(e.key);
      else if (e.key === playerKeys.shoot) {
        this.player.shootTop();
      } else if (e.key === "b") {
        this.game.debug = !this.game.debug;
      }
      //console.log(e.key); //Debug keys
    });
    window.addEventListener("keyup", (e) => {
      if (this.player.keys.indexOf(e.key) > -1) {
        this.player.keys.splice(this.player.keys.indexOf(e.key), 1);
      }
    });
  }
}
