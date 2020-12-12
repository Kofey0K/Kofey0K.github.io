//main

createPlayButton('#middle');
createAnimationWorkspace();
createAnimationControls();
createAnimationArea();
document.querySelector("#play-button").addEventListener('click',function(event)
    {
        document.querySelector("#animation-work-container").style.display="flex"; 
    });

function createPlayButton(blockName)
{
    let play = document.createElement("button");
    play.id = "play-button";
    play.textContent = "Play Animation";
    play.style = "font-size: 15px;";
    document.querySelector(blockName).append(play);
}
function createAnimationWorkspace()
{
    let workContiner = document.createElement("div");
    workContiner.id = "animation-work-container";
    workContiner.style = 
        "position:absolute;  width: 100%; height: 100%;"+
        "display: none; align-items: center; justify-content: center;";

    let workspace = document.createElement("div");
    workspace.id = "animation-work";
    workspace.style = "width: calc(40% + 10px); height: calc(80% + 50px);" +
        "display: flex; flex-direction: column; box-sizing: border-box;"+
        "align-items: flex-end; justify-content: center;";

    workContiner.append(workspace);
    document.querySelector("body").append(workContiner);
}
function createAnimationArea()
{
    let animAreaCanvas = document.createElement("canvas");
    animAreaCanvas.id = "animation-area-canvas";
    animAreaCanvas.style = "width: calc(100% - 10px); height: calc(100% - 50px);" +
        "border: 5px solid blue; box-sizing: content-box;" +
        "background: black";
    animAreaCanvas.style.display = "none";

    let animAreaDiv = document.createElement("div");
    animAreaDiv.id = "animation-area-div";
    animAreaDiv.style = "width: calc(100% - 10px); height: calc(100% - 50px);" +
        "border: 5px solid blue; box-sizing: content-box; position: relative;";
    animAreaDiv.style.display = "flex";

    let tex1 = document.createElement("div");
    tex1.style = "width: 100%; height: 50%; position: absolute; background: url('img/1-texture.png');";
    let tex2 = document.createElement("div");
    tex2.style = "width: 100%; height: 50%; position: absolute; top: 50%; background: url('img/2-texture.png');";
    animAreaDiv.append(tex1);
    animAreaDiv.append(tex2);

    document.querySelector("#animation-work").append(animAreaCanvas);
    document.querySelector("#animation-work").append(animAreaDiv);
}
function createAnimationControls()
{
    let controls = document.createElement("div");
    controls.id="animation-controls";
    controls.style = "width: 100%; height: 40px;" +
        "display: flex; border: 5px solid blue; border-bottom: 0px;" +
        "align-items: center;" +
        "background: white";
        
    let close = document.createElement("button");
    close.id = "close-button";
    close.textContent = "Close";
    close.style.fontSize = "15px";

    let start = document.createElement("button");
    start.id = "start-button";
    start.textContent = "Start";
    start.style.fontSize = "15px";

    let reload = document.createElement("button");
    reload.id = "reload-button";
    reload.textContent = "Reload";
    reload.style.fontSize = "15px";
    reload.style.display = "none";

    let eventText = document.createElement("p");
    eventText.id = "event-text";
    eventText.style.fontSize = "15px";
    eventText.style.display = "none";
    
    let changeAnim = document.createElement("button");
    changeAnim.id = "change-animation-area";
    changeAnim.textContent = "Change animation area";
    changeAnim.style.fontSize = "15px";
    
    controls.append(close);
    controls.append(start);
    controls.append(reload);
    controls.append(changeAnim);
    controls.append(eventText);
    
    document.querySelector("#animation-work").append(controls);
}


//ball

function Ball(x, y, velX, velY, color, size)
{
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}
Ball.prototype.draw = function()
{
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
  ctx.fill();
};
Ball.prototype.update = function() {
  if((this.x + this.size) >= width)
  { 
    this.velX = -this.velX;
    displayMessage(this.color + " ball collided with the right");
  }
  if((this.x - this.size) <= 0)
  { 
    this.velX = -this.velX;
    displayMessage(this.color + " ball collided with the left");
  }
  if((this.y + this.size) >= height)
  { 
    this.velY = -this.velY;
    displayMessage(this.color + " ball collided with the bottom");
  }
  if((this.y - this.size) <= 0)
  { 
    this.velY = -this.velY;
    displayMessage(this.color + " ball collided with the top");
  }
  this.x += this.velX;
  this.y += this.velY;
};
Ball.prototype.collisionDetect = function()
{
    let next;
    for(let j = 0; j < balls.length; j++)
    {
        if(!(this === balls[j]) && !(this === next))
        {
            const dx = this.x-balls[j].x;
            const dy = this.y-balls[j].y;
            const distance = Math.sqrt(dx*dx+dy*dy);
            if(distance < this.size + balls[j].size)
            {
                this.velX = -this.velX;
                this.velY = -this.velY;
                this.x += this.velX;
                this.y += this.velY;
                balls[j].velX = -balls[j].velX;
                balls[j].velY = -balls[j].velY;
                balls[j].x += balls[j].velX;
                balls[j].y += balls[j].velY;
                next = balls[j];
                displayMessage("balls collided");
            }
        }
    }
};

