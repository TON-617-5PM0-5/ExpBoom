import * as THREE from 'three';

import World from './World.js';
import Locator from './Locator.js';
import Patriot from './Patriot.js';
import Sky from './Sky.js';


const deltaT=0.1;

export default class Game{
    	constructor(_Spans){
			this.Objects=[]; //
			this.Enemies=[];

			this.Rockets=[];
			this.SmokeParticles=[];

			this.world = new World();
			this.Spans = _Spans;

			const sky = new Sky(this.world.scene);
			this.Objects.push(sky);

			const patriot = new Patriot(this.world.scene, new THREE.Vector3(6.5,0,6.5), _Spans, this);
			this.Objects.push(patriot);
			this.CurLauncher = patriot;

			const locator = new Locator(this.world.scene, new THREE.Vector3(10,0,-15) );
			this.Objects.push(locator);

			//this.Objects.push(terrain);
			//terrain.model.position.y -= 100;



			//********************************************************************
			for(let i=0; i<10; i++){
				let angle = 2*Math.PI*Math.random();
				let R = 200 + 200*Math.random();

				let x=  R*Math.cos(angle);
				let z=  R*Math.sin(angle);

				let enemy = new Patriot(this.world.scene, new THREE.Vector3(x,0,z),_Spans, this);
				this.Enemies.push(enemy);
			}
			this.CurEnemyLauncher = this.Enemies[0];
			this.CurEnemyIndex = 0;

    	}

    	animate(){
    		//requestAnimationFrame(this.animate);

    		for(let i=0; i<this.Rockets.length; i++){
        		this.Rockets[i].move(deltaT);

				if (i==this.Rockets.length-1){
					this.Rockets[i].showParam(this.Spans);
				}

	        	// Вилучення після падіння
	            if (this.Rockets[i].position.y <= 0) {

	 				this.world.scene.remove(this.Rockets[i].mesh);
	                this.Rockets.splice(i, 1);
	            }
	        }


			for(let j=0; j<this.SmokeParticles.length; j++){
				let SP=this.SmokeParticles[j];
	        	SP.material.opacity-=0.05;
	        	SP.position.y+=0.005;
	        	SP.position.z+=0.001;

	        	if( SP.material.opacity<0.01 ) {
	        		this.world.scene.remove(SP);
	        		this.SmokeParticles.splice(j,1);
	        	}	 		
	        }

	        for( let i=0; i<this.Objects.length; i++){
	        	this.Objects[i].animate();
	        }
    		

	        let T = 500*Math.random();
	        if(T<10){
	        	let index = Math.round((this.Enemies.length-1)*Math.random());
	        	this.CurEnemyLauncher = this.Enemies[index];


	        	this.CurEnemyLauncher.speed = 50 + 200*Math.random();
	        	this.CurEnemyLauncher.angleH= 2*Math.PI*Math.random();
	        	this.CurEnemyLauncher.angleV= Math.PI/6 + Math.PI/6*Math.random();

	        	this.CurEnemyLauncher.shoot();

	        }


    		this.world.renderer.render(this.world.scene, this.world.camera);
    	}
    }