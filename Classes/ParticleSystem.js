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
		this.lifetime--;
		//console.log(this);
		if (this.lifetime < 0 || this.color.r < 0.001){
			//console.log("died")
			this.dead = true;
			return;
		}
		this.position.add(this.Changes.motion ? this.Changes.motion : new THREE.Vector3( ));
		this.size += this.Changes.morphing ? this.Changes.morphing : 0;
		this.color.addScalar(this.Changes.fade ? this.Changes.fade : 0);
	}
}

export default class ParticleSystem{
	//particleA = 0;
	constructor(game, textureUrl){
		//const particles = new THREE.Points(particlesGeometry, shaderMaterial);
		//Game.world.scene.add(particles);
		//particles.position.copy(position);
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
		this.particleA = 0;
		this.particles = [];

		this.particleSystem = new THREE.Points( this.geometry, shaderMaterial );

		game.getScene().add(this.particleSystem);

		//this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
		//this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( this.colors, 3 ) );
		//this.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( this.sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );
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
			let u = Math.random();
		    let v = Math.random();
		    let theta = u * 2.0 * Math.PI;
		    let phi = Math.acos(2.0 * v - 1.0);
		    let r = Math.cbrt(Math.random()) * spread;  // cube root for uniform distribution

		    let sinPhi = Math.sin(phi);
		    let x = r * sinPhi * Math.cos(theta);
		    let y = r * sinPhi * Math.sin(theta);
		    let z = r * Math.cos(phi);

			const _position = new THREE.Vector3((x) + position.x,(y) + position.y,(z) + position.z);
			this.CreateParticle(_position, color.clone(), size, lifetime, Changes);

		}
	}
	animate(){
		this.geometry.dispose()
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

			//console.log(positions.length);

			positions.push(this.particles[i].position.x);
			positions.push(this.particles[i].position.y);
			positions.push(this.particles[i].position.z);

			colors.push(this.particles[i].color.r);
			colors.push(this.particles[i].color.g);
			colors.push(this.particles[i].color.b);

			sizes.push(this.particles[i].size);
		}

		this.particleA = sizes.length;
		//console.log(this.particleA);

		this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ));
		this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
		this.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ));
	}
}