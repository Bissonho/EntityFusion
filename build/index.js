"use strict";
// Define the Entity class
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
// Define the components
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
var RotationComponent = /** @class */ (function () {
    function RotationComponent(rotation) {
        this.rotation = rotation;
    }
    return RotationComponent;
}());
// Define the systems
var RenderSystem = /** @class */ (function () {
    function RenderSystem(entities, frameRate) {
        this.entities = entities;
        this.frameRate = frameRate;
        this.intervalId = 0;
    }
    RenderSystem.prototype.start = function () {
        var _this = this;
        var intervalTime = 1000 / this.frameRate;
        this.intervalId = setInterval(function () { return _this.update(); }, intervalTime);
    };
    RenderSystem.prototype.stop = function () {
        clearInterval(this.intervalId);
    };
    RenderSystem.prototype.update = function () {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            var positionComponent = entity.getComponent('PositionComponent');
            var renderComponent = entity.getComponent('RenderComponent');
            var rotationComponent = entity.getComponent('RotationComponent');
            if (positionComponent && renderComponent && rotationComponent) {
                var x = positionComponent.x, y = positionComponent.y;
                var sprite = renderComponent.sprite;
                var rotation = rotationComponent.rotation;
                console.log("Rendering entity ".concat(entity.id, " at position (").concat(x, ", ").concat(y, ") with sprite ").concat(sprite, " and rotation ").concat(rotation));
            }
        }
    };
    return RenderSystem;
}());
// Usage of the engine
var entities = [];
// Create entities
var entity1 = new Entity(1);
entity1.addComponent(new PositionComponent(10, 20));
entity1.addComponent(new RenderComponent('sprite1.png'));
entity1.addComponent(new RotationComponent(0));
entities.push(entity1);
var entity2 = new Entity(2);
entity2.addComponent(new PositionComponent(30, 40));
entity2.addComponent(new RenderComponent('sprite2.png'));
entity2.addComponent(new RotationComponent(45));
entities.push(entity2);
// Create the render system
var renderSystem = new RenderSystem(entities, 60);
// Start the render system
renderSystem.start();
// Stop the render system after 5 seconds
setTimeout(function () {
    renderSystem.stop();
}, 5000);
