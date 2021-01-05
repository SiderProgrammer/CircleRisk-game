export default class {
    constructor(scene){
        this.scene = scene;
    }
    swapTargetToTheNearset(){
        this.scene.manager.next_target  = this.scene.manager.current_target+1;
    }
}