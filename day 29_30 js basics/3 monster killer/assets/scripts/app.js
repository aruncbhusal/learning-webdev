// Here's yet another file, with pre-given html, css and a vendor.js file
// This is a game where we fight with a monster. There are functions and html items defined in vendor file which we can use here

// First let's define the damage dealt by each attack as a global constant
const ATTACK_DAMAGE = 10;
// when creating global constants, we can choose to use this uppercase format to separate from other variables/local constants
const MONSTER_ATTACK_DAMAGE = 14;
const STRONG_ATTACK_DAMAGE = 19;

// Let's create a placeholder max health value (later we will take input from user)
let maxHealth = 100;

// Now we need to assign this max health to both the monster and the player
let currentPlayerHealth = maxHealth;
let currentMonsterHealth = maxHealth;

// We want to deal damage to the monster when we press attack, for which the button is selected in the vendor.js
// We can add event listener like last module to listen for clicks
attackBtn.addEventListener('click', handleAttack);
// We have set to call handleAttack here when attackBtn is clicked, so let's create that function

function handleAttack() {
    /*
    // The naming for the function is personal preference but we should stick to consistent naming
    // When making an attack we should deal damage to the monster. For it we have another function so let's use that
    const monsterDamage = dealMonsterDamage(ATTACK_DAMAGE);
    // After the damage is dealt, we also need to reduce the health of the monster, we use the damage value returned by this function
    currentMonsterHealth -= monsterDamage;

    // But the monster should get to attack too, so let's create another constant and use the dealPlayerDamage function as well
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_DAMAGE);
    // Note: even though monster attack damage is higher, the functions for damage deal random damage between 0-14 so any can win
    currentPlayerHealth -= playerDamage;

    // Now we need a final condition, when either one loses all health, then we should declare a winner
    // If monster health is 0 or less, player has won, and vice versa
    // But there is a problem, what if both have 0 or less? Then we need to call it a draw, but if we use 'else'
    // It will get run each time the other conditions are not true, which means every time click is pressed but nobody has won yet
    // So we should use only else if here. But we should draw when both are zero, and when this condition is true, the above two are true as well
    // This means this condition will never get to run. So we need to modify the above conditions to only be true when only one is <=0
    if (currentPlayerHealth > 0 && currentMonsterHealth <= 0) {
        alert('You won!');
    } else if (currentMonsterHealth > 0 && currentPlayerHealth <= 0) {
        alert('You lost.');
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("It's a draw.");
    }
    */
    // Since we have a function to do this we can call it from here
    attackMonster('NORMAL');
}

// We also have a button to deal strong attack to the monster so let's use that to create another event listener
strongAttackBtn.addEventListener('click', handleStrongAttack);

// Now we need a handleStrongAttack function
function handleStrongAttack() {
    // Both this function and handleAttack function do the same thing, but it should use a higher value than ATTACK_DAMAGE
    // Since copying that code and using here is not good, we can create a new function for both attacks
    // We need to know which attack we need to do so we pass in a parameter for attack mode
    // It then uses theh mode to find out whether we want to make a normal or strong attack, and it deals that amount of damage
    // We can copy the code from handleAttack there, and simply call that function from both the handle functions
    attackMonster('STRONG');
}

function attackMonster(mode) {
    // To find out what kind of attack to do, we can use an if statement
    let maxDamage;
    if (mode === 'STRONG') {
        maxDamage = STRONG_ATTACK_DAMAGE;
    } else if (mode === 'NORMAL') {
        maxDamage = ATTACK_DAMAGE;
    }
    // Now we use the maxDamage variable to deal damage to the monster
    const monsterDamage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= monsterDamage;

    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_DAMAGE);
    currentPlayerHealth -= playerDamage;

    if (currentPlayerHealth > 0 && currentMonsterHealth <= 0) {
        alert('You won!');
    } else if (currentMonsterHealth > 0 && currentPlayerHealth <= 0) {
        alert('You lost.');
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("It's a draw.");
    }
}
// Since it is late today, I will pause the development here, since this folder is joint for day 28 and 29 I can continue from here
// We dealt with dealing normal or strong attacks, win condition, dealing damage, and taking repeated code into a new function.
