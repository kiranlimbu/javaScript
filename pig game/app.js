/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, game_on, pre_dice, pre_dice2;

function init() {

    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    pre_dice = 0;
    pre_dice2 = 0;
    game_on = true;

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('#name-0').textContent = 'Player 1';
    document.querySelector('#name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');

}

function nextPlayer() {

    // if statement
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

    roundScore = 0;
    pre_dice = 0;
    pre_dice2 = 0;

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

};

init();

document.querySelector('.btn-roll').addEventListener('click', function () {

    if (game_on) {

        var dice = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;

        var diceDOM = document.getElementById('dice-1');
        var diceDOM2 = document.getElementById('dice-2');

        diceDOM.style.display = 'block';
        diceDOM2.style.display = 'block';

        diceDOM.src = 'dice-' + dice + '.png';
        diceDOM2.src = 'dice-' + dice2 + '.png';

        document.getElementById('current-' + activePlayer).textContent = dice;

        if (dice === 6 && pre_dice === dice) {

            scores[activePlayer] = 0;
            document.getElementById('score-' + activePlayer).textContent = '0';
            nextPlayer();
            document.getElementById('dice-1').style.display = 'block';

        } else if (dice2 === 6 && pre_dice2 === dice2) {

            scores[activePlayer] = 0;
            document.getElementById('score-' + activePlayer).textContent = '0';
            nextPlayer();
            document.getElementById('dice-2').style.display = 'block';

        } else if (dice !== 1 && dice2 != 1) {

            roundScore += (dice + dice2);
            pre_dice = dice;
            pre_dice2 = dice2;
            document.getElementById('current-' + activePlayer).textContent = roundScore;

        } else {

            document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
            nextPlayer();

            // display triggering dice
            if (dice === 1) {

                document.getElementById('dice-1').style.display = 'block';

            } else {

                document.getElementById('dice-2').style.display = 'block';

            }

        }

    }

});

document.querySelector('.btn-hold').addEventListener('click', function () {

    if (game_on) {

        var input, scoreLimit;

        input = document.querySelector('.user_entry').value;
        scores[activePlayer] += roundScore;

        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        // if statement
        input ? scoreLimit = input : scoreLimit = 100;

        if (scores[activePlayer] >= scoreLimit) {

            document.getElementById('name-' + activePlayer).textContent = 'WINNER!';
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');

            game_on = false;

        } else {

            nextPlayer();

        }

    }

});

document.querySelector('.btn-new').addEventListener('click', init);