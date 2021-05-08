//Create variables here
var dog, happyDog;
var dogImg, happyDogImg;
var milk, milkImg;
var database;
var foodS, foodStock;
var fedTime, lastFed;
var food;
var changeGameState, readGameState;
var gamestate;
var bedroomImg, gardenImg, washroomImg;

function preload() {
	//load images here
    dogImg = loadImage("images/Dog.png");
    happyDogImg = loadImage("images/happydog.png");
    milkImg = loadImage("images/Milk.png");
    bedroomImg = loadImage("images/virtual+pet+images/virtual pet images/Bed Room.png");
    gardenImg = loadImage("images/virtual+pet+images/virtual pet images/Garden.png");
    washroomImg = loadImage("images/virtual+pet+images/virtual pet images/Wash Room.png");
}

function setup() {
    createCanvas(800, 800);

    dog = createSprite(400, 400, 20, 20);
    dog.addImage(dogImg);
    dog.scale = 0.25;

    database = firebase.database();
    foodStock = database.ref('food');
    foodStock.on("value", readStock);

    feed = createButton("Add the food!");
    feed.position(700, 195);
    feed.mousePressed(feedDog);

    fedTime = database.ref('FeedTime');
    fedTime.on("value", function (data) {
        lastFed = data.val();
    })
}


function draw() {
    background("pink");

    readGameState = database.ref('gameState');
    readGameState.on("value", function (data) {
        gamestate = data.val();
    })

    displayFood();

    if (keyWentDown(UP_ARROW)) {
        writeStock(foodS);
        dog.addImage(happyDogImg);
    }

    drawSprites();

    //add styles here
    textSize(20);
    fill(0);
    text("Click the button to add the food!", 300, 70);
    text("Press the up arrow to feed the dog!", 280, 120);

    if (lastFed >= 12) {
        text("Last feed: " + lastFed % 12 + " PM", 350, 30);
        update("sleeping");
        bedroom();
    } else if (lastFed === 0) {
        text("Last feed: 12 AM", 350, 30);
        update("playing");
        garden();
    } else {
        text("Last feed: " + lastFed + " AM", 350, 30);
        update("hungry");
        background("pink");
           }
}

function readStock(data) {
    foodS = data.val();
}

function writeStock(x) {
    if (x < 0) {
        x = 0;
    } else {
        x = x - 1;
    }
    database.ref('/').update({
        food: x
    })
}

function feedDog() {
    foodS++;
    database.ref('/').update({
        food: foodS
    })
}

function update(state) {
    database.ref('/').update({
        gameState: state
    })
}

function bedroom() {
    dog.addImage(bedroomImg);
}

function garden() {
    dog.addImage(gardenImg);
}

function washroom() {
    dog.addImage(washroomImg);
}

function displayFood() {
    var x = 80;
    var y = 100;
    if (foodS !== 0) {
        for (var i = 0; i < foodS; i++) {
            if (i % 10 === 0) {
                x = 80;
                y = y + 50;
            }
            image(milkImg, x, y, 50, 50);
            x = x + 30;
        }
    }
}