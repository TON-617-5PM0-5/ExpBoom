import * as THREE from 'three';
const StepG = new THREE.SphereGeometry(0.8, 5, 5);

export default class Bullet{
    	constructor(scene, game, position, speed, aH, aV){
 			this.startPosition = Object.assign({}, position);
			this.position      = Object.assign({}, position);   	
			this.speed=speed;
			this.angleH = aH;
			this.angleV = aV;
			this.t=0;

			this.Vx = speed * Math.cos(aH)*Math.cos(aV);
			this.Vy = speed * Math.sin(aV);
			this.Vz = speed * Math.sin(aH)*Math.cos(aV);
			this.Hmax = 0;

			this.game = game;

    		//Створення сфери (частини сфери)
			//const G = new THREE.SphereGeometry(0.5, 5, 5);
			const G = new THREE.CylinderGeometry( 0.4, 0.3, 5, 36 );
			const M = new THREE.MeshBasicMaterial({color:'grey'});
			this.mesh = new THREE.Mesh(G, M);
			this.mesh.position.copy(position);

			this.mesh.rotation.set(-Math.PI/2, -aV, aH);

			/*let V = new THREE.Vector3( 
				2*Math.cos(this.aH), 
				2*Math.sin(this.aV), 
				2*Math.sin(this.aH) );*/

			scene.add(this.mesh);

			
			//this.mesh.lookAt( V );
    	}

		move(deltaT){
			const pos = this.startPosition; 	

			this.t+=deltaT;	
			this.position.x = pos.x + this.Vx * this.t;
			this.position.z = pos.z + this.Vz * this.t;
			this.position.y = pos.y + this.Vy * this.t - this.game.world.g*this.t**2/2;
			//console.log(this.position.y);

			if (this.Hmax<this.position.y) this.Hmax=this.position.y;
				
			/*this.position.x+=this.Vx;
			this.position.z+=this.Vz;

			this.Vy-=g/10; 
			this.position.y+=this.Vy;*/
			
			//console.log('x=' + x + ', y=' + y + ', z=' + z);

	        this.mesh.position.copy(this.position);

			/*
			azimuth += rotationSpeed * mouseXNormalized;
    		inclination -= rotationSpeed * mouseYNormalized;
			const forward = new THREE.Vector3(
		        Math.sin(azimuth) * Math.cos(inclination),
		        Math.sin(inclination),
		        Math.cos(azimuth) * Math.cos(inclination)
		    );

		    const right = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
		    const up = new THREE.Vector3().crossVectors(forward, right).normalize();

		    spaceship.matrix.identity();
		    spaceship.matrix.makeBasis(right, up, forward);
		    spaceship.rotation.setFromRotationMatrix(spaceship.matrix);*/


			//Створення сліду
			let ps=this.position;
			let st=this.speed/100;
			for(let j=this.t-deltaT; j<this.t; j+=deltaT/20){
				
				let StepM = new THREE.MeshLambertMaterial({color:'white', opacity:0.6, transparent:true});
				const point = new THREE.Mesh(StepG, StepM);
				
				let pp = point.position;
				pp.x = pos.x + this.Vx * j;
				pp.z = pos.z + this.Vz * j;
				pp.y = pos.y + this.Vy * j - this.game.world.g*j**2/2;

				pp.x+=-st+2*st*Math.random();
				pp.y+=-st+2*st*Math.random();
				pp.z+=-st+2*st*Math.random();
				//point.position.copy(pp);
				this.game.SmokeParticles.push(point);
				this.game.world.scene.add(point);
			}
		}

		showParam(view){			
			let pos = this.position;
			let Lmax= Math.sqrt( (pos.x-this.startPosition.x)**2 + (pos.z-this.startPosition.z)**2 );	

			view[0].innerHTML = (this.angleV*180/Math.PI).toFixed(1);
			view[1].innerHTML = (this.angleH*180/Math.PI).toFixed(1);
			view[2].innerHTML = (this.Hmax).toFixed(1);
			view[3].innerHTML = Lmax.toFixed(1);
			view[4].innerHTML = (this.t).toFixed(1);

			view[5].innerHTML = (pos.x).toFixed(1);
			view[6].innerHTML = (pos.y).toFixed(1);
			view[7].innerHTML = (pos.z).toFixed(1);

			//console.log('x=' + pos.x + ', y=' + pos.y + ', z=' + pos.z);
		}   	
    }