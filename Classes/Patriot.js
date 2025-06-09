import * as THREE from 'three';
import Bullet from './Bullet.js';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export default class Patriot{
		constructor(scene, position, Spans, game) {
			this.scene=scene;
			this.position=position;
    		this.d=Math.PI/180;

			this.angleH=Math.PI/4;
			this.angleV=Math.PI/6;	

			this.speed = 50;
			this.count_rockets=4;
			this.max_speed=300;
			this.model=null;

			this.Spans = Spans;
			this.game = game;

			//Створення стрілки з напрямом (нормалі)
			this.dir = new THREE.Vector3( 
							Math.cos(this.angleH), 
							Math.sin(this.angleV), 
							Math.sin(this.angleH) );
			
			const origin = new THREE.Vector3( this.position.x-6.5, 6.5, this.position.z-6.5); 
			const length = 15;     //довжина
			const hex = 0xffff00;  //колір
			this.arrow = new THREE.ArrowHelper( this.dir, origin, length, hex );
			scene.add( this.arrow );

			this.showParam(this.Spans);

			this.loadModel(scene, this.position);
		}

		loadModel(scene, position){
			//Load Model
			//--------------------------------------------------
			let Path = 'Model/PAC3_Defence/';
			let ModelPath = Path + 'File Formats/OBJ/';
			let TexturePath = Path + 'Texture/';
			
			let MTLFile=ModelPath + 'PAC3.mtl';
			let OBJFile=ModelPath + 'PAC3.obj';
		
			let JPGFile1=TexturePath + 'pac_3_tractor_d.png';
			let JPGFile2=TexturePath + 'pac_3_launcher_d.png';
			
			//--------------------------------------------------
			const onProgress = function ( xhr ) {
				if ( xhr.lengthComputable ) {
					const percentComplete = xhr.loaded / xhr.total * 100;
					console.log( percentComplete.toFixed( 2 ) + '% downloaded' );
				}
			};
			
			new MTLLoader().load(
				MTLFile, 
				(materials) => {
					materials.preload();
					new OBJLoader().setMaterials(materials).load(
						OBJFile, 
						(object) => {
							const texture = [ 
												new THREE.TextureLoader().load(JPGFile1),
												new THREE.TextureLoader().load(JPGFile2)
							              	];

							object.children[0].material.map = texture[0];
							object.children[1].material.map = texture[1];
							object.children[2].material.map = texture[0];
							

							object.traverse(
								function (child) {
									const bbox = new THREE.Box3().setFromObject(child);
          							const vec = new THREE.Vector3();
          							bbox.getCenter(vec);

									if (child instanceof THREE.Mesh){

										child.position.set(vec.x, vec.y, vec.z);
							            if (child.geometry) {
							              child.geometry.translate(-vec.x, -vec.y, -vec.z);
							            }
									}

									object.children[2].geometry.translate(0, 0, 0);
								}
							);

							object.scale.set(1,1,1);
							object.position.copy(position);
							object.rotation.y=-Math.PI/4;
							scene.add(object);
							this.model=object;
						}, 
						onProgress
					);
				}
			);
			//--------------------------------------------------
		}

		changeAngle(pA){ 
			let k=this.d;
			switch(pA){
				case 'H-' : this.angleH-=k;
				            break;

				case 'H+' : this.angleH+=k; break;

				case 'V-' : this.angleV-=k; break;
				case 'V+' : this.angleV+=k; break;
			}

			let V = new THREE.Vector3( 
				Math.cos(this.angleH), 
				Math.sin(this.angleV), 
				Math.sin(this.angleH) );

			this.arrow.setDirection( V );
			
			if(this.model!==null){
				let M=this.model;

				M.children[2].rotation.y= Math.PI/4 -  this.angleH;
				M.children[2].rotation.z= -Math.PI/6 +  this.angleV;
			}	 

			this.showParam(this.Spans);	 
		}

		changeSpeed(val){
			this.speed+=val;

			if(this.speed>this.max_speed) this.speed=this.max_speed;					  	
			if(this.speed<10) this.speed=10;
		}

		shoot(){ 
			const position = this.arrow.position.clone();
			console.log(position);
			position.y=6.5;

			let rocket = new Bullet( this.scene,
									 this.game,
									 position, 
				                     this.speed, 
				                     this.angleH, 
				                     this.angleV );
			this.game.Rockets.push( rocket );
		}

		showParam(view){
			let pos=this.position;

			view[0].innerHTML = (this.angleV*180/Math.PI).toFixed(1);
			view[1].innerHTML = (this.angleH*180/Math.PI).toFixed(1);
			view[2].innerHTML = '0';
			view[3].innerHTML = '0';
			view[4].innerHTML = (pos.x).toFixed(1);
			view[5].innerHTML = (pos.y).toFixed(1);
			view[6].innerHTML = (pos.z).toFixed(1);

			//console.log('x=' + pos.x + ', y=' + pos.y + ', z=' + pos.z);
		}

		animate(){

		}
    }