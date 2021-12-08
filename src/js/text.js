import { MeshPhongMaterial, Mesh } from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export class TextModel {
  constructor({ text, fontJson, positionY = 15 }) {
    const loader = new FontLoader();
    // フォントをロードする
    const font = loader.parse(fontJson);

    this.positionY = positionY;

    if (!text || !font) return;

    this.geometry = this.makeGeometry(text, font);
    this.materials = this.makeMaterials();
    this.mesh = this.makeMesh(this.geometry, this.materials);
    this.align(this.positionY);
  }

  // 配置を直す
  align = (positionY = 0) => {
    if (!this.geometry || !this.mesh) return;
    this.geometry.center();
    this.mesh.position.setY(positionY);
  }

  // 文字列メッシュを作成して返す
  makeMesh = (geometry, materials) => {
    return new Mesh(geometry, materials);
  }

  // 文字自体に関するオブジェクトを作成して返す
  makeGeometry = (text, font) => {
    return new TextGeometry(text, {
      font: font,
      size: 5,
      height: 3,
      curveSegments: 1,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1
    });
  }

  // 材質のオブジェクトを作成して返す
  makeMaterials = (textColor = Math.random() * 0xffffff, backgroundColor = 0x000000) => {
    return [
      //MeshPhongMaterial, MeshLambertMaterial, MeshStandardMaterial
      new MeshPhongMaterial({ color: textColor, overdraw: 0.5 }),
      new MeshPhongMaterial({ color: backgroundColor, overdraw: 0.5 })
    ];
  }
}
