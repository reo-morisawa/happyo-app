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
    const { camera } = this.cameraModel; // カメラ
    const { positionY } = this.textModel; // テキストのy座標
    const { complete } = this.lightDriver; // カメラのアニメーション終了をライトに通知するための関数
    const { front, back } = this.targetDriver.targetModel; // ライトを当てる対象
    // timelineはgsapの機能。アニメーションのタイムラインを生成。
    // gsap.timelineには以下のようなオプションも付けられる。
    // repeat: タイムラインを繰り返す回数。-1を設定すると無期限に繰り返す。
    // yoyo: trueの場合ヨーヨーのようにアニメーションを前後する。（1=>2=>3=>2=>1とタイムライン上のアニメーションを往復する）
    // delay: アニメーションを始めるまでの遅延時間
    const timelineCamera = gsap.timeline();
    // .set、.to、(.from, .fromTo)をつなげることでアニメーションを連続して再生できる。
    // .setと.toの違い: 物体を指定の位置まで移動するのは共通だが、.setはアニメーションなし、.toはアニメーションなしで移動する。
    timelineCamera
      .set(camera.position, {
        x: 0, // x座標
        y: 50, // y座標
        z: 0, // z座標
        delay: 0, // 遅延時間
        onComplete: () => { // 動作が完了したら実行する
          this.playAudio(); // 音楽を流す
          camera.lookAt(0, 0, 0); // 指定の位置にカメラを向かせる
        }
      })
      .to(camera.position, {
        x: 0,
        y: 40,
        z: 0,
        duration: 1.8, // アニメーションにかける時間
        delay: 0,
        ease: "sine.inOut", // アニメーションのイージング
      })
      .set(camera.position, {
        x: 15,
        y: positionY,
        z: 40,
        delay: 0,
        onComplete: () => {
          camera.lookAt(10, 10, 0);
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
        onComplete: () => {
          camera.lookAt(-10, 10, 0);
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
        onComplete: () => {
          camera.lookAt(-30, 10, 0);
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
      }, 'focus') // 第3引数に文字列を入れると、同じ文言の入っているアニメーションと同時に実行する。
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
    // fov: 視野角
    // aspect: アスペクト比
    // near: 設定した近さまでカメラに映る
    // for: 設定した遠さまでカメラに映る
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    // カメラのポジションをセット
    camera.position.set(position.x, position.y, position.z);
    return camera;
  }

  // カメラを再レンダリング
  rerender = (width, height) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
