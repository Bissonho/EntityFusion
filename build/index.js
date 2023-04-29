"use strict";
console.log('Hello world!');
// Definição das entidades
var Entity = /** @class */ (function () {
    function Entity(id) {
        this.id = id;
        this.components = [];
    }
    Entity.prototype.addComponent = function (component) {
        this.components.push(component);
    };
    Entity.prototype.removeComponent = function (componentType) {
        this.components = this.components.filter(function (component) { return component.constructor.name !== componentType; });
    };
    Entity.prototype.getComponent = function (componentType) {
        return this.components.find(function (component) { return component.constructor.name === componentType; });
    };
    return Entity;
}());
// Definição dos componentes
var PositionComponent = /** @class */ (function () {
    function PositionComponent(x, y) {
        this.x = x;
        this.y = y;
    }
    return PositionComponent;
}());
var RenderComponent = /** @class */ (function () {
    function RenderComponent(sprite) {
        this.sprite = sprite;
    }
    return RenderComponent;
}());
// Definição dos sistemas
var RenderSystem = /** @class */ (function () {
    function RenderSystem(entities) {
        this.entities = entities;
    }
    RenderSystem.prototype.update = function () {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            var positionComponent = entity.getComponent('PositionComponent');
            var renderComponent = entity.getComponent('RenderComponent');
            if (positionComponent && renderComponent) {
                console.log("Renderizando entidade ".concat(entity.id, " na posi\u00E7\u00E3o (").concat(positionComponent.x, ", ").concat(positionComponent.y, ") com sprite ").concat(renderComponent.sprite));
            }
        }
    };
    return RenderSystem;
}());
// Uso da engine
var entities = [];
// Criar entidades
var entity1 = new Entity(1);
entity1.addComponent(new PositionComponent(10, 20));
entity1.addComponent(new RenderComponent('sprite1.png'));
entities.push(entity1);
var entity2 = new Entity(2);
entity2.addComponent(new PositionComponent(30, 40));
entity2.addComponent(new RenderComponent('sprite2.png'));
entities.push(entity2);
// Criar sistema
var renderSystem = new RenderSystem(entities);
// Atualizar o sistema
renderSystem.update();
