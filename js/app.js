/*
 * Create a list that holds all of your cards
 */


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

// Set all cards face down
function faceDown() {
	for (var i = 0; i < li_cards.length; i++) {
		li_cards[i].className = 'card';
	}
}

// Adjust unmatched cards classes after animation
function delayFaceDown() {
	card1.className = 'card';
	card2.className = 'card';
	card1 = '';
	card2 = '';
	wait = 0;
}

// Place our cards into an array so we can shuffle
function fillCard() {
	for (var i = 0; i < li_cards.length; i++) {
		cards.push(li_cards[i]);
	}
	cards = shuffle(cards);
}

// Comparison of card classnames to determine a match
function checkMatch() {
	if (card1.lastElementChild.className.split(' ')[1] === card2.lastElementChild.className.split(' ')[1]) {
		card1.className = 'card match';
		card1.lastElementChild.classList.toggle('flipped-icon');
		card2.className = 'card match';
		card1 = '';
		card2 = '';
		matches += 1;
	} else {
		wait = 1;
		card1.className = 'card wrong';
		card1.lastElementChild.classList.toggle('flipped-icon');
		card2.className = 'card wrong';
		setTimeout(delayFaceDown, 1000);
		// card1 = '';
		// card2 = '';
	}
}

// Remove pre-existing html elements
// Replace with shuffeled elements
function hideAndPlaceDeck() {
	// Remove cards from board
	for (var i = 0; i < li_cards.length; i++) {
		li_cards[i].remove();
	}

	// Place shuffled cards
	for (var i = 0; i < cards.length; i++) {
		deck.append(cards[i]);
	}

	faceDown();
}

// Convert stars to empty stars based on number of moves made
function adjustStars() {
	if (moves.textContent > 32 && star1.className === 'fa fa-star') {
		star1.className = 'fa fa-star-o';
		star_count--;
	} else if (moves.textContent > 24 && star2.className === 'fa fa-star') {
		star2.className = 'fa fa-star-o';
		star_count--;
	} else if (moves.textContent > 16 && star3.className === 'fa fa-star') {
		star3.className = 'fa fa-star-o';
		star_count--;
	}
}

// Construct modal information to display
// Set modal to active
function displayModal() {
	let info = document.querySelector('p.modal-info');
	let modal_time = document.querySelector('p.modal-time');

	info.textContent = `With ${moves.textContent} Moves and ${star_count} Stars.`;
	modal_time.textContent = `Taking ${Math.round(seconds)}s`;

	modal.classList.add('active');
}

// Reset game variable values
function reset() {
	moves.textContent = 0;
	matches = 0;
	resetStars();
	cards = [];
	fillCard();
	hideAndPlaceDeck();
	faceDown();

	card1 = '';
	card2 = '';

	timer.textContent = "0s";
	start = 0;
	seconds = 0;
}

function resetStars() {
	star1.className = 'fa fa-star';
	star2.className = 'fa fa-star';
	star3.className = 'fa fa-star';

	star_count = 3;
}

let deck = document.querySelector('ul.deck');
let cards = [];
let li_cards = document.querySelectorAll('li.card');

let moves = document.querySelector('span.moves');
moves.textContent = 0;
let matches = 0;

let reset_btn = document.querySelector('div.restart');
let play_again = document.querySelector('button.play-again');

let modal = document.querySelector('div.modal');
let timer = document.querySelector('span.timer');

let card1 = '';
let card2 = '';

let wait = 0;
let start = 0;
let startTime = '';
let endTime = '';
let seconds = 0;

// stars
let stars = document.querySelector('ul.stars');
let star1 = stars.children[0].lastElementChild
let star2 = stars.children[1].lastElementChild
let star3 = stars.children[2].lastElementChild
let star_count = 3;

fillCard();
hideAndPlaceDeck();

// Update timer
setInterval(function () {
	if (start == 1) {
		endTime = new Date();
		seconds = endTime - startTime;
		seconds /= 1000;

		timer.textContent = `${Math.round(seconds)}s`;
	}
}, 1000);

// Event Listener for reset button
reset_btn.addEventListener('click', function(event) {
	reset();
});

// Event listener for play again button
play_again.addEventListener('click', function(event) {
	reset();
	modal.classList.remove('active');
});

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

 // Event listeners for click
deck.addEventListener('click', function(event){
	if (start == 0) {
		startTime = new Date();
		start = 1;
	}

	if (matches < 8) {
		if (wait == 0 && event.target.className === 'card')
		{
			event.target.className = 'card open show';
			if (card1 == '')
			{
				event.target.lastElementChild.classList.toggle('flipped-icon');
				event.target.className = 'card flipped open show rotate';
				card1 = event.target;
			}
			else if (card2 == '')
				card2 = event.target;
		}

		if (wait == 0 && card1 != '' && card2 != '') {
			checkMatch();
			moves.textContent = parseInt(moves.textContent) + 1;
		}
	}

	if (matches >= 8) {
		setTimeout(displayModal, 1000);
		start = 0;
	}
	adjustStars();
});
