/*
 * Create a list that holds all of your cards
 */
const cardList = ["fa-diamond","fa-paper-plane-o","fa-anchor","fa-bolt","fa-cube","fa-leaf","fa-bicycle","fa-bomb"];
let openCards = []; // To hold opened cards
let numberOfMoves = 0;
let matchedCount = 0; // To end the game when it reaches 8
let gameTime = 0; // In Seconds
let starCount = 3; // 3 starts initially
let gameStarted = false;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
$(document).ready(function(){
	initializeGame();
	$(".restart").on('click',resetGame);
	vex.defaultOptions.className = 'vex-theme-os';
	vex.dialog.buttons.YES.text = 'I love to play again!';
	vex.dialog.buttons.NO.text = 'Cancel';
});

// function to initialize the game and board.
function initializeGame(){
	gameStarted = false;
	updateMovesCount();
	createBoard();
	resetStars();
	$(".card").on('click', cardClickHandler);
}

// function to increment and display the number of moves on the board
function incrementMove(){
	numberOfMoves ++;
	updateMovesCount();
	if (numberOfMoves === 16 || numberOfMoves === 24){
		//reduceStar();
		removeAStar();
	}
}

//function to reset the stars
function resetStars(){
	for (let i=0; i<starCount; i++){
		$(".stars").append(`<li><i class="fa fa-star"></i></li>`);
	}
}

// function to lower a star after some number of moves.
function removeAStar(){
	let stars = $(".fa-star");
	$(stars[stars.length-1]).toggleClass("fa-star fa-star-o");
}

function updateMovesCount(){
	$(".moves").html(numberOfMoves);
}

// Function to count the time taken
function startTimeTicking(){
	gameTime += 1;
	$(".gameTimer").html(gameTime);
	gameTimer = setTimeout(startTimeTicking, 1000);
}

// Creates board of cards
function createBoard(){
	shuffle(cardList.concat(cardList)).forEach( (cardClass) => {
		$("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
	});
}

// Handles when a card is clicked
function cardClickHandler(event){
	incrementMove();
	// check opened or matched card
	let classes = $(this).attr("class");
	if (classes.search('open') * classes.search('match') !== 1){
		// both should be -1
		return;
	}
	if (!gameStarted) {
		gameStarted = true;
		gameTime = 0;
		gametimer = setTimeout(startTimeTicking, 1000);
	}
	if (openCards.length < 2){
		$(this).toggleClass("open show");
		openCards.push($(this));
	}
	if (openCards.length === 2){
		checkForMatch();
	}
}

// This function checks for match when openCards array has 2 elements
function checkForMatch(){
	if ((openCards[0])[0].firstChild.className === (openCards[1])[0].firstChild.className){
		matchedCount ++;
		openCards.forEach((card)=>{
				card.animateCss('tada', function(){
				card.toggleClass("open show match");
			});
		});
	} else {
		openCards.forEach((card)=>{
			card.animateCss('shake', function(){
				card.toggleClass("open show");
			});
		});
	}
	resetOpenCards();
	if (matchedCount === 8){
		endTheGame();
	}
}

// function to clear the  openCards array.
function resetOpenCards(){
	openCards = [];
}

// load animateCss - Source : https://github.com/daneden/animate.css/#usage
$.fn.extend({
	animateCss: function (animationName, callback) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		this.addClass('animated ' + animationName).one(animationEnd, function () {
			$(this).removeClass('animated ' + animationName);
			if (callback) {
				callback();
			}
		});
		return this;
	}
});

function endTheGame(){
	let earnedStars = $(".fa-star").length;
	clearTimeout(gameTimer);
	vex.dialog.confirm({
		message: `Congrats! You won the game in ${gameTime} seconds with ${earnedStars}/3 star rating. Do you wish to play again?`,
		callback: function(value){
			if (value){
				resetGame();
			}
		}
	});
}

function resetGame(){
	$("ul.deck").html("");
	$(".stars").html("");
	numberOfMoves = -1;
	incrementMove();
	gameStarted = false;
	openCards = [];
	gameTime = 0;
	matchedCount = 0;
	clearTimeout(gameTimer);
	$(".gameTimer").html(0);
	initializeGame();
}