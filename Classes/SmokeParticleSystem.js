// Outdated
// Не используйте эту библиотеку

import * as THREE from 'three';
const uniforms = {
	pointTexture: { value: new THREE.TextureLoader().load( '../ExpBoom/images/Smoke.webp' ) }

};

const shaderMaterial = new THREE.ShaderMaterial( {

					uniforms: uniforms,
					vertexShader: document.getElementById( 'vertexshader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

					blending: THREE.AdditiveBlending,
					depthTest: false,
					transparent: true,
					vertexColors: true,

} );

class ParticleOfSmoke{
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
		if (this.lifetime < 0){
			this.dead = true;
			console.log(this.dead);
			return;
		}
		this.position.add(this.Changes.motion ? this.Changes.motion : new THREE.Vector3( ));
		this.size += this.Changes.morphing ? this.Changes.morphing : 0;
		this.color.addScalar(this.Changes.fade ? this.Changes.fade : 0);
	}
}

export default class SmokeParticleSystem{
	constructor(Game){
		//const particles = new THREE.Points(particlesGeometry, shaderMaterial);
		//Game.world.scene.add(particles);
		//particles.position.copy(position);

		this.geometry = new THREE.BufferGeometry();

		this.particles = [];

		this.positions = [];
		this.colors = [];
		this.sizes = [];

		this.particleSystem = new THREE.Points( this.geometry, shaderMaterial );

		Game.world.scene.add(this.particleSystem);

		this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( this.positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
		this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( this.colors, 3 ) );
		this.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( this.sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );
	}
	CreateSmoke(position, color, size, lifetime, amount, spread, Changes){
		for ( let i = 0; i < amount; i ++ ) {

			//this.positions.push( ((Math.random() * 2 - 1 ) * spread) + position.x );
			//this.positions.push( ((Math.random() * 2 - 1 ) * spread) + position.y );
			//this.positions.push( ((Math.random() * 2 - 1 ) * spread) + position.z );

			//this.colors.push( color.r, color.g, color.b );

			//this.sizes.push( size );

			const _position = new THREE.Vector3(((Math.random() * 2 - 1 ) * spread) + position.x,((Math.random() * 2 - 1 ) * spread) + position.y,((Math.random() * 2 - 1 ) * spread) + position.z);
			this.particles.push(new ParticleOfSmoke(_position, size, color, lifetime, Changes));

		}
	}
	animate(){
		this.geometry.dispose()
		this.geometry = new THREE.BufferGeometry();
		this.particleSystem.geometry = this.geometry;

		this.positions.splice(0, this.positions.length);
		this.colors.splice(0, this.colors.length);
		this.sizes.splice(0, this.sizes.length);

		this.particles = this.particles.filter( Boolean);

		for(let i = 0; i < this.particles.length; i++){
			if (this.particles[i]) this.particles[i].animate();
			if (this.particles[i] && this.particles[i].dead) this.particles[i] = undefined;
			if (!this.particles[i]) continue;

			this.positions.push(this.particles[i].position.x);
			this.positions.push(this.particles[i].position.y);
			this.positions.push(this.particles[i].position.z);

			this.colors.push(this.particles[i].color.r);
			this.colors.push(this.particles[i].color.g);
			this.colors.push(this.particles[i].color.b);

			this.sizes.push(this.particles[i].size);
		}

		console.log(this.particles);

		this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( this.positions, 3 ));
		this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( this.colors, 3 ) );
		this.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( this.sizes, 1 ));
	}
}