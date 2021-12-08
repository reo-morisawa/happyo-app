import { useEffect, useState } from 'react';
import { WebGLRenderer, Color, Scene, SpotLightHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fontJson from '../assets/fonts/GenEi_Antique_Pv5_Regular.typeface.json';
import audio from '../assets/bgm/ongen.mp3';
import { LightDriver } from './light';
import { TextModel } from './text';
import { CameraDriver } from './camera';
import { LightTargetDriver } from './lightTarget';
import { PlaneModel } from './plane';

const App = () => {
  const [ textReady, setTextReady ] = useState(false);
  const [ goAnimation, setGoAnimation ] = useState(false);
  const [ bgmLoaded, setBgmLoaded ] = useState(false);
  const [ inputText, setInputText ] = useState('');
  const [ bgm, setBgm ] = useState(null);

  const animate = (text) => {
    const resizeRenderer = (renderer) => {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
    
    // bgmを再生
    const playAudio = () => {
      bgm.play();
    }

    const { innerWidth, innerHeight } = window;
    // レンダラーを生成
    const renderer = new WebGLRenderer();
    // レンダラーのサイズを設定
    renderer.setSize(innerWidth, innerHeight)
    
    const canvas = document.getElementById('canvas-container')
    canvas.appendChild(renderer.domElement)
    // シーンを生成
    const scene = new Scene();
    scene.background = new Color('black');
  
    // 床を生成
    const planeModel = new PlaneModel({ textureUrl: 'https://threejsfundamentals.org/threejs/resources/images/checker.png' });
    scene.add(planeModel.mesh);

    // 文字列を生成
    const textModel = new TextModel({ text, fontJson, positionY: 15 });
    scene.add(textModel.mesh);

    // ライトを当てる対象を生成
    const targetDriver = new LightTargetDriver({ 
      frontPosition: { x: 50, y: textModel.positionY, z: 0 }, 
      backPosition: { x: 50, y: textModel.positionY, z: 0 }, 
      scene,
      cy: textModel.positionY 
    });

    // ライトのプロパティ
    const lightParamsArr = [
      { color: 0x00FF00, position: { x: 0, y: 40, z: 50 }, target: targetDriver.targetModel.front.target },
      { color: 0xFF0000, position: { x: -50, y: 40, z: 50 }, target: targetDriver.targetModel.front.target },
      { color: 0x0000FF, position: { x: 50, y: 40, z: 50 }, target: targetDriver.targetModel.front.target },
      { color: 0x00FF00, position: { x: 0, y: 40, z: -50 }, target: targetDriver.targetModel.back.target },
      { color: 0xFF0000, position: { x: 50, y: 40, z: -50 }, target: targetDriver.targetModel.back.target },
      { color: 0x0000FF, position: { x: -50, y: 40, z: -50 }, target: targetDriver.targetModel.back.target },
    ];

    // ライトを生成
    const lightDriver = new LightDriver({ lightParamsArr, scene });
    // ライトのアニメーションを実行
    lightDriver.animate();

    // カメラを生成
    const cameraDriver = new CameraDriver({ 
      cameraParams: { fov: 45, aspect: 2,near: 0.1, far: 100 }, 
      textModel, 
      lightDriver, 
      targetDriver,
      playAudio
    });
    // カメラのアニメーションを実行
    cameraDriver.animate();
    
    // カメラのマウス操作を可能にする
    const controls = new OrbitControls(cameraDriver.cameraModel.camera, canvas);
    controls.target.set(0, textModel.positionY, 0);
    controls.update();
    
    // 毎tick動く
    const render = () => {
    
      if (resizeRenderer(renderer)) {
        const canvas = renderer.domElement;
        cameraDriver.rerender(canvas.clientWidth, canvas.clientHeight);
      }

      if (!cameraDriver.animationComplete) {
        // ライトを当てる対象のアニメーションを実行
        //（実力不足で）gsapで円運動のアニメーションできなかったので、three.jsのアニメーション方式で実装
        targetDriver.animateTick();
      }
  
      renderer.render(scene, cameraDriver.cameraModel.camera);
  
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  useEffect(() => {
    const bgmObj = new Audio(audio);
    setBgm(bgmObj);
    bgmObj.addEventListener('loadeddata',() => {
      // bgmがロード完了したらフラグをtrueに
      setBgmLoaded(true);
    })
  }, [])
  
  useEffect(() => {
    if (!goAnimation || !bgmLoaded) return;
    // 「シミュレートする」ボタン押下し、かつbgmがロード完了していたらアニメーションを実行
    animate(inputText);
  }, [goAnimation, bgmLoaded])

  // 入力エラーチェック
  const hasError = (text) => {
    const MAX_ROWS = 3;
    const MAX_LENGTH = 50;
    if (!text) {
      return 'テキストを入力してください。';
    }
    const rowLength = text.split('\n').length;
    if (rowLength > MAX_ROWS) {
      return `最大行数を超えています。${MAX_ROWS}行に収めてください。`;
    }
    if (text.length > MAX_LENGTH) {
      return `最大文字数を超えています。${MAX_LENGTH}文字以内に収めてください。`;
    }
    return;
  }

  // 入力時
  const handleInput = (e) => {
    if (e && e.target) {
      setInputText(e.target.value);
    }
  }

  // 「テキスト決定」ボタン押下時
  const handleClickTextCompleteButton = () => {
    const error = hasError(inputText)
    if (error) {
      alert(error);
      return;
    }
    // テキスト入力が完了したらフラグをtrueに
    setTextReady(true);
  }

  // 「シミュレートする」ボタン押下時
  const handleClickGoButton = () => {
    // goフラグをtrueに
    setGoAnimation(true);
  }

  // 「戻る」ボタン押下時
  const handleClickBackButton = () => {
    setTextReady(false);
  }

  
  return (
    <div>
      <div id="canvas-container"></div>
      {!goAnimation && (
        <div className="inputWindow">
          <h1 className="inputWindow__title">発表シミュレーター</h1>
          <div className="inputWindow__inputWrapper">
            {textReady ? (
              <div>
                <button className="inputWindow__button inputWindow__button--primary" type="button" onClick={handleClickGoButton}>シミュレートする</button>
                <button className="inputWindow__button" type="button" onClick={handleClickBackButton}>戻る</button>
                <div className="inputWindow__noteWrap">
                  <span className="inputWindow__note">※音が出るのでご注意ください。</span>
                </div>
              </div>
            ) : (
              <>
                <textarea className="inputWindow__input" onChange={handleInput} value={inputText} rows="3"></textarea>
                <div className="inputWindow__noteWrap">
                  <span className="inputWindow__note">※3行以内かつ、50文字以内に収めてください。</span>
                  <span className="inputWindow__note">※1行につき全角8文字以内に収めることをオススメします。</span>
                </div>
                <button className="inputWindow__button" type="button" onClick={handleClickTextCompleteButton}>テキスト決定</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
