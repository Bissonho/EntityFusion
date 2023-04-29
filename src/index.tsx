// Define the Component interface
interface Component {
    // Define the necessary fields for each component
  }
  
  // Define the Entity class
  class Entity {
    id: number;
    components: Component[];
  
    constructor(id: number) {
      this.id = id;
      this.components = [];
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
  
  // Define the components
  class PositionComponent implements Component {
    x: number;
    y: number;
  
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }
  
  class RenderComponent implements Component {
    sprite: string;
  
    constructor(sprite: string) {
      this.sprite = sprite;
    }
  }
  
  class RotationComponent implements Component {
    rotation: number;
  
    constructor(rotation: number) {
      this.rotation = rotation;
    }
  }
  
  // Define the systems
  class RenderSystem {
    entities: Entity[];
    frameRate: number;
    intervalId: number;
  
    constructor(entities: Entity[], frameRate: number) {
      this.entities = entities;
      this.frameRate = frameRate;
      this.intervalId = 0;
    }
  
    start() {
      const intervalTime = 1000 / this.frameRate;
      this.intervalId = setInterval(() => this.update(), intervalTime);
    }
  
    stop() {
      clearInterval(this.intervalId);
    }
  
    update() {
      for (const entity of this.entities) {
        const positionComponent = entity.getComponent('PositionComponent') as PositionComponent;
        const renderComponent = entity.getComponent('RenderComponent') as RenderComponent;
        const rotationComponent = entity.getComponent('RotationComponent') as RotationComponent;
  
        if (positionComponent && renderComponent && rotationComponent) {
          const { x, y } = positionComponent;
          const { sprite } = renderComponent;
          const { rotation } = rotationComponent;
  
          console.log(
            `Rendering entity ${entity.id} at position (${x}, ${y}) with sprite ${sprite} and rotation ${rotation}`
          );
        }
      }
    }
  }
  
  // Usage of the engine
  const entities: Entity[] = [];
  
  // Create entities
  const entity1 = new Entity(1);
  entity1.addComponent(new PositionComponent(10, 20));
  entity1.addComponent(new RenderComponent('sprite1.png'));
  entity1.addComponent(new RotationComponent(0));
  entities.push(entity1);
  
  const entity2 = new Entity(2);
  entity2.addComponent(new PositionComponent(30, 40));
  entity2.addComponent(new RenderComponent('sprite2.png'));
  entity2.addComponent(new RotationComponent(45));
  entities.push(entity2);
  
  // Create the render system
  const renderSystem = new RenderSystem(entities, 60);
  
  // Start the render system
  renderSystem.start();
  
  // Stop the render system after 5 seconds
  setTimeout(() => {
    renderSystem.stop();
  }, 5000);