import { Object3D } from "three";

/* ライトを向ける対象を動かす */
export class LightTargetDriver {
  constructor({ frontPosition, backPosition, scene, angle = 1, cycle = 60, r = 25, cx = 0, cy = 0 }) {
    this.targetModel = {
      front: new LightTargetModel(frontPosition),
      back: new LightTargetModel(backPosition)
    };
    this.scene = scene;
    // 照射角
    this.angle = angle;
    // angle何フレームで一周するか
    this.cycle = cycle;
    // 半径
    this.r = r;
    // xの中心
    this.cx = cx;
    // yの中心
    this.cy = cy;
    this.addToScene();
  }

  // シーンに追加
  addToScene = () => {
    if (!this.scene || !this.targetModel) return;
    this.scene.add(this.targetModel.front.target);
    this.scene.add(this.targetModel.back.target);
  }

  // アニメーションを実行
  animateTick = () => {
    if (!this.targetModel) return;
    const rad = this.angle / this.cycle * Math.PI * 2; // ラジアン角度を求める
    const x = this.r * Math.cos(rad) + this.cx; // x座標を求める
    const y = this.r * Math.sin(rad) + this.cy; // y座標を求める

    this.targetModel.front.setPosition(x, y, 0);
    this.targetModel.back.setPosition(-x, -y, 0);

    this.angle++;
  }
}

/* ライトを向ける対象 */
export class LightTargetModel {
  constructor(position) {
    this.target = this.makeLightTarget(position);
  }

  // ライトを向ける対象のポジションをセット
  setPosition = (x, y, z) => {
    if (!this.target) return;
    this.target.position.set(x, y, z)
  }

  // ライトを向ける対象を生成
  makeLightTarget = (position = { x: 0, y: 0, z: 0 }) => {
    const target = new Object3D();
    target.position.set(position.x, position.y, position.z);
    return target;
  }
}
