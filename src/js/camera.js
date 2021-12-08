import { PerspectiveCamera } from "three";
import { gsap } from "gsap";

/* カメラを動かす */
export class CameraDriver {
  constructor({ cameraParams, textModel, lightDriver, targetDriver, playAudio }) {
    this.cameraModel = new CameraModel(cameraParams);
    this.textModel = textModel;
    this.lightDriver = lightDriver;
    this.targetDriver = targetDriver;
    this.animationComplete = false;
    this.playAudio = playAudio;
  }

  // カメラのアニメーションを実行
  animate = () => {
    if (!this.cameraModel || !this.textModel || !this.lightDriver || !this.targetDriver) return;
    const { camera } = this.cameraModel;
    const { positionY } = this.textModel;
    const { complete } = this.lightDriver;
    const { front, back } = this.targetDriver.targetModel;
    console.log(back.target.position)
    console.log(back)
    const timelineCamera = gsap.timeline({
      yoyo: false,
    });
    timelineCamera
      .set(camera.position, {
        x: 0,
        y: 50,
        z: 0,
        delay: 0,
        ease: "sine.in",
        onComplete: () => {
          this.playAudio();
          camera.lookAt(0, 0, 0)
        }
      })
      .to(camera.position, {
        x: 0,
        y: 40,
        z: 0,
        duration: 1.8,
        delay: 0,
        ease: "sine.inOut",
      })
      .set(camera.position, {
        x: 15,
        y: positionY,
        z: 40,
        delay: 0,
        ease: "sine.in",
        onComplete: () => {
          camera.lookAt(10, 10, 0)
        }
      })
      .to(camera.position, {
        x: 15,
        y: positionY,
        z: 10,
        duration: 2,
        delay: 0,
        ease: "sine.inOut",
      })
      .set(camera.position, {
        x: -15,
        y: positionY,
        z: 40,
        delay: 0,
        ease: "sine.in",
        onComplete: () => {
          camera.lookAt(-10, 10, 0)
        }
      })
      .to(camera.position, {
        x: -15,
        y: positionY,
        z: -10,
        duration: 2.6,
        delay: 0,
        ease: "sine.in",
      })
      .set(camera.position, {
        x: -30,
        y: positionY,
        z: 40,
        delay: 0,
        ease: "sine.in",
        onComplete: () => {
          camera.lookAt(-30, 10, 0)
        }
      })
      .to(camera.position, {
        x: 30,
        y: positionY,
        z: 40,
        duration: 4.2,
        delay: 0,
        ease: "sine.in",
      })
      .set(camera.position, {
        x: 0,
        y: positionY,
        z: 0,
        delay: 0,
        ease: "sine.in",
        onComplete: () => {
          camera.lookAt(0, positionY, 0)
          this.animationComplete = true;
        }
      })
      .to(camera.position, {
        x: 0,
        y: positionY,
        z: 40,
        duration: 0.5,
        delay: 0,
        ease: "sine.in"
      }, 'focus')
      .to(back.target.position, {
        x: 0,
        y: positionY,
        z: 0,
        duration: 0.5,
        delay: 0,
        ease: "sine.in"
      }, 'focus')
      .to(front.target.position, {
        x: 0,
        y: positionY - 2,
        z: 0,
        duration: 0.5,
        delay: 0,
        ease: "sine.in",
        onComplete: () => {
          complete();
        }
      }, 'focus');
    this.timeline = timelineCamera;
  }

  // カメラを再レンダリング
  rerender = (width, height) => {
    if (!this.cameraModel) return;
    this.cameraModel.rerender(width, height);
  }
}

/* カメラ */
export class CameraModel {
  constructor({ fov, aspect, near, far, position }) {
    this.camera = this.makeCamera({ fov, aspect, near, far, position });
  }

  // カメラを生成
  makeCamera = ({ fov = 45, aspect = 2, near = 0.1, far = 100, position = { x: 0, y: 0, z: 0 } }) => {
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(position.x, position.y, position.z);
    return camera;
  }

  // カメラを再レンダリング
  rerender = (width, height) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
