var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var cactus, c1, c2, c3, c4, c5, c6;
var score

var cloudGroup, cactusGroup;
var PLAY = 1
var END = 0
var gameState= PLAY
var GameOver, restart, gImage, rImage

var jumpSound, checkpointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  c1= loadImage("obstacle1.png");
  c2= loadImage("obstacle2.png");
  c3 = loadImage("obstacle3.png");
  c4= loadImage("obstacle4.png");
  c5 = loadImage("obstacle5.png");
  c6 = loadImage("obstacle6.png");
  
  gImage = loadImage("gameOver.png");
  rImage = loadImage("restart.png");
  
  jumpSound = loadSound ("jump.mp3");
  checkpointSound = loadSound ("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  console.log("Hello"+ 5)
  
  score = 0
  
  gameOver = createSprite(300, 80)
  gameOver.addImage(gImage);
  gameOver.scale= 0.5
  restart = createSprite(300, 120)
  restart.addImage(rImage)
  restart.scale = 0.5
  gameOver.visible = false
  restart.visible = false
  trex.setCollider("circle",0,0,50)
  trex.debug = false
  
  cloudGroup = new Group()
  cactusGroup =  new Group()
}
function draw() {
  background(180);
 console.log(frameCount);
  text("SCORE-"+score,400, 50);
  
  if(gameState === PLAY){
  ground.velocityX = -(4+3*score/100);
    
    score= score+Math.round(getFrameRate()/60)
    
    // to make the ground infinite
  if (ground.x < 0){
    ground.x = ground.width/2;
  } 
    
   if(keyDown("space")&& trex.y >= 160) {
    trex.velocityY = -10;
     jumpSound.play()
  }
    
  trex.velocityY = trex.velocityY + 0.8 
    spawnClouds();
  spawnCactus();
    
    if(score>0 && score%100 === 0){
      checkpointSound.play();
    }
    
    if(cactusGroup.isTouching(trex)){
    gameState= END;
      dieSound.play()
      //trex.velocityY  = -10
      //jumpSound.play()
    }

  }
  else if(gameState === END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    cactusGroup.setVelocityXEach(0)
    cloudGroup.setVelocityXEach(0)
    
    restart.visible = true
    gameOver.visible= true
    
    //changing animation of trex
    trex.changeAnimation("collided",trex_collided);
    
    cactusGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
  }
  
  
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
     gameState = PLAY;
    
    restart.visible = false
    gameOver.visible= false
    
    cloudGroup.destroyEach()
    cactusGroup.destroyEach()
    
    score = 0;
    trex.changeAnimation("running", trex_running);
  }
  
  //spawn the clouds
  
  drawSprites();
}

function spawnCactus(){
  if(frameCount % 70 === 0){
    
  cactus= createSprite(600, 160, 20, 20);
    cactus.velocityX = -(6+3*score/100);
    
    //creating random obstacles
    var num = Math.round(random(1,6))
    switch(num){
      case 1:cactus.addImage(c1);
       break;
       case 2:cactus.addImage(c2);
        break;
        case 3: cactus.addImage(c3);
        break;
        case 4: cactus.addImage(c4);
        break;
        case 5: cactus.addImage(c5);
        break;
        case 6: cactus.addImage(c6);
        break;
        default:break;
    }
    cactus.scale= 0.5
    cactus.lifetime = 100;
    cactusGroup.add(cactus);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    cloudGroup.add(cloud);
    
    //assigning lifetime to the variable
    cloud.lifetime = 200
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    }
}

