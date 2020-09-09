import Manager from "../levelBasic.js";
import helper from "../helper.js";

export default class level_8 extends Phaser.Scene {
  constructor() {
    super("level_8");
  }

  init(config) {
    this.level = config.level;
    this.score_to_next_level = config.score_to_next_level;

    this.manager = new Manager(this);
    this.manager.init();
  }

  create() {
    this.manager.create();

    this.manager.createGUI();
    this.manager.createFirstTarget();
    this.manager.createTargets();
    this.manager.setNewTarget();

    this.manager.centerTargets();
    this.manager.showTargets();
    this.manager.createStick();
    this.manager.createCircles();
    this.manager.bindInputEvents();
    this.manager.createScoreText();

    helper.sceneIntro(this);
  }
  update() {
    if (!this.manager.game_started) return;
    this.manager.updateRotationAngle();
    this.manager.updateCircleStickAngle();
    this.manager.checkIfMissedTarget();
  }
}
