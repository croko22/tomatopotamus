export default class InputHandler {
  constructor(game, player, playerKeys) {
    this.game = game;
    this.player = player;
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase(); // Convert to lowercase to handle caps lock
      if (
        (key === playerKeys.up ||
          key === playerKeys.down ||
          key === playerKeys.left ||
          key === playerKeys.right) &&
        this.player.keys.indexOf(key) === -1
      ) {
        this.player.keys.push(key);
      }
      else if (key === playerKeys.shoot.toLowerCase()) {
        this.player.shootTop();
      } else if (key === playerKeys.debug.toLowerCase()) {
        this.game.debug = !this.game.debug;
      }
    });
    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      if (this.player.keys.indexOf(key) > -1) {
        this.player.keys.splice(this.player.keys.indexOf(key), 1);
      }
    });
  }
}
