export default class {
  constructor(scene) {
    this.scene = scene
  }
  tryChangeRotationSpeed() {
    typeof this.scene.changeRotationSpeed === "function" &&
      this.scene.changeRotationSpeed()
  }

  tryShake() {
    typeof this.scene.shake === "function" && this.scene.shake()
  }

  tryCalculateCirclesPosition() {
    if (typeof this.scene.calculateCirclesPosition === "function") {
      ////
      this.scene.calculateCirclesPosition()
    }
  }

  trySwapFunctionsToTheNearset() {
    if (typeof this.scene.swapTargetToTheNearset === "function") {
      this.scene.swapTargetToTheNearset()
    }
  }

  tryHandleFakeTargetToCatch() {
    if (typeof this.scene.handleFakeTargetToCatch === "function") {
      this.scene.handleFakeTargetToCatch() // one fake target
    }
  }

  tryHandleFakeTargetsToCatch() {
    if (typeof this.scene.handleFakeTargetsToCatch === "function") {
      this.scene.handleFakeTargetsToCatch() // many fake targets
    }
  }

  tryRemoveCorrectTargetTextureToCatch() {
    if (typeof this.scene.removeCorrectTargetTextureToCatch === "function") {
      this.scene.removeCorrectTargetTextureToCatch() // many fake targets
    }
  }
  tryRemoveTargetToCatchSkin() {
    if (typeof this.scene.removeTargetToCatchSkin === "function") {
      this.scene.removeTargetToCatchSkin() ///
    }
  }

  tryTeleportCircle() {
    if (typeof this.scene.teleportCircle === "function") {
      this.scene.teleportCircle()
    }
  }

  trySlideCircle() {
    if (typeof this.scene.slideCircle === "function") {
      ////
      this.scene.slideCircle()
    }
  }

  tryDarkenTargets() {
    if (typeof this.scene.darkenTargets === "function") {
      ////
      this.scene.darkenTargets()
    }
  }

  tryHideSetForAWhile() {
    if (typeof this.scene.hideSetForAWhile === "function") {
      ////
      this.scene.hideSetForAWhile()
    }
  }

  tryHideTargets() {
    if (typeof this.scene.hideTargets === "function") {
      this.scene.hideTargets()
    }
  }

  tryBlindTheScreen() {
    if (typeof this.scene.blindTheScreen === "function") {
      this.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          this.scene.blindTheScreen()
        },
      })
    }
  }
}
