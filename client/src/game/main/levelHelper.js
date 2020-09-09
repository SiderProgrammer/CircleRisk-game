export default class LevelHelper {
  constructor(scene) {
    this.scene = scene;
  }
  randomNextTarget() {
    this.scene.next_target = Phaser.Math.Between(
      this.scene.current_target + 1,
      this.scene.current_target + 3
    );
  }
  extendStick() {
    this.scene.stick.displayWidth = Phaser.Math.Distance.BetweenPoints(
      this.scene.circles[1 - this.scene.current_circle],
      this.scene.target_array[this.scene.next_target]
    );
  }
  centerStick() {
    this.scene.stick.setPosition(
      this.scene.circles[1 - this.scene.current_circle].x,
      this.scene.circles[1 - this.scene.current_circle].y
    );
  }

  checkNewTargetsQueue() {
    if (this.scene.next_target > this.scene.config.targets_amount - 1) {
      this.scene.next_target = Phaser.Math.Between(
        1,
        this.scene.next_target - this.scene.config.targets_amount - 1
      );
    }
  }

  calculateMinMaxTargetsPos() {
    const pos = this.scene.target_array.reduce((acc, tar) => {
      if (acc.texture) {
        acc = {
          x: tar.x,
          y: tar.y,
          minY: tar.y,
          minX: tar.x,
        };
      } else {
        if (acc.x < tar.x) {
          acc.x = tar.x;
        }
        if (acc.y < tar.y) {
          acc.y = tar.y;
        }
        if (acc.minY > tar.y) {
          acc.minY = tar.y;
        }
        if (acc.minX > tar.x) {
          acc.minX = tar.x;
        }
      }
      return acc;
    });

    return pos;
  }
}