//animation

const canvas = document.querySelector('#animation-area-canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = 0.4 * window.innerWidth;
const height = canvas.height = 0.8 * window.innerHeight;
const radius = 10;

var areImagesUploaded = false;
var imagesToLoad = {
    top: 'img/1-texture.png',
    bottom: 'img/2-texture.png',
    };
loadImages(imagesToLoad,
    function(imagesLoaded)
    {
        patternTop = ctx.createPattern(imagesLoaded.top, 'repeat');
        patternBottom = ctx.createPattern(imagesLoaded.bottom, 'repeat');
    }); 

function loadImages(imagesToBeLoaded, drawCallback)
{
    var imagesLoaded = {};
    var loadedImages = 0;
    var numberOfImagesToLoad = 0;
    for(var name in imagesToBeLoaded)
    {
        numberOfImagesToLoad++;
    }
        
    for(var name in imagesToBeLoaded)
    {
        imagesLoaded[name] = new Image();
        imagesLoaded[name].onload = function()
        {
            if(++loadedImages >= numberOfImagesToLoad)
            {
                drawCallback(imagesLoaded);
            } 
            areImagesUploaded = true;
        }; 
        imagesLoaded[name].src = imagesToBeLoaded[name];
        //document.querySelector("#data-cell5").append(imagesLoaded[name]);
    } 
} 
function drawTexture()
{     
    ctx.fillStyle = patternTop;
    ctx.fillRect(0, 0, width, height/2);

    ctx.fillStyle = patternBottom;
    ctx.fillRect(0, height/2, width, height);
}

function random(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; } 
function createBalls()
{
    let velX = (Math.random() < 0.5 ? -1 : 1)*random(3, 7);
    let velY = (Math.random() < 0.5 ? -1 : 1)*random(3, 7);
    let ball1 = new Ball
    (
        random(0 + radius, width - radius),
        radius + 1,
        velX,
        velY,
        "blue",
        radius
    );
    let newVelX = 0;
    let newVelY = 0;
    while(Math.abs(velX)+Math.abs(velY) != Math.abs(newVelX)+Math.abs(newVelY))
    {
        newVelX = (Math.random() < 0.5 ? -1 : 1)*random(3, 7);
        newVelY = (Math.random() < 0.5 ? -1 : 1)*random(3, 7);
    }
    let ball2 = new Ball
    (
        random(0 + radius, width - radius),
        height - radius - 1,
        newVelX,
        newVelY,
        "orange",
        radius
    );
    
    balls.push(ball1);
    balls.push(ball2);
}
function clearRectAndCreateNewBalls()
{
    drawTexture();
    balls = [];
    createBalls();
    for(let i = 0; i < balls.length; i++)
    {
        balls[i].draw();
    }
}
function animateBalls()
{
  drawTexture();
  for(let i = 0; i < balls.length; i++)
  {
    balls[i].update();
    balls[i].collisionDetect();
    balls[i].draw();
  }
  if(!isBallOnTopOrBottom()) { animationFrameid = requestAnimationFrame(animateBalls); }
}
function isBallOnTopOrBottom()
{
    let isBallOnTop = true;
    let isBallOnBottom = true;
    balls.forEach(ball => 
        {
            if(!(ball.y - ball.size >= height/2)) {isBallOnBottom = false;}
            if(!(ball.y + ball.size <= height/2)) {isBallOnTop = false;} 
        });
    if(isBallOnTop) {displayMessage("balls on top");}
    if(isBallOnBottom) {displayMessage("balls on bottom");}
    if(isBallOnTop || isBallOnBottom)
    {
        document.querySelector("#start-button").style.display = "none";
        document.querySelector("#reload-button").style.display = "block";
        return true;
    }
}
function displayMessage(message, displayMode = "block")
{
    let eventText = document.querySelector("#event-text");
    eventText.textContent = "Event: " + message;
    eventText.style.display = displayMode;
    eventText.style.color = "red";
    setTimeout(()=>{eventText.style.color = "black";},500);

    var today = new Date();
    var dateTime = ('0' + today.getDate()).slice(-2) + "/" + ('0' + (today.getMonth()+1)).slice(-2) +
        "/" + today.getFullYear() + " | " +
        ('0' + today.getHours()).slice(-2)   + ":" + ('0' + today.getMinutes()).slice(-2) + ":" +
        ('0' + today.getSeconds()).slice(-2) + ":" + ('00' + today.getMilliseconds()).slice(-3);

    let messages = localStorage.getItem("animation-events-message")?
        (localStorage.getItem("animation-events-message") + ";" + message): message;
    let dates = localStorage.getItem("animation-events-data-time")?
        (localStorage.getItem("animation-events-data-time") + ";" + dateTime): dateTime;
    localStorage.setItem("animation-events-message", messages);
    localStorage.setItem("animation-events-data-time", dates);
}
function writeAnimationEventsInfo(blockName)
{
    let animationEvents = document.createElement("div");
    animationEvents.id = "animation-events";
    animationEvents.style.width = "100%";
    animationEvents.style.display = "flex";
    animationEvents.style.justifyContent = "center";
    animationEvents.style.flexDirection = "row";
    animationEvents.style.overflow = "auto";

    let messages = document.createElement("ul");
    let dates = document.createElement("ul");

    let message = localStorage.getItem("animation-events-message").split(';');
    let dateTime = localStorage.getItem("animation-events-data-time").split(';');

    for (let index = 0; index < message.length; index++)
    {
        let m = document.createElement("li");
        let d = document.createElement("li");
        m.textContent = "Event: " + message[index];
        d.textContent = "Date: " + dateTime[index];
        messages.append(m);
        dates.append(d);
    }

    animationEvents.append(messages);
    animationEvents.append(dates);

    let oldAnimationEvents = document.querySelector("#animation-events");
    if(oldAnimationEvents) {oldAnimationEvents.outerHTML = '';}
    document.querySelector(blockName).append(animationEvents);
}

var balls = [];
var animationFrameid;
createAnimationAreaDivElements();

document.querySelector("#close-button").addEventListener('click',function(event)
    {
        document.querySelector("#animation-work-container").style.display="none";
        cancelAnimationFrameAndCreateNewBalls();
        document.querySelector("#reload-button").style.display = "none";
        let start = document.querySelector("#start-button");
        start.style.display = "block";
        start.disabled = false;
        displayMessage("close", "none");
        writeAnimationEventsInfo("#data-cell4");
    });
document.querySelector("#start-button").addEventListener('click',function(event)
    {
        if(document.querySelector("#animation-area-div").style.display == "flex")
        {
           animationFrameid = requestAnimationFrame(animateDomBalls);
        }
        else
        {
            animationFrameid = requestAnimationFrame(animateBalls);
        }
        this.disabled = true;
        displayMessage("start");   
    });
document.querySelector("#reload-button").addEventListener('click',function(event)
    { 
        cancelAnimationFrameAndCreateNewBalls();
        document.querySelector("#reload-button").style.display = "none";
        let start = document.querySelector("#start-button");
        start.style.display = "block";
        start.disabled = false;
        displayMessage("reload");
    });
document.querySelector("#change-animation-area").addEventListener('click',function(event)
    {
        if(document.querySelector("#animation-area-div").style.display == "flex")
        {
            drawTexture();  
            clearRectAndCreateNewBalls();
            document.querySelector("#animation-area-div").style.display = "none"; 
            document.querySelector("#animation-area-canvas").style.display = "flex";
        }
        else
        {
            balls = [];
            createBalls();
            drawDomBalls("#ball1", balls[0]);
            drawDomBalls("#ball2", balls[1]);
            document.querySelector("#animation-area-canvas").style.display = "none";
            document.querySelector("#animation-area-div").style.display = "flex"; 
        }
    });


function cancelAnimationFrameAndCreateNewBalls()
{
    cancelAnimationFrame(animationFrameid);
    if(document.querySelector("#animation-area-div").style.display == "flex")
    {
        balls = [];
        createBalls();
        drawDomBalls("#ball1", balls[0]);
        drawDomBalls("#ball2", balls[1]);
    }
    else
    {
        clearRectAndCreateNewBalls();
    }
}
function createAnimationAreaDivElements()
{
    let animationArea = document.querySelector("#animation-area-div");
    let ball1 = document.createElement("div");
    ball1.id = "ball1";
    ball1.style = "width: "+ (2*radius) +"px; height: "+ (2*radius) +"px;"+
        "border-radius: 50%; position: absolute; background-color: blue;"+
        "top:-"+ radius +"px; left:-"+ radius +"px;";

    let ball2 = document.createElement("div");
    ball2.id = "ball2";
    ball2.style = "width: "+ (2*radius) +"px; height: "+ (2*radius) +"px;"+
        "border-radius: 50%; position: absolute; background-color: orange;"+
        "top:-"+ radius +"px; left:-"+ radius +"px;";
    
    animationArea.append(ball1);
    animationArea.append(ball2);

    createBalls();
    drawDomBalls("#ball1", balls[0]);
    drawDomBalls("#ball2", balls[1]);
}
function animateDomBalls()
{
  ballNames = ["#ball1","#ball2"];
  for(let i = 0; i < balls.length; i++)
  {
    balls[i].update();
    balls[i].collisionDetect();
    drawDomBalls(ballNames[i], balls[i]);
  }
  if(!isBallOnTopOrBottom()) { animationFrameid = requestAnimationFrame(animateDomBalls); }
}
function drawDomBalls(ballName, ball)
{
    document.querySelector(ballName).style.transform =  "translate(" + ball.x + "px," + ball.y + "px)";
}

