export default class {
    constructor(scene){
        this.scene = scene
    }
    removeTargetToCatchSkin() {
        this.scene.manager.target_array[this.scene.manager.next_target].setTexture(
          this.scene.manager.target_texture
        )
      }
}