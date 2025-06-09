import * as THREE from 'three';

export default class Sky{
    	constructor(scene){
    		//Створення небесного куполу
			this.image = '../ExpBoom/images/sky2.jpg';
			this.radius = 5000;

			const skyGeometry = new THREE.SphereGeometry(this.radius, 32, 32);
			const skyMaterial = new THREE.MeshBasicMaterial({side:THREE.BackSide});
			const skyTexture = new THREE.TextureLoader().load(this.image);
			skyMaterial.map = skyTexture;
			this.mesh = new THREE.Mesh(skyGeometry, skyMaterial);
			scene.add(this.mesh);
    	}

    	animate(){
   			this.mesh.rotation.z+=0.0001;
			this.mesh.rotation.y+=0.0002;
   		}
    }