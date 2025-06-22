/* So the first thing to do is randomly throw two dice and then compare them */
var player1_dice = Math.floor(Math.random() * 6) + 1;
var player2_dice = Math.floor(Math.random() * 6) + 1;

var title = '';
if (player1_dice > player2_dice) {
    // Now we have to display player 1 wins
    title = '🏆 Player 1 Wins!';
} else if (player1_dice < player2_dice) {
    // Now we have to display player 2 wins
    title = 'Player 2 Wins! 🏆';
} else {
    // Now we have to display draw
    title = "🏆 It's a Draw! 🏆";
}

// Now we need to change the images according to what the players got
var p1Dice = document.querySelector('.img1');
var p2Dice = document.querySelector('.img2');

p1Dice.setAttribute('src', './images/dice' + player1_dice + '.png');
p2Dice.setAttribute('src', './images/dice' + player2_dice + '.png');

// Now change the heading
document.getElementsByTagName('h1')[0].textContent = title;
