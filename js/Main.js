import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import Game from '../Classes/Game.js';

//*********************************************************************
console.log("Hello?");

let showFlightSmoke = true;
let deltaT=0.1;

var Spans = info.getElementsByTagName('span');

var clock = new THREE.Clock();

function animate(){
	//controls.update( clock.getDelta() );
	requestAnimationFrame(animate);

	game.animate();
}

document.onkeydown = function(e){
	//alert(e.key);
	switch(e.key){
		case 'ArrowUp'    : game.CurLauncher.changeAngle('V+'); break;
		case 'ArrowDown'  : game.CurLauncher.changeAngle('V-'); break;		
		case 'ArrowLeft'  : game.CurLauncher.changeAngle('H-'); break;
		case 'ArrowRight' : game.CurLauncher.changeAngle('H+'); break;
		case ' '	      : game.CurLauncher.shoot();           break;
		case '='		  : game.CurLauncher.changeSpeed(5);    break;
		case '+'		  : game.CurLauncher.changeSpeed(5);	break;
		case '-'		  : game.CurLauncher.changeSpeed(-5);   break;

		case 'w'    	  : game.CurEnemyLauncher.changeAngle('V+'); break; 
		case 's'          : game.CurEnemyLauncher.changeAngle('V-'); break;
		case 'a'          : game.CurEnemyLauncher.changeAngle('H-'); break;
		case 'd'          : game.CurEnemyLauncher.changeAngle('H+'); break;
		case 'z'	      : game.CurEnemyLauncher.shoot();           break;
		case 'e'		  : game.CurEnemyLauncher.changeSpeed(5);	break;
		case 'q'		  : game.CurEnemyLauncher.changeSpeed(-5);   break;	
		
		case 'x'          : //Перемикання ворогів
		                    if(game.CurEnemyIndex < game.Enemies.length-1){
								game.CurEnemyIndex++;
							}
							else game.CurEnemyIndex=0;
							game.CurEnemyLauncher=game.Enemies[ game.CurEnemyIndex ];

	}

	speed_progress.style.width = game.CurLauncher.speed*200/game.CurLauncher.max_speed + 'px';
	speed_progress.innerHTML   = game.CurLauncher.speed;
}	


//=====================================
// program
var game = new Game(Spans);
//game.animate();
animate();