//------------------------------\\
//---\\ BOII | DEVELOPMENT //---\\
//------------------------------\\

// Event listener to start games
window.addEventListener('message', function (event) {
    let data = event.data
    if (data.action === 'start_minigame') {
        start_minigame(data.game, data.data)
    }
})

// Function to start minigames
function start_minigame(game_type, data) {
    switch (game_type) {
        case 'chip_hack':
            let chip_hack_minigame = new ChipHack();
            chip_hack_minigame.init(data);
            break;
        case 'anagram':
            let anagram_minigame = new Anagram();
            anagram_minigame.init(data);
            break;
        case 'pincode':
            let pincode_minigame = new Pincode();
            pincode_minigame.init(data);
            break;
        case 'safe_crack':
            let safe_crack_minigame = new SafeCrack();
            safe_crack_minigame.init(data);
            break;
        case 'key_drop':
            let key_drop_minigame = new KeyDrop();
            key_drop_minigame.init(data);
            break;
        case 'button_mash':
            let button_mash_minigame = new ButtonMash();
            button_mash_minigame.init(data);
            break;
        case 'skill_bar':
            let skill_bar_minigame = new SkillBar();
            skill_bar_minigame.init(data);
            break;
        case 'wire_cut':
            let wire_cut_minigame = new WireCut();
            wire_cut_minigame.init(data);   
            break;  
        case 'hangman':
            let hangman_minigame = new HangMan();
            hangman_minigame.init(data);   
            break;    
        case 'skill_circle':
            let skill_circle_minigame = new SkillCircle();
            skill_circle_minigame.init(data);   
            break;         
        default: break;
    }
}