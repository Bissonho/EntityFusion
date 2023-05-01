"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
// Define a classe Entity
var Entity = /** @class */ (function () {
    function Entity(id) {
        this.id = id;
        this.components = [];
        this.object3D = new THREE.Object3D();
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
// Define os componentes
var PositionComponent = /** @class */ (function () {
    function PositionComponent(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return PositionComponent;
}());
var RenderComponent = /** @class */ (function () {
    function RenderComponent(geometry, material) {
        this.geometry = geometry;
        this.material = material;
    }
    return RenderComponent;
}());
var RotationComponent = /** @class */ (function () {
    function RotationComponent(rotation) {
        this.rotation = rotation;
    }
    return RotationComponent;
}());
var RenderSystem = /** @class */ (function () {
    function RenderSystem(entities, container) {
        var _this = this;
        this.entities = entities;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
        this.entities.forEach(function (entity) {
            var renderComponent = entity.getComponent('RenderComponent');
            var positionComponent = entity.getComponent('PositionComponent');
            var rotationComponent = entity.getComponent('RotationComponent');
            if (renderComponent && positionComponent && rotationComponent) {
                var geometry = renderComponent.geometry, material = renderComponent.material;
                var x = positionComponent.x, y = positionComponent.y, z = positionComponent.z;
                var rotation = rotationComponent.rotation;
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, y, z);
                mesh.rotation.copy(rotation);
                entity.object3D = mesh;
                _this.scene.add(mesh);
            }
        });
    }
    RenderSystem.prototype.update = function (deltaTime) {
        this.entities.forEach(function (entity) {
            var positionComponent = entity.getComponent('PositionComponent');
            var rotationComponent = entity.getComponent('RotationComponent');
            if (positionComponent && rotationComponent) {
                var x = positionComponent.x, y = positionComponent.y, z = positionComponent.z;
                var rotation = rotationComponent.rotation;
                entity.object3D.position.set(x, y, z);
                entity.object3D.rotation.copy(rotation);
            }
        });
        this.renderer.render(this.scene, this.camera);
    };
    return RenderSystem;
}());
// Loop do jogo com requestAnimationFrame
var Game = /** @class */ (function () {
    function Game(frameRate, container) {
        this.frameRate = frameRate;
        this.deltaTime = 1000 / frameRate;
        this.lastFrameTime = 0;
        this.running = false;
        this.renderSystem = new RenderSystem(entities, container);
    }
    Game.prototype.start = function () {
        this.running = true;
        this.lastFrameTime = performance.now();
        this.loop();
    };
    Game.prototype.stop = function () {
        this.running = false;
    };
    Game.prototype.loop = function () {
        var _this = this;
        if (!this.running)
            return;
        var currentTime = performance.now();
        var elapsed = currentTime - this.lastFrameTime;
        if (elapsed >= this.deltaTime) {
            this.renderSystem.update(elapsed);
            this.lastFrameTime = currentTime;
        }
        requestAnimationFrame(function () { return _this.loop(); });
    };
    return Game;
}());
// Uso da engine
var entities = [];
// Criar entidades
var entity1 = new Entity(1);
entity1.addComponent(new PositionComponent(0, 0, 0));
entity1.addComponent(new RenderComponent(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 })));
entity1.addComponent(new RotationComponent(new THREE.Euler(0, 0, 0)));
entities.push(entity1);
var entity2 = new Entity(2);
entity2.addComponent(new PositionComponent(2, 0, 0));
entity2.addComponent(new RenderComponent(new THREE.BoxGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00ff00 })));
entity2.addComponent(new RotationComponent(new THREE.Euler(0, Math.PI / 2, 0)));
entities.push(entity2);
// Criação do container para renderização
var container = document.createElement('div');
document.body.appendChild(container);
// Inicialização do jogo
var game = new Game(60, container);
game.start();
