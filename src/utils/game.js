import { 
  Engine, 
  HDRCubeTexture, 
  Scene, 
  UniversalCamera, 
  HemisphericLight,
  Vector3,
  Color3,
  StandardMaterial,
  Texture,
  AssetsManager,
  Mesh
 } from "babylonjs"
import GUI from 'babylonjs-gui';


export default class Game{

  constructor(canvas){
    this.canvas = canvas;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color3.FromHexString("#888888");
    this.createScene();
    this.runEngineLoop();  
  }

  createScene(){
    this.camera = new UniversalCamera("UniversalCamera", new Vector3(-90, -10, -10), this.scene);
    this.camera.rotation.x = -3;
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(this.canvas, true);
    this.camera.keysLeft= [65];
    this.camera.keysRight=[68];
    this.camera.keysUp = [87];
    this.camera.keysDown = [83];

    //add light
    this.addLighting();
    // Skybox
    this.generateSkybox();
    
    this.generateMeshes();
    // this.generateModels();
    return this.scene;
  }
  runEngineLoop(){
    this.engine.runRenderLoop(() => {
      if (this.back){
        if (this.box1.position.x >= -50){
          this.box1.position.x -= 1;
        }
      }
      else{
        if (this.box1.position.x <= 50){
          this.box1.position.x += 1;
        }
      }
      this.scene.render();
    });
  }
  getGameInstance(){
    return this.canvas;
  }

  addLighting(){
    var light = new HemisphericLight("hemiLight", new Vector3(-1, 1, 0), this.scene);
    light.diffuse = new Color3(1, 0, 0);
  }

  generateSkybox(){
    this.skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:300.0}, this.scene);
    // skybox.checkCollisions = true;
    this.skybox.ellipsoid = new Vector3(3,3,3);
    
    this.skyboxMaterial = new StandardMaterial("skyBox", this.scene);
    this.skyboxMaterial.backFaceCulling = false;
    this.skyboxMaterial.reflectionTexture = new HDRCubeTexture('src/utils/moonlit_golf_2k.hdr', this.scene, 512, false, true, false, true);
    this.skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    this.skyboxMaterial.disableLighting = true;

    this.skybox.material = this.skyboxMaterial;			
  }

  generateModels(){
    this.assetsLoader = new AssetsManager(this.scene);
    this.planeModel = this.assetsLoader.addMeshTask("ship", "", "models/", "ship.obj");

    this.assetsLoader.onFinish = (tasks) => {
      console.log(this.scene.meshes.length);
      this.runEngineLoop();
      console.log('assets loaded');
    }
    this.assetsLoader.load();
  }

  generateMeshes(){
    this.box1 =  new Mesh.CreateBox("Box1", 5, this.scene);
    // const ground = new Mesh.CreateGround("ground1", 400, 400, 1, this.scene);
    
    const whiteMaterial = new StandardMaterial("box1_mat",this.scene);

    const coralMaterial = new StandardMaterial("coral_mat", this.scene);
    whiteMaterial.diffuseColor = new Color3.White();
    whiteMaterial.alpha = 1;
    coralMaterial.diffuseColor = new Color3.FromHexString("#FF7F50");
    whiteMaterial.alpha = 1;

    // ground.material = whiteMaterial;
    this.box1.material = coralMaterial;

    // console.log(ground.material);

    // ground.checkCollisions=true;
    // ground.receiveShadows = true;
    this.box1.position.x=5;
    this.box1.position.y=-15;
    // ground.position.y =-16;

    this.scene.gravity = new Vector3(0, -9.81, 0);
    this.scene.collisionsEnabled = true;

  }

  moveBox(back){
    this.back = back;
  }
}