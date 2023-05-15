const numbers = [
	"ace",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"jack",
	"queen",
	"king",
]
const suits = ["clubs", "diamond", "heart", "spades"]
let cardsInDeck = []
let cardsOnBoard = []
let gameActive = 1
let bust = 0

const compScore = document.getElementById("comp-score")
const playerScore = document.getElementById("player-score")
const resultsScore = document.getElementById("results")

let compLocalScore = localStorage.getItem("compLocalScore") || 0
let playerLocalScore = localStorage.getItem("playerLocalScore") || 0
let tieLocalScore = localStorage.getItem("tieLocalScore") || 0

// object class with an empty cards array and a score method that assumes
class handClass {
	cards = []
	get score() {
		let ace = 0
		let sum = 0
		this.cards.forEach(function (card) {
			card = card.split(" ")[1]
			if (card == "ace") {
				// assumes aces are 11 and counts them,
				ace++
			}
			sum += getCardValue(card)
			while (sum > 21 && ace) {
				sum -= 10 // if over 21, change ace to 1
				ace -= 1
			}
		})
		return sum
	}
}

// returns a number value from the card's class
function getCardValue(card) {
	let cardValue = 10 // default for face cards and 10
	if (cardLookupMap.get(card)) {
		cardValue = cardLookupMap.get(card)
	}
	return cardValue
}

const cardLookupMap = new Map([
	["two", 2],
	["three", 3],
	["four", 4],
	["five", 5],
	["six", 6],
	["seven", 7],
	["eight", 8],
	["nine", 9],
	["ace", 11],
])

let playerCards = new handClass()
let compCards = new handClass()
let cardTarget

// draws two cards for each player and assigns one dealer card as face-down
function drawCards() {
	cardTarget = "comp"
	compCards.cards.push(newCard(playerCards.cards))
	compCards.cards.push(newCard(playerCards.cards))
	document.getElementById("comp").children[1].lastChild.className +=
		" face-down"
	cardTarget = "player"
	playerCards.cards.push(newCard(compCards.cards))
	playerCards.cards.push(newCard(compCards.cards))
	document.getElementById("player-score").innerText = playerCards.score
}

// draws card, updates score, and holds if over 21
function hit() {
	if (gameActive) {
		playerCards.cards.push(newCard())
		document.getElementById("player-score").innerText = playerCards.score
		if (playerCards.score > 21) {
			bust = true
			hold()
		}
	}
}

// shows the hidden dealer card, draws another dealer card if 16 or under, and updates score ui
function hold() {
	if (gameActive) {
		document
			.getElementById("comp")
			.children[1].lastChild.classList.remove("face-down")
		if (compCards.score <= 16 && bust === false) {
			cardTarget = "comp"
			compCards.cards.push(newCard(playerCards.cards))
		}
		document.getElementById("comp-score").innerText = compCards.score
		document.getElementById("player-score").innerText = playerCards.score
		bust = false
		results()
	}
}

// sets the game to inactive, changes results ui based on who won, and updates local score ui
function results() {
	gameInactive()
	if (playerCards.score == compCards.score) {
		tie()
	} else if (playerCards.score > 21 && compCards.score > 21) {
		tie()
	} else if (playerCards.score > 21 && compCards.score > !21) {
		lose()
	} else if (compCards.score > 21 && playerCards.score > !21) {
		win()
	} else if (compCards.score > playerCards.score) {
		lose()
	} else if (compCards.score < playerCards.score) {
		win()
	} else {
		resultsScore.innerText = "Error!"
	}
	updateUi()
}

function updateUi() {
	document.getElementById("local-comp-score").innerText =
		localStorage.getItem("compLocalScore")
	document.getElementById("local-player-score").innerText =
		localStorage.getItem("playerLocalScore")
	document.getElementById("local-tie-score").innerText =
		localStorage.getItem("tieLocalScore")
}

function lose() {
	resultsScore.innerText = "You lose..."
	compLocalScore++
	console.log("compLocalScore: " + compLocalScore)
	localStorage.setItem("compLocalScore", compLocalScore)
}

function win() {
	resultsScore.innerText = "You win!"
	playerLocalScore++
	console.log("playerLocalScore: " + playerLocalScore)
	localStorage.setItem("playerLocalScore", playerLocalScore)
}

function tie() {
	resultsScore.innerText = "Tie."
	tieLocalScore++
	console.log("tieLocalScore: " + tieLocalScore)
	localStorage.setItem("tieLocalScore", tieLocalScore)
}

// sets the game as inactive and changes the hit and hold buttons to a new game button
function gameInactive() {
	gameActive = 0
	document.getElementById("hit-btn").className += " hidden"
	document.getElementById("hold-btn").className += " hidden"
	document.getElementById("new-game-btn").classList.remove("hidden")
}

// starts a new game
function reset() {
	gameActive = 1
	resultsScore.innerText = ""
	document.getElementById("comp").innerHTML = ""
	document.getElementById("player").innerHTML = ""
	cardsInDeck = cardsInDeck.concat(cardsOnBoard)
	cardsOnBoard = []
	playerCards.cards = []
	compCards.cards = []
	drawCards()
	document.getElementById("hit-btn").classList.remove("hidden")
	document.getElementById("hold-btn").classList.remove("hidden")
	document.getElementById("new-game-btn").className += " hidden"
	document.getElementById("comp-score").innerText = "??"
}

function initializeDeck() {
	for (let i = 0; i < numbers.length; i++) {
		for (let j = 0; j < suits.length; j++) {
			cardsInDeck.push(numbers[i] + " " + suits[j])
		}
	}
	document.getElementById("hit-btn").addEventListener("click", hit)
	document.getElementById("hold-btn").addEventListener("click", hold)
	document.getElementById("new-game-btn").addEventListener("click", reset)
}

// gets a random class list for cards (e.g. card ace spades)
function getCard() {
	let randomCard = cardsInDeck[Math.floor(Math.random() * cardsInDeck.length)]
	if (randomCard) {
		cardsOnBoard.push(randomCard)
		cardsInDeck.splice(cardsInDeck.indexOf(randomCard), 1)
		randomCard = "card " + randomCard
		return randomCard
	} else {
		return false
	}
}

// adds a new card and gives it proper classes
function newCard() {
	var deck = document.getElementById("deck")
	let randomCard = getCard()
	if (randomCard) {
		let cardContainer = document.createElement("div")
		cardContainer.setAttribute("class", "card-container")
		let node = document.createElement("div")
		node.setAttribute("class", randomCard)
		document.getElementById(cardTarget).appendChild(cardContainer)
		document.getElementById(cardTarget).lastChild.appendChild(node)
		// document.getElementById("new-card").innerText = cardsInDeck.length;
		//**ANIMATE**
		var addedCard = document.getElementById(cardTarget).lastChild //Get Last Added Card

		//Calculate Offsets
		var viewportOffset = addedCard.getBoundingClientRect()
		var offsetTop = -(16 + viewportOffset.top + addedCard.clientHeight)
		var offsetLeft = -(16 + viewportOffset.left + addedCard.clientWidth)
		addedCard.style.top = offsetTop + "px"
		addedCard.style.left = offsetLeft + "px"

		//Force Visually Update Dom
		requestAnimationFrame(() => {
			addedCard.style.top = 0 + "px"
			addedCard.style.left = 0 + "px"
		})
		//**ANIMATE**
	}
	return randomCard
}

updateUi()
initializeDeck()
drawCards()
