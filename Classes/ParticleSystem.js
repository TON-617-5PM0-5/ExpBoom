import * as THREE from 'three';
export class Particle{
	constructor(position, size, color, lifetime, Changes){
		this.position = position;
		this.size = size;
		this.color = color;
		this.lifetime = lifetime;
		this.Changes = Changes;
		this.dead = false;
	}
	animate(){
		// checking if isnt it dead
		this.lifetime--;
		if (this.lifetime < 0 || this.color.r < 0.001){
			this.dead = true;
			return;
		}
		// apply Changes
		this.position.add(this.Changes.motion ? this.Changes.motion : new THREE.Vector3( ));
		this.size += this.Changes.morphing ? this.Changes.morphing : 0;
		this.color.addScalar(this.Changes.fade ? this.Changes.fade : 0);
	}
}

export default class ParticleSystem{
	constructor(game, textureUrl){
		const uniforms = {
			pointTexture: { value: new THREE.TextureLoader().load( textureUrl ) }
		};

		const shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
			vertexColors: true
		} );


		this.geometry = new THREE.BufferGeometry();
		this.particleA = 0; // Particle amount
		this.particles = [];

		this.particleSystem = new THREE.Points( this.geometry, shaderMaterial );

		game.getScene().add(this.particleSystem);
	}

	PutParticle(Particle){
		this.particles.push(Particle);
	}

	CreateParticle(position, color, size, lifetime, Changes){
		const p = new Particle(position, size, color, lifetime, Changes);
		this.particles.push(p);
		return p;
	}

	GetParticles(){
		return this.particles;
	}

	CreateParticleCloud(position, color, size, lifetime, amount, spread, Changes){
		for ( let i = 0; i < amount; i ++ ) {
			// creating random position in sphere
			let u = Math.random();
		    let v = Math.random();
		    let theta = u * 2.0 * Math.PI;
		    let phi = Math.acos(2.0 * v - 1.0);
		    let r = Math.cbrt(Math.random()) * spread;

		    let sinPhi = Math.sin(phi);
		    let x = r * sinPhi * Math.cos(theta);
		    let y = r * sinPhi * Math.sin(theta);
		    let z = r * Math.cos(phi);

		    //creating the particle
			const _position = new THREE.Vector3((x) + position.x,(y) + position.y,(z) + position.z);
			this.CreateParticle(_position, color.clone(), size, lifetime, Changes);

		}
	}
	animate(){
		// there are no way to clear geometry's attributes properly, So we have to delete the geometry and create new one.

		this.geometry.dispose();
		this.geometry = new THREE.BufferGeometry();
		this.particleSystem.geometry = this.geometry;

		const positions = [];		
		const colors = [];
		const sizes = [];

		this.particles = this.particles.filter( Boolean);

		for(let i = 0; i < this.particles.length; i++){
			if (this.particles[i]) this.particles[i].animate();
			if (this.particles[i] && this.particles[i].dead) this.particles[i] = null;
			if (!this.particles[i]) continue;

			positions.push(this.particles[i].position.x);
			positions.push(this.particles[i].position.y);
			positions.push(this.particles[i].position.z);

			colors.push(this.particles[i].color.r);
			colors.push(this.particles[i].color.g);
			colors.push(this.particles[i].color.b);

			sizes.push(this.particles[i].size);
		}

		this.particleA = this.particles.length;

		this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ));
		this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
		this.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ));
	}
}