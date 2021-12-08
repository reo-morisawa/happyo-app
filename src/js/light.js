import { SpotLight } from "three";
import { gsap, Linear } from "gsap";

/* ライトを動かす */
export class LightDriver {
  constructor({ lightParamsArr, scene }) {
    this.lightParamsArr = lightParamsArr;
    this.scene = scene;
    this.lightModels = this.makeLights(this.lightParamsArr);
    this.addToScene();
  }

  // 複数のライトを生成
  makeLights = (lightParamsArr) => {
    if (!Array.isArray(lightParamsArr) || !lightParamsArr.length) {
      return [];
    }
    return lightParamsArr.map((lightParams) => {
      return new LightModel(lightParams);
    });
  }

  // シーンに追加
  addToScene = () => {
    if (!this.scene || !Array.isArray(this.lightModels) || !this.lightModels.length) return;
    this.lightModels.forEach(lightModel => {
      if (!this.scene) return;
      this.scene.add(lightModel.light);
      this.scene.add(lightModel.light.target);
    })
  }

  // アニメーション完了時のライトの挙動
  complete = () => {
    if (!Array.isArray(this.lightModels) || !this.lightModels.length || !Array.isArray(this.timelines) || !this.timelines.length) return;
    console.log('complete', this.timelines)
    this.lightModels.forEach((lightModel) => {
      if (lightModel.light) {
        lightModel.light.angle = Math.PI / 8;
      }
    })
    this.timelines.forEach((tl) => {
      if (tl) {
        tl.pause();
      }
    })
  }

  // ライトのアニメーションを実行
  animate = () => {
    if (!Array.isArray(this.lightModels) || !this.lightModels.length) {
      return [];
    }
    this.timelines = this.lightModels.map((lightModel) => {
      if (!lightModel || !lightModel.light) return;
      const { position } = lightModel.light;
      const { x, y, z } = position;
      const depth = 50;
      const delay = Math.random() * 10;
      const duration = 0.2;
      const timelineLight = gsap.timeline({
        repeat: -1,
        yoyo: false,
        delay: delay,
      });
      timelineLight
        .to(position, {
          x: x - depth,
          y: y,
          z: z,
          duration: duration,
          delay: 0,
          ease: Linear.easeNone
        })
        .to(position, {
          x: x,
          y: y,
          z: z,
          duration: duration,
          delay: 0,
          ease: Linear.easeNone
        })
        .to(position, {
          x: x + depth,
          y: y,
          z: z,
          duration: duration,
          delay: 0,
          ease: Linear.easeNone
        })
        .to(position, {
          x: x,
          y: y,
          z: z,
          duration: duration,
          delay: 0,
          ease: Linear.easeNone
        });
      return timelineLight;
    });
  }
}

/* ライト */
export class LightModel {
  constructor({ color, intensity, distance, angle, penumbra, decay, position, target }) {
    this.light = this.makeLight({ color, intensity, distance, angle, penumbra, decay, position, target });
  }

  // ライトを生成
  makeLight = ({ color = 0xFFFFFF, intensity = 4, distance = 100, angle = Math.PI / 20, penumbra = 0.5, decay = 0.5, position = { x: 0, y: 0, z: 0 }, target }) => {
    const light = new SpotLight(color, intensity, distance, angle, penumbra, decay);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.shadow.camera.fov = 80;
    light.position.set(position.x, position.y, position.z);
    light.target = target;
    return light;
  }
}
