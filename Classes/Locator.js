import * as THREE from 'three';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export default class Locator{
    	constructor(game, position) {
			this.position=position;
    		this.d=Math.PI/180;
			this.angleH=Math.PI/4;
			this.angleV=Math.PI/4;		
			this.speed = 50;
			this.model=null;
			this.tRotate=0.05;
			this.game = game;
			//this.load_model=false;
			//var RR=this.model;
			this.loadModel(this.game.getScene(), this.position);
		}

		loadModel(scene, position){
			//Load Model
			//--------------------------------------------------
						//Load Model
			let ModelPath = 'Model/Radar/Radar PGZ-95 MCP/';
			let TexturePath = ModelPath + 'Textures/';
			
			let MTLFile=ModelPath + 'Radar.mtl';
			let OBJFile=ModelPath + 'Radar.obj';
		
			let JPGFile1=TexturePath + 'body.png';
			let JPGFile2=TexturePath + 'body_bp.png';
			let JPGFile3=TexturePath + 'body_sp.png';

			let JPGFile4=TexturePath + 'track.png';
			let JPGFile5=TexturePath + 'track_bp.png';
			let JPGFile6=TexturePath + 'track_sp.png';

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
							var texture = [ new THREE.TextureLoader().load(JPGFile1),
											new THREE.TextureLoader().load(JPGFile2),
											new THREE.TextureLoader().load(JPGFile3),
											new THREE.TextureLoader().load(JPGFile4), 
											new THREE.TextureLoader().load(JPGFile5),
											new THREE.TextureLoader().load(JPGFile6)
							              ];

							object.traverse(
								function (child) {
									//зміна центра обертання
									const bbox = new THREE.Box3().setFromObject(child);
          							const vec = new THREE.Vector3();
          							bbox.getCenter(vec);

									if (child instanceof THREE.Mesh){

										child.position.set(vec.x, vec.y, vec.z);
							            if (child.geometry) {
							              child.geometry.translate(-vec.x, -vec.y, -vec.z);
							            }
									}
								}
							);

							object.scale.set(1,1,1);
							object.position.copy(position);
							object.rotation.y=Math.PI/6;
							scene.add(object);

							this.model=object;
						}, 
						onProgress
					);
				}
			);

		}	

		changeAngle(pA){ 
			let k=this.d;
			switch(pA){
				case 'H-' : this.angleH-=k; break;
				case 'H+' : this.angleH+=k; break;
			}	 
		}

		animate(){
			if (this.model!==null){
				this.model.children[2].rotateY(this.tRotate);
			}
		}	
    }