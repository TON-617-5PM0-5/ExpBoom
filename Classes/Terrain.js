import * as THREE from 'three';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const planeTexture = new THREE.TextureLoader().load('images/mountain.jpg');	
const planeMaterial = new THREE.MeshBasicMaterial({map:planeTexture});
//color: 0x99bb99

planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
planeTexture.repeat.set( 10, 10 );

export default class Terrain{
    	constructor(scene, position, Scale) {
			this.position=position;

			this.model=null;

			this.scale = Scale;

			this.loadModel(scene, this.position);
		}

		loadModel(scene, position){
			//Load Model
			//--------------------------------------------------
						//Load Model
			let ModelPath = 'Model/Terrain/';
			
			let MTLFile=ModelPath + 'Terrain.mtl';
			let OBJFile=ModelPath + 'Terrain.obj';


			new MTLLoader().load(
				MTLFile, 
				(materials) => {
					materials.preload();
					new OBJLoader().setMaterials(materials).load(
						OBJFile, 
						(object) => {
							object.traverse(
								(child) => {
									if (child.isMesh){
										console.log(this);
							            child.material = planeMaterial;
							        }
								}
							);

							object.scale.set(this.scale,this.scale,this.scale);
							object.position.copy(position);
							//ject.rotation.y=0;
							scene.add(object);

							this.model=object;
						}, 
					);
				}
			);

		}	
		animate(){

		}	
    }