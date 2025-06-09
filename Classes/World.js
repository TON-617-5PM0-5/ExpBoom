import * as THREE from 'three';

import Terrain from './Terrain.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class World{
    	constructor(){
    		this.WIDTH = window.innerWidth;
            this.HEIGHT = window.innerHeight;
            this.g=9.8;

			this.renderer = new THREE.WebGLRenderer({ antialias: true });	
			this.renderer.setSize(this.WIDTH-300, this.HEIGHT);
			this.renderer.setClearColor(0x9999ee, 1); //Заливка кольором фону	
			document.body.appendChild(this.renderer.domElement);

			//Створення сцени
			this.scene = new THREE.Scene();

			//Створення камери
			this.camera = new THREE.PerspectiveCamera(100, this.WIDTH/this.HEIGHT, 1, 100000 );
			this.scene.add(this.camera);
			this.camera.position.set(-15, 5,-10);
			this.camera.lookAt(100,5,100);


			//Створення координатних осей
			const axes = new THREE.AxesHelper(250);
		 	this.scene.add(axes);

		 	//Створення рел'єфу
			const planeGeometry = new THREE.PlaneGeometry(10000, 10000, 12, 12);
			const planeTexture = new THREE.TextureLoader().load('images/3.jpg');	
			const planeMaterial = new THREE.MeshBasicMaterial({map:planeTexture});
			//color: 0x99bb99

			planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
			planeTexture.repeat.set( 100, 100 );

			const plane = new THREE.Mesh(planeGeometry, planeMaterial);
			this.scene.add(plane);
			plane.rotation.x=-Math.PI/2;
			plane.position.y=-0.1;

			const terrain = new Terrain(this.scene, new THREE.Vector3(0,-1000,0), 4700);

			const light = new THREE.HemisphereLight( 0xfff7f7, 0x494966, 13 );
			this.scene.add( light );
			light.castShadow = true;

			//Створення природнього білого світла
			const ambientLight = new THREE.AmbientLight( 0x404040 );
			this.scene.add( ambientLight );					

			//Створення ортогональної сітки
			const size = 2000;
			const divisions = 50;
			const gridHelper = new THREE.GridHelper( size, divisions );
			this.scene.add( gridHelper );


			//Управління камерою з допомогою миші
			this.controls = new OrbitControls(this.camera, this.renderer.domElement);	

			//const clock = new THREE.Clock();

			/*controls = new FirstPersonControls( camera, renderer.domElement );
			controls.movementSpeed = 20;
			controls.lookSpeed = 0.05;
			controls.lookVertical = false;*/
			
			//Автоматичне перемальовування при зміні розмірів вікна
			window.addEventListener( 'resize', 
									 () => {
							    		if(this.camera!=null){
							    		 
							    			this.camera.aspect = window.innerWidth / window.innerHeight;
											this.camera.updateProjectionMatrix();
											this.renderer.setSize(window.innerWidth-288, window.innerHeight);
							    		}
								    }, 
										    	
									false);
    	}


    	animate(){

    	}
    }