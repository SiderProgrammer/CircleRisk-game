export default class {
    constructor(scene){
        this.scene = scene;
    }
    swapTargetToTheNearset(){
         this.scene.manager.next_target  = 0
    }
}