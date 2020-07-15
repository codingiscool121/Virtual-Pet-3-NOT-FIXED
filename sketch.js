var dog,happyDog,database,foodS,foodStock,MilkIMGl
var feedpet,addfood,fedTime,lastFed
var foodObject;
var changegameState,readgameState;
var bedroomIMG, bathroomIMG,gardenIMG;
var gameState;
// var addfoods;
var foodObj;
function preload()
{
	dogIMG = loadImage("Dog.png");
	happydogIMG = loadImage("happydog.png");
	bedroomIMG = loadImage("bedroom.png");
	bathroomIMG = loadImage("bathroom.png");
	gardenIMG = loadImage("garden.png");
	sadDog = loadImage("saddog.jpg");
}

function setup() {
	database = firebase.database();
	createCanvas(1000,500);
	dog = createSprite(800,200,30,30);
	dog.addImage(dogIMG);
	dog.scale = 0.2;
	foodStock = database.ref('Food');
	foodStock.on("value",readstock);
	
	feed = createButton("Feed the dog.");
	feed.position(700,95);
	feed.mousePressed(feedDog);


	addfood = createButton("Add food.");
	addfood.position(800,95);
	addfood.mousePressed(addFoods);

    foodObj = new Food();
	
	//reading the gameState from the database
	readgameState = database.ref('gameState');
	readgameState.on("value",function(data){
    gameState = data.val();
	});
  

}


function draw() {
background("green");
foodObj.display();
textSize(20);
fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
lastFed=data.val();
});
fill("white");
if(lastFed>=12){
	text("Last Feed: "+lastFed%12 + "PM",350,30);
} else if(lastFed == 0){
	text("Last Feed: 12 AM",350,30);
}else{
	text("Last Feed: "+lastFed+"AM",350,30)
}


if(gameState != "Hungry"){
	feed.hide();
	addfood.hide();
	dog.remove();
	}
	else{
		feed.show();
		addfood.show();
		dog.addImage(dogIMG);
	} 


currentTime = hour();
if(currentTime==(lastFed+1)){
	update("Playing");
	foodObj.gardenIMG();
}else if(currentTime==(lastFed+2)){
	update("Sleeping");
	foodObj.bedroomIMG();
}else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
	update("Bathing");
	foodObj.bathroomIMG();
}else{
	update("Hungry")
	foodObj.display();
}



drawSprites();
}


function readstock(data){
	foodS = data.val();
	foodObj.updateFoodStock(foodS);
	}



//function to update food stock and last fed time
function feedDog(){
	dog.addImage(happydogIMG);
	foodObj.updateFoodStock(foodObj.getFoodStock()-1);
	database.ref('/').update({
		Food:foodObj.getFoodStock(),
		FeedTime: hour()
	})
}

function addFoods(){
	foodS++;
	database.ref('/').update({
		Food:foodS
	})
}



// function writeStock(x){
// 	if(x<=0){
// 	   x=0;
// 	}
// 	else{
// 		x=x-1;
// 	}
//     database.ref('/').update({
// 		Food:x
//     })

// }


//function to update gameState in database
function update(state){
	database.ref('/').update({
    gameState:state
	});
}