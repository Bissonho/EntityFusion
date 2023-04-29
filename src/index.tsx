console.log('Hello world!');

interface Component {
    // Defina os campos necessários para cada componente
  }


// Definição das entidades
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
  
  // Definição dos componentes
  class PositionComponent {
    x: number;
    y: number;
  
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }
  
  class RenderComponent {
    sprite: string;
  
    constructor(sprite: string) {
      this.sprite = sprite;
    }
  }
  
  // Definição dos sistemas
  class RenderSystem {
    entities: Entity[];
  
    constructor(entities: Entity[]) {
      this.entities = entities;
    }
  
    update() {
      for (const entity of this.entities) {
        const positionComponent = entity.getComponent('PositionComponent') as PositionComponent;
        const renderComponent = entity.getComponent('RenderComponent') as RenderComponent;
  
        if (positionComponent && renderComponent) {
          console.log(
            `Renderizando entidade ${entity.id} na posição (${positionComponent.x}, ${positionComponent.y}) com sprite ${renderComponent.sprite}`
          );
        }
      }
    }
  }
  
  // Uso da engine
  const entities: Entity[] = [];
  
  // Criar entidades
  const entity1 = new Entity(1);
  entity1.addComponent(new PositionComponent(10, 20));
  entity1.addComponent(new RenderComponent('sprite1.png'));
  entities.push(entity1);
  
  const entity2 = new Entity(2);
  entity2.addComponent(new PositionComponent(30, 40));
  entity2.addComponent(new RenderComponent('sprite2.png'));
  entities.push(entity2);
  
  // Criar sistema
  const renderSystem = new RenderSystem(entities);
  
  // Atualizar o sistema
  renderSystem.update();