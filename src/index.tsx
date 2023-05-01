import * as THREE from 'three';


// Define a interface Component
interface Component {
  // Define os campos necessários para cada componente
}

// Define a classe Entity
class Entity {
  id: number;
  components: Component[];
  object3D: THREE.Object3D;

  constructor(id: number) {
    this.id = id;
    this.components = [];
    this.object3D = new THREE.Object3D();
  }

  addComponent(component: Component) {
    this.components.push(component);
  }

  removeComponent(componentType: string) {
    this.components = this.components.filter(
      (component) => component.constructor.name !== componentType
    );
  }

  getComponent(componentType: string) {
    return this.components.find(
      (component) => component.constructor.name === componentType
    );
  }
}

// Define os componentes
class PositionComponent implements Component {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class RenderComponent implements Component {
  geometry: THREE.BoxGeometry;
  material: THREE.Material;

  constructor(geometry: THREE.BoxGeometry, material: THREE.Material) {
    this.geometry = geometry;
    this.material = material;
  }
}

class RotationComponent implements Component {
  rotation: THREE.Euler;

  constructor(rotation: THREE.Euler) {
    this.rotation = rotation;
  }
}

class RenderSystem {
  entities: Entity[];
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  constructor(entities: Entity[], container: HTMLElement) {
    this.entities = entities;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    this.entities.forEach((entity) => {
      const renderComponent = entity.getComponent('RenderComponent') as RenderComponent;
      const positionComponent = entity.getComponent('PositionComponent') as PositionComponent;
      const rotationComponent = entity.getComponent('RotationComponent') as RotationComponent;

      if (renderComponent && positionComponent && rotationComponent) {
        const { geometry, material } = renderComponent;
        const { x, y, z } = positionComponent;
        const { rotation } = rotationComponent;

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.rotation.copy(rotation);

        entity.object3D = mesh;
        this.scene.add(mesh);
      }
    });
  }

  update(deltaTime: number) {
    this.entities.forEach((entity) => {
      const positionComponent = entity.getComponent('PositionComponent') as PositionComponent;
      const rotationComponent = entity.getComponent('RotationComponent') as RotationComponent;

      if (positionComponent && rotationComponent) {
        const { x, y, z } = positionComponent;
        const { rotation } = rotationComponent;

        entity.object3D.position.set(x, y, z);
        entity.object3D.rotation.copy(rotation);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}

// Loop do jogo com requestAnimationFrame
class Game {
  frameRate: number;
  deltaTime: number;
  lastFrameTime: number;
  running: boolean;
  renderSystem: RenderSystem;

  constructor(frameRate: number, container: HTMLElement) {
    this.frameRate = frameRate;
    this.deltaTime = 1000 / frameRate;
    this.lastFrameTime = 0;
    this.running = false;
    this.renderSystem = new RenderSystem(entities, container);
  }

  start() {
    this.running = true;
    this.lastFrameTime = performance.now();
    this.loop();
  }

  stop() {
    this.running = false;
  }

  loop() {
    if (!this.running) return;

    const currentTime = performance.now();
    const elapsed = currentTime - this.lastFrameTime;

    if (elapsed >= this.deltaTime) {
      this.renderSystem.update(elapsed);
      this.lastFrameTime = currentTime;
    }

    requestAnimationFrame(() => this.loop());
  }
}

// Uso da engine
const entities: Entity[] = [];

// Criar entidades
const entity1 = new Entity(1);
entity1.addComponent(new PositionComponent(0, 0, 0));
entity1.addComponent(new RenderComponent(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 })));
entity1.addComponent(new RotationComponent(new THREE.Euler(0, 0, 0)));
entities.push(entity1);

const entity2 = new Entity(2);
entity2.addComponent(new PositionComponent(2, 0, 0));
entity2.addComponent(new RenderComponent(new THREE.BoxGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00ff00 })));
entity2.addComponent(new RotationComponent(new THREE.Euler(0, Math.PI / 2, 0)));
entities.push(entity2);

// Criação do container para renderização
const container = document.createElement('div');
document.body.appendChild(container);

// Inicialização do jogo
const game = new Game(60, container);
game.start();