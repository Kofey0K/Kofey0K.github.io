document.addEventListener('DOMContentLoaded', () => {
	let animType = 0;
	document.getElementById("play1").addEventListener("click", () => {
		openWork();
		document.getElementById("anim2").style.display = "none";
		document.getElementById("anim1").style.display = "block";
		animType = 1;
	});
	let width_c, height_c, square_c, square_c1;
	document.getElementById("play2").addEventListener("click", () => {
		openWork();
		document.getElementById("anim1").style.display = "none";
		document.getElementById("anim2").style.display = "block";
		animType = 2;
		width_c = $canvas.width = document.getElementById('anim2').offsetWidth;
		height_c = $canvas.height = document.getElementById('anim2').offsetHeight;
		square_c = new Square(15, width_c - 15, Math.floor(Math.random()*height_c), width_c, height_c, ctx);
		square_c.draw();
        square_c1 = new Square(15, Math.floor(width_c * Math.random()), height_c-15, width_c, height_c, ctx);
		square_c1.draw1()
	});
	document.getElementById("closeWork").addEventListener("click", () => {
		closeWork();
		let logs = JSON.parse(localStorage.getItem('messageLog'));
		const $logEl = document.getElementById('block6');
		$logEl.innerHTML = '';
		logs.map((log) => {
			$logEl.insertAdjacentHTML('beforeend', `
				<li>${log.timeStamp.split('(')[0]} -- ${log.message}</li>
			`)
		})
	})

	const $canvas = document.getElementById("anim2");
	const ctx = $canvas.getContext('2d');
	const texture = new Image();
	texture.src = "./img.png";


	let $square = {
		elem: document.getElementById('square'),
		x: 0,
		y: 0,
		velX: random(-1, 3), 
		velY: random(-1, 3) 
	};
    let $square1 = {
		elem: document.getElementById('square1'),
		x: 0,
		y: 0,
		velX: random(-1, 3), 
		velY: random(-1, 3) 
	};
	let controlState = 0; // 0 - stoped, 1 - playing, 2 - ready for reload
	let squareInt;
	let squareInt1;
    
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	document.getElementById('mainControl').addEventListener("click", (event) => {
		if(controlState === 0){
			controlState = 1;
			event.target.innerHTML = "&#x25A0;";
			if(animType === 1) playJsAnim();
			else if(animType === 2) {
                playCanvasAnim(square_c, square_c1, width_c, height_c);
            }
		} else if(controlState === 1) {
			controlState = 0;
			event.target.innerHTML = "&#9658;";
			if(animType === 1) stopJsAnim();
			else if(animType === 2) stopCanvasAnim();
		} else if(controlState === 2) {
			controlState = 0;
			event.target.innerHTML = "&#9658;";
			if(animType === 1) reloadJsAnim();
			else if(animType === 2) reloadCanvasAnim(square_c, width_c, height_c);
		}
        
        
	})

	// functions for element based animation
	const playJsAnim = () => {
		document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Launched animation'}}))
		const width = document.getElementById('anim1').offsetWidth;
		const height = document.getElementById('anim1').offsetHeight;
		squareInt = setInterval(() => {
			moveSquare($square, height, $square1);
		}, 15)
        squareInt1 = setInterval(() => {
			moveSquare1($square1, width);
		}, 15)
	}

	const stopJsAnim = () => {
		document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Stopped animation'}}))
		clearInterval(squareInt);
		clearInterval(squareInt1);
	}

	const reloadJsAnim = () => {
		document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Reloaded animation'}}))
		$square = {...$square, x: 0, y: 0, velX: random(-1,2), velY: random(-1,2)};
		$square.elem.style.top = '0px';
		$square.elem.style.right = '0px';
        
        document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Reloaded animation'}}))
		$square1 = {...$square1, x: 0, y: 0, velX: random(-1,2), velY: random(-1,2)};
		$square1.elem.style.top = '0px';
		$square1.elem.style.right = '0px';
	}

	// functions for canvas animation
	let frame;
    
	const playCanvasAnim = (square, square1, width, height) => {
		document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Launched animation'}}))
		const pattern = ctx.createPattern(texture, 'repeat');
		frame = () => {
			ctx.fillStyle = pattern;
			ctx.fillRect(0, 0, width, height);
			square.draw();
			square1.draw1();
			square.updatePosition();
			square1.updatePosition1();
			requestAnimationFrame(frame);
		}
		frame();
	}

	const stopCanvasAnim = () => {
		document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Stopped animation'}}))
		frame = _=>{};
	}

	const reloadCanvasAnim = (square, width, height) => {
		document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Reloaded animation'}}))
		square_c = new Square(15, width_c - 15, 0, width_c, height_c, ctx);
		square_c.draw()	
	}

	document.addEventListener('leftArea', () => {
		clearInterval(squareInt);
		clearInterval(squareInt1);
		frame = _=>{};
		controlState = 2;
		document.getElementById('mainControl').innerHTML = "&#8634;";
	})

	localStorage.setItem('messageLog', JSON.stringify(new Array()));
	document.addEventListener("animMessage", (event) => {
		document.getElementById("messages").innerHTML = event.detail.message;
		let messages = JSON.parse(localStorage.getItem('messageLog'));
		console.log(messages);
		messages.push({timeStamp: (new Date()).toString(), message: event.detail.message});
		localStorage.setItem('messageLog', JSON.stringify(messages));
	})
})

