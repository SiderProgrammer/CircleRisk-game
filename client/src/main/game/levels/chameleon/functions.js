export default class {
    constructor(scene){
        this.scene = scene
    }
    removeTargetToCatchSkin() {
        this.scene.manager.target_array[this.scene.manager.next_target].setFrame(
          this.scene.manager.target_texture
        )
      }
}