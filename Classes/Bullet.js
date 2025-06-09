import * as THREE from 'three';
const StepG = new THREE.SphereGeometry(0.8, 5, 5);

export default class Bullet{
    	constructor(game, position, speed, aH, aV){
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

			const G = new THREE.CylinderGeometry( 0.4, 0.3, 5, 36 );
			const M = new THREE.MeshBasicMaterial({color:'grey'});
			this.mesh = new THREE.Mesh(G, M);
			this.mesh.position.copy(position);

			this.mesh.rotation.set(-Math.PI/2, -aV, aH);

			game.getScene().add(this.mesh);
    	}

		move(deltaT){
			const pos = this.startPosition; 	

			this.t+=deltaT;	
			this.position.x = pos.x + this.Vx * this.t;
			this.position.z = pos.z + this.Vz * this.t;
			this.position.y = pos.y + this.Vy * this.t - this.game.world.g*this.t**2/2;

			if (this.Hmax<this.position.y) this.Hmax=this.position.y;

	        this.mesh.position.copy(this.position);

	        this.game.getSPS().CreateParticleCloud(this.position, new THREE.Color().setRGB( 0.5, 0.5, 0.5 ), 2, 500, 40, 5, {motion: new THREE.Vector3(0,0.005,0), morphing: 0.01, fade: -0.0005});

			//Створення сліду : Old one
			/*let ps=this.position;
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
				this.game.world.scene.add(point);*/
			//}
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

			view[8].innerHTML = this.game.getSPS().particleA;

			//console.log('x=' + pos.x + ', y=' + pos.y + ', z=' + pos.z);
		}   	
    }