const openWork = () => {
	document.getElementById('work').style.display = "flex";
	document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Opened animation'}}))
}

const closeWork = () => {
	document.getElementById('work').style.display = "none";
	document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Closed animation'}}))
}

const random = (min, max) => {
	let num = Math.floor(Math.random()*(max-min+1))+min;
	return num === 0 ? 0.5 : num
}

let leftArea = new Event('leftArea');

const moveSquare = (square, height, square1) => {
	
	if(square.y + square.elem.offsetHeight + 5 >= height){
		square.velY = -(square.velY)
		document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Touched bottom border'}}))
        }


	if(square.y < 0) {
		square.velY = -(square.velY)
		document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Touched top border'}}))
        if(square1.x+15<=square.x && square.y<=square1.y+15){
            document.dispatchEvent(leftArea);
        }
	}
	square.y += square.velY;
	square.elem.style.top = `${square.y}px`;
}
const moveSquare1 = (square1, width) => {
	if(square1.x + square1.elem.offsetWidth >= width) {
		square1.velX = -(square1.velX)
		document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Touched bottom border'}}))
	}
	if(square1.x+15 < 0) {
		square1.velX = -(square1.velX)
		document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Touched top border'}}))
	}
	square1.x += square1.velX;
	square1.elem.style.left = `${square1.x}px`;
	
}

class Square {
	constructor(size, x, y, canvasWidth, canvasHeight, ctx){
		this.size = size;
		this.x = x;
		this.y = y;
		this.velX = random(-1, 3);
		this.velY = random(-1, 3);
		this.canvasHeight = canvasHeight;
		this.canvasWidth = canvasWidth;
		this.ctx = ctx;
	}

	updatePosition () {
        if(this.y + this.size >= this.canvasHeight) { 
        	this.velY = -(this.velY);
        	document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Touched bottom border'}}))
        
        }
	    if(this.y < 0) { 
	    	this.velY = -(this.velY);
	    	document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Touched top border'}}))
	    }
	    this.y += this.velY;
	}
    
    updatePosition1 () {
		if(this.x + this.size >= this.canvasWidth) { 
        	this.velX = -(this.velX);
        	document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Touched right border'}}))
        }
	    if(this.x < 0) { 
	    	this.velX = -(this.velX);
	    	document.dispatchEvent(new CustomEvent('animMessage', {detail: {message: 'Touched left border'}}))
	    }
	    this.x += this.velX;
	}

	draw () {
		this.ctx.fillStyle = "rgba(0, 0, 254, 1)";
		this.ctx.fillRect(this.x, this.y, this.size, this.size);
	}
    draw1 () {
		this.ctx.fillStyle = "rgba(254, 154, 54, 1)";
		this.ctx.fillRect(this.x, this.y, this.size, this.size);
	}
}