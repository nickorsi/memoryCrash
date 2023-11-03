"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

//Use window.onload to ensure code does not run until the page is loaded. All code will be held within this function.

window.onload = function() {

  //Declare wait time for showing unmatched cards
  const FOUND_MATCH_WAIT_MSECS = 1000;

    /** Declare some variable to track player progrssion */

  //Define guessesMade as 0, define gameGuessesMade as relevant html element, and set the inner text to guessesMade
  let guessesMade = 0;
  const gameGuessesMade = document.querySelector(".score p:nth-child(1) span");
  gameGuessesMade.innerText = `${guessesMade}`;
  //Define matchesMade as 0, define gameMatchesMade as relevant html element, and set the inner text to matchesMade
  let matchesMade = 0;
  const gameMatchesMade = document.querySelector(".score p:nth-child(2) span");
  gameMatchesMade.innerText = `${matchesMade}`;
  //Define gameSuccessRate as relevant html element to be used later
  const gameSuccessRate = document.querySelector(".score p:nth-child(3) span");
  //Define cardsMade to track how many cards were made for the game, to be used to determine weight of score when updating score board
  let cardsMade;

  //To prevent too many cards from facing up, will define variables to keep track of cards facing up
  //Will define cardsPicked as 0
  let cardsPicked = 0;
  //Will define card1 and card2 as undefined
  let card1;
  let card2;

  /** Create event listener to PLAY button. */

  //Assign variables to selected elements within the DOM to be used on the PLAY event listener
  const form = document.querySelector("#startForm");
  const number = document.querySelector("#cardCount");
  const startScreen = document.querySelector(".startScreen");

  //Define an event listener to determine if user has input the correct value on the start screen
  form.addEventListener('submit', function(event) {
    //Prevents default behavior of refreshing the page on submit
    event.preventDefault();
    //Define input as the number value
    const input = Number(number.value);
    //Set value in text field to blank
    number.value = '';
    //Look to the value submitted in the text field to determine if the value wasn't an even number from 4 to 100
    if(isNaN(input) || Number(input) < 4 || Number(input) > 100 || Number(input) % 2 !== 0) {
      //If not, alert the window with message to pick an even number from 4 to 100
      window.alert("Please make sure to choose an even number from 4 to 100!");
    } else {
      //Otherwise, add class to start screen element so it fades away
      startScreen.classList.add("startScreen--hidden");
      //Invoke the colors function passing in the valid number and assign result to COLORS
      const COLORS = createColors(Number(input));
      //Invoke the shuffle function passing in COLORS and assign result to colors
      const colors = shuffle(COLORS);
      //Invoke createCards passing in colors
      createCards(colors);
    }
  })

  //Edited code to create cards from 4 to 100, made a new createColors function
    // const COLORS = [
    //   "red", "blue", "green", "orange", "purple",
    //   "red", "blue", "green", "orange", "purple",
    // ];

  /** createColors function takes in an integer 'num' and returns an array of colors for the deck. */

  function createColors(num) {
    //Declare resultColors as empty array
    const resultColors = [];
    //Use for loop to iterate from 0 to num-1/2
    //This is becuase we only need HALF the number of cards to generate unique colors, which are then repeated
    //IE a deck of 2 cards only needs 1 color.
    for(let i = 0; i < (num-1)/2; i++) {
      //Now want to generate random colors for each card. Will use the rgb color format and Math random to generate random values for each value
      //Define red, green, blue as values of Math.Random multiplied by 255 and rounded to nearest integer
      const red = Math.round(Math.random() * 255);
      const green = Math.round(Math.random() * 255);
      const blue = Math.round(Math.random() * 255);
      //Push the string version of the rgb value into resultColors
      resultColors.push(`rgb(${red}, ${green}, ${blue})`);
    }
    //Return and array with resultColors spread into it twice, as the colors must be repeated twice
    return [...resultColors,...resultColors];
  }


  /** shuffle function takes array 'items' in-place and returns shuffled array. */

  function shuffle(items) {
    // This algorithm does a "perfect shuffle", where there won't be any
    // statistical bias in the shuffle (many naive attempts to shuffle end up not
    // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
    // you're interested, you can learn about it, but it's not important.
    for (let i = items.length - 1; i > 0; i--) {
      // generate a random index between 0 and i
      let j = Math.floor(Math.random() * i);
      // swap item at i <-> item at j
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  /** createCards function takes in array 'colors' and creates a card for the game
   *
   * Each div DOM element will have:
   * - a class with the value of the color
   * - a click event listener for each card to handleCardClick
   */

  function createCards(colors) {
    const gameBoard = document.getElementById("board");

    for (let i = 0; i < colors.length; i++) {
      // Create Div elements representing the containers for the cards
      const card = document.createElement('div');
      const front = document.createElement('div');
      const back = document.createElement('div');
      //Appd the divs to build the cards
      card.append(front);
      card.append(back);
      gameBoard.append(card);
      // Assign classes to the divs to help with styling
      card.classList.add('card',`card${i}`);
      front.classList.add('front');
      back.classList.add('back');
      // Apply the styling to the front of the card to color it
      front.style.backgroundColor = `${colors[i]}`;
      //Add event listener to the back div which represents the card space and will be the highest div in the z direction
      //NOTE: Could delegate this listener to the 'game' div and make sure the target click was isolated to the back div
      //This would make it so only one event listener is needed and decrease the memory used compared to this method
      back.addEventListener("click", function(event) {
        //When a click occurs on the back div space, will pass the event to the handleCardClick function
          handleCardClick(event);
      });
    }
    //Assign the cardsMade variable a value equal to the length of colors
    cardsMade = colors.length;
  }


  /** handleCardClick function takes in an event and invokes the flipCard function passing in the event. */

  function handleCardClick(evt) {
    //Increment the cardsPicked variable
    cardsPicked++;
    //Determine if the cardsPicked is less than or equal to 2, this prevents more than 2 cards being played
    if(cardsPicked <= 2 ){
      //Increment guessesMade by 1
      guessesMade++;
      //Update game tracking on guess made
      gameGuessesMade.innerText = `${guessesMade}`;
      //Then see if card1 is undefined if so assign to 'evt.target'
      if(card1 === undefined) card1 = evt.target;
      //Otherwise assign card2 'card'
      else card2 = evt.target;
      //Then invoke the flipCard function passing in evt.target
      flipCard(evt.target);
    }
    //If cardsPicked === 2...
    if(cardsPicked === 2) {
      //Need to determine if the cards are the same and currently 'card1/2' are pointing at the 'back' div.
      //Need to look at the inline background color stylying of the 'front' div, which is the previous element sibling.
      //If these are the same...
      if(card1.previousElementSibling.style.backgroundColor === card2.previousElementSibling.style.backgroundColor) {
        //Increment matches made
        matchesMade++;
        //Want the following to occur AFTER the card transition has completed on the second card, otherwise will happen before card flips
        //Will look to the  parentElement of card2 to confirm tranition is finished
        card2.parentElement.addEventListener('transitionend', function(event) {
          //Update card border color to indicate a match on the front div
          console.log('here');
          card1.previousElementSibling.style.border = "4px solid rgb(255, 255, 255)";
          card2.previousElementSibling.style.border = "4px solid rgb(255, 255, 255)";
          //Update the game tracking on match made and success rate
          gameMatchesMade.innerText = `${matchesMade}`;
          gameSuccessRate.innerText = `${Math.round(matchesMade*2/guessesMade*100)}%`;
          //If all matches made, ie matchesMade equals half of cardsMade...
          if(matchesMade === cardsMade/2) {
            // //Invoke a setTimeout to do the following after 1 second to allow the last card to flip
            // setTimeout(() => {
              //Alert the window with a message
              window.alert(`All cards matched! You had a success rate of ${Math.round(matchesMade*2/guessesMade*100)}% while playing with ${cardsMade} cards! Hit RESET to play again.`);
              //Gather all the table cell elements representing success rates and cards played on the scoreboard and assign to variables
              const successRates = document.querySelectorAll("tr>td:nth-child(2)");
              const cardsPlayed = document.querySelectorAll("tr>td:nth-child(3)");
              //Define currentSucessRate as matchesMade*2/guessesMade*100
              let currentSuccessRate = Math.round(matchesMade*2/guessesMade*100);
              //Define currentCardsPlayed as cardsMade
              let currentCardsPlayed = cardsMade;
              //Loop through the successRates array
              for(let i = 0; i < successRates.length; i++){
                //Assign variables representing the innertext for each cell
                let successRate = successRates[i].innerText;
                let cardPlayed = cardsPlayed[i].innerText;
                //If the cell is empty then...
                if(successRate === "") {
                  //Replace the innerText at the current success rate cell with currentSuccessRate
                  successRates[i].innerText = `${currentSuccessRate}%`;
                  //Replace the cards played cell with the currect cards played
                  cardsPlayed[i].innerText = `${currentCardsPlayed}`;
                  //Break the loop
                  break;
                }
                //Define cellSuccessRate as the number in the cell without the % sign
                const cellSuccessRate = Number(successRate.substring(0, successRate.length - 1))
                //Define cellCardPlayed as the number in the cell
                const cellCardPlayed = Number(cardPlayed);
                //Otherwise determine if 'weighted' success rate in the cell is less than the current 'weighted'
                //'Weighted' success rate is success rate * cards played / 100, where 100 is the highest amount of cards that can be played
                //If you play with more cards, you are dealing with more variables and success rate should be weighted higher
                if(cellSuccessRate * cellCardPlayed / 100 <  currentSuccessRate * currentCardsPlayed / 100) {
                  //Need to replace the innerText of the cells with the current rates
                  successRates[i].innerText = `${currentSuccessRate}%`;
                  cardsPlayed[i].innerText = `${currentCardsPlayed}`;
                  //Need to replace the current rates with the cell rates and continue iteration so the scoreboard updates correctly
                  currentSuccessRate = cellSuccessRate;
                  currentCardsPlayed = cellCardPlayed;
                }
              }
            // }, 1000);
          }
          //If all matnot made, just reset cardsPicked, card1, and card2
          else {
            cardsPicked = 0;
            card1 = undefined;
            card2 = undefined;
          }
        })
      }
      //If cards don't match invoke a setTimeout to run after 'FOUND_MATCH_WAIT_MSECS' time
      else setTimeout(() => {
        //Invoke unFlipCard, no need to pass in an argument
        unFlipCard();
        //Update game tracking on unsuccessful match
        gameSuccessRate.innerText = `${Math.round(matchesMade*2/guessesMade*100)}%`;
        //Reset the closed off variables
        cardsPicked = 0;
        card1 = undefined;
        card2 = undefined;
      },FOUND_MATCH_WAIT_MSECS);
    }
  }

  /** flipCard function takes in an event 'card' and will 'flip' the card */

  function flipCard(card) {
    //Flip card by assigning rotateY(180deg) to the transform property using inline styling on the parent element of the card
    card.parentElement.style.transform = 'rotateY(180deg)';
  }

  /** unFlipCard function does not need any parameters and 'unFlips' the cards picked and resets the closed off variables. */

  function unFlipCard(card) {
    //Flip card1 and card2 by assigning rotateY(360deg) to transform property on inline style of the PARENT element to card1/2
    card1.parentElement.style.transform = "rotateY(360deg)";
    card2.parentElement.style.transform = "rotateY(360deg)";
  }

  /**Create event listener to RESET button. */

  //Assign variables to selected elements within the DOM to be used on the RESET event listener
  const reset = document.querySelector("#reset");
  //Add event listener on click
  reset.addEventListener("click", function(event) {
    //Reset all the global tracking variables
    matchesMade = 0;
    guessesMade = 0;
    cardsMade = undefined;
    cardsPicked = 0;
    card1 = undefined;
    card2 = undefined;
    //Reset game stats
    gameGuessesMade.innerText = `${guessesMade}`;
    gameMatchesMade.innerText = `${matchesMade}`;
    gameSuccessRate.innerText = "";
    //Define cards as all HTML elements with the 'card' class
    const cards = document.querySelectorAll(".card");
    console.log(cards);
    //Iterate through cards using for of loop
    for(let card of cards) {
      //Remove the card element from the DOM
      card.remove();
    }
    //Remove the hidden class from the startScreen
    startScreen.classList.remove("startScreen--hidden");
  })
}