import { RepeatWrapping, NearestFilter, TextureLoader, PlaneGeometry, MeshPhongMaterial, DoubleSide, Mesh } from "three";

/* 床 */
export class PlaneModel {
  constructor({ textureUrl, size = 80 }) {
    this.size = 80;

    const loader = new TextureLoader();
    this.texture = loader.load(textureUrl);
    this.texture.wrapS = RepeatWrapping;
    this.texture.wrapT = RepeatWrapping;
    this.texture.magFilter = NearestFilter;

    const repeats = size / 2;
    this.texture.repeat.set(repeats, repeats);

    this.geometry = this.makeGeometry(this.size, this.size);
    this.material = this.makeMaterial(this.texture);
    this.mesh = this.makeMesh(this.geometry, this.material);
    this.mesh.rotation.x = Math.PI * -.5; // 床を回転
  }

  // 床メッシュを作成して返す
  makeMesh = (geometry, materials) => {
    return new Mesh(geometry, materials);
  }

  // 床自体に関するオブジェクトを作成して返す
  makeGeometry = (sizeX, sizeY) => {
    return new PlaneGeometry(sizeX, sizeY);
  }

  // 材質のオブジェクトを作成して返す
  makeMaterial = (texture) => {
    return new MeshPhongMaterial({
      map: texture,
      side: DoubleSide,
    });
  }
}
