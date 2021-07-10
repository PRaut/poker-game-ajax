var hand = [];
var valuesArray = [];
var suitsArray = [];

function getDecks() {
    var xhttp = new XMLHttpRequest();
    let cardDetails = '';
    let cardsValues = [];
    document.getElementById("card-data").innerHTML = cardDetails;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let cards = JSON.parse(this.responseText).cards;
            for (index = 0; index < cards.length; index++) {

                cardDetails += "<div class='card'>" +
                    "<img src='" + cards[index].image + "' id='deck_img' alt='deck'>" +
                    "<div class='container'>" +
                    "<h4>Value: <b id='value'>'" + cards[index].value + "'</b></h4>" +
                    "<p id='suit'><b>Suit: </b> '" + cards[index].suit + "'</p>" +
                    "</div> </div>";
                    cardsValues[index] = { "value" :cards[index].value, "suit" :cards[index].suit};
            };
            document.getElementById("card-data").innerHTML += cardDetails;
            checkHand(cardsValues);
        }
    };
    xhttp.open("GET", "https://deckofcardsapi.com/api/deck/new/draw/?count=5", true);
    xhttp.send();
}

function checkHand(cards){
    var resultString = "";
    for(var i = 0; i < 5; i++){
         hand[i] = cards[i].value;
    }
    convertHand(cards);
    console.log(duplicateCards())
    switch(duplicateCards()){
         case "2":
              resultString = "1 Pair";
              break;
          case "22":
              resultString = "2 Pairs";
              break;
         case "3":
              resultString = "3 of a Kind";
              break;
         case "23":
         case "32":
              resultString = "Full House";
              break;
         case "4":
              resultString = "4 of a Kind";
              break;
         case "5":
              resultString = "5 of a Kind";
              break;
         default:
              if(isStraight()){
                   resultString = "Straight";     
              }
              if(isAceStraight()){
                   resultString = "Ace Straight";
              }
              break;
    }
    if(isFlush()){
         if(resultString){
              resultString += " and Flush";     
         }
         else{
              resultString = "Flush";
         }
    }
    if(!resultString){
         resultString = "High card";
    }
    console.log(resultString);
    document.getElementById("result").innerHTML = resultString;
}  

function convertHand(cards){
    for(var i = 0; i < cards.length; i ++){
         valuesArray[i] = cards[i]['value'];
         suitsArray[i] =  cards[i]['suit'];     
    }
}

function isFlush(){
    for(var i = 0; i < 4; i ++){
         if(suitsArray[i] != suitsArray[i+1]){
              return false;
         }
    }
    return true;
}

function isStraight(){
    var lowest = getLowest();
    for(var i = 1; i < 5; i++){
         if(occurrencesOf(lowest + i) != 1){
              return false
         }     
    }
    return true;
}

function isAceStraight(){
    var lowest = 9;
    for(var i = 1; i < 4; i++){
         if(occurrencesOf(lowest + i) != 1){
              return false
         }     
    }
    return occurrencesOf(1) == 0;
}

function getLowest(){
    var min = 12;
    for(var i = 0; i < valuesArray.length; i++){
         min = Math.min(min, valuesArray[i]);     
    }
    return min;     
} 

function duplicateCards(){
    var occurrencesFound = []; 
    var result = "";
    for(var i = 0; i < valuesArray.length; i++){
         var occurrences = occurrencesOf(valuesArray[i]);
         if(occurrences > 1 && occurrencesFound.indexOf(valuesArray[i]) == -1){
              result += occurrences; 
              occurrencesFound.push(valuesArray[i]);    
         }
    }
    return result;
}

function occurrencesOf(n){
    var count = 0;
    var index = 0;   
    do{          
         index = valuesArray.indexOf(n, index) + 1;  
         if(index == 0){
              break;
         }
         else{
              count ++;
         }
    } while(index < valuesArray.length);
    return count;
}  