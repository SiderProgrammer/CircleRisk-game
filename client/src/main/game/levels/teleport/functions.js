export default class {
    constructor(scene) {
        this.scene = scene
    }
    teleportCircle() {
        const { max, min } = this.scene.manager.config.teleport_value
    
        let new_circle_index =
          this.scene.manager.next_target + Phaser.Math.Between(max, min)
    
        new_circle_index = this.scene.manager.helper.normalizeIndexByTargetsAmount(
          new_circle_index
        )
    
        const target_to_be_teleported_to = this.scene.manager.target_array[
          new_circle_index
        ]
    
        // if(new_circle_index === 0) not teleport circle to the center ?
    
        this.scene.manager.circles[1 - this.scene.manager.current_circle].setPosition(
          target_to_be_teleported_to.x,
          target_to_be_teleported_to.y
        )
    
        this.scene.manager.helper.extendStick()
      }
}