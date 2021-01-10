export default class {
    constructor(scene){
        this.scene = scene;
    }
    swapTargetToTheNearset(){
         this.scene.manager.next_target  = 0

         if(this.scene.manager.score >= this.scene.manager.scene.score_to_next_level -1 ){
            this.scene.manager.gameOver()
          }
    }
}