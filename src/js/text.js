import { MeshPhongMaterial, Mesh } from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export class TextModel {
  constructor({ text, fontJson, positionY = 15 }) {
    const loader = new FontLoader();
    // フォントをロードする
    const font = loader.parse(fontJson);

    this.positionY = positionY;
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
    // ジオメトリとマテリアルを渡してメッシュを生成。これをシーンに追加することで画面に表示できる。
    return new Mesh(geometry, materials);
  }

  // 文字自体に関するオブジェクトを作成して返す
  makeGeometry = (text, font) => {
    // font: json形式のfont
    // size: サイズ
    // height: 高さ
    // curveSegments: 曲線上のポイントの数。数値が高いと文字オブジェクトが丸くなる
    // bevelxxxxx: bevelは傾斜とか斜角という意味だが、ここら辺は見ながら設定
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
    // [ 文字の材質, 文字まわり（背景）の材質 ]
    // MeshPhongMaterial: 光沢のある材質, MeshLambertMaterial: マットな材質, MeshStandardMaterial: 中間くらいの材質
    // color: 色
    return [
      new MeshPhongMaterial({ color: textColor }),
      new MeshPhongMaterial({ color: backgroundColor })
    ];
  }
}
