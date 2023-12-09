# BOII | DEVELOPMENT - UTILITY: MINIGAMES *(W.I.P)*

🕹️ **Ultimate Minigame Collection: Master Them All!** 🕹️

Welcome to our exciting collection of minigames designed to test your wits, reflexes, and problem-solving skills! 
From anagrams to safe-cracking, each minigame offers a unique challenge. 
Join us as we explore each game and push your abilities to the limit!

🧩 **Minigames:** 🧩

- **Anagram:** Unscramble letters to form words in a race against the clock!
- **Button Mash:** Tap furiously to achieve success.
- **Chip Hack:** Use a guiding light to uncover hidden chips in the dark.
- **Hangman:** Guess the word before your chances run out.
- **Key Drop:** Match falling keys with precise timing to win.
- **Pin Code:** Deduce the correct pin with logic and intuition.
- **Safe Crack:** Feel the tension as you rotate the dial to unlock secrets.
- **Skill Bar:** A test of timing and precision within a moving zone.
- **Skill Circle:** A circular twist on the skill bar with a focus on accuracy.
- **Wire Cut:** Make the right choice to cut wires under pressure.

### Dependencies

None script is entirely standalone

### Install

1) **Script Customisation**

    - All minigames come with their own templates you can find these at the top of the javascript files. For example to edit the anagram game you go here; `html/scripts/anagram/anagram.js`

    - Remember to disable `config.test_commands` inside `client/config.lua` once you are happy with the games.

2) **Script Installation**

    - Import `boii_minigames` into your server resources this should be placed before any resource you will be using the games inside.

3) **Restart Server/Script**

   - Having followed the above steps, restart your server, and voilà! Your Job Center utility should be up and running.
   - Or you can simply open f8 and type `refresh; ensure boii_minigames` and the script should start running.

### Game Exports

- Anagram

```lua
exports['boii_minigames']:anagram({
    style = 'default', -- Style template
    loading_time = 5000, -- Total time to complete loading sequence in (ms)
    difficulty = 10, -- Game difficulty refer to `const word_lists` in `html/scripts/anagram/anagram.js`
    guesses = 5, -- Amount of guesses until fail
    timer = 30000 -- Time allowed for guessing in (ms)
}, function(success) -- Game callback
    if success then
        -- If success do something
        print('anagram success')
    else
        -- If fail do something
        print('anagram fail')
    end
end)
```

- Button Mash

```lua
exports['boii_minigames']:button_mash({
    style = 'default', -- Style template
    difficulty = 10 -- Difficulty; increasing the difficulty decreases the amount the notch increments on each keypress making the game harder to complete
}, function(success) -- Game callback
    if success then
        -- If success do something
        print('button_mash success')
    else
        -- If fail do something
        print('button_mash fail')
    end
end)
```

- Chip Hack

```lua
exports['boii_minigames']:chip_hack({
    style = 'default', -- Style template
    loading_time = 8000, -- Total time to complete loading sequence in (ms)
    chips = 2, -- Amount of chips required to find
    timer = 20000 -- Total allowed game time in (ms)
}, function(success)
    if success then
        -- If success do something
        print('chip_hack success')
    else
        -- If fail do something
        print('chip_hack fail')
    end
end)
```

- Hangman

```lua
exports['boii_minigames']:hangman({
    style = 'default', -- Style template
    loading_time = 5000, -- Total time to complete loading sequence in (ms)
    difficulty = 4, -- Game difficulty refer to `const hangman_word_lists` in `html/scripts/hangman/hangman.js`
    guesses = 5, -- Amount of guesses until fail
    timer = 30000 -- Time allowed for guessing in (ms)
}, function(success) -- Game callback
    if success then
        -- If success do something
        print('hangman success')
    else
        -- If fail do something
        print('hangman fail')
    end
end)
```

- Key Drop

```lua
exports['boii_minigames']:key_drop({
    style = 'default', -- Style template
    score_limit = 5, -- Amount of keys needed for success
    miss_limit = 5, -- Amount of keys allowed to miss before fail
    fall_delay = 1000, -- Time taken for keys to fall from top to bottom in (ms)
    new_letter_delay = 2000 -- Time taken to drop a new key in (ms)
}, function(success) -- Game callback
    if success then
        -- If success do something
        print('key_drop success')
    else
        -- If fail do something
        print('key_drop fail')
    end
end)
```

- Pin Code

```lua
exports['boii_minigames']:pincode({
    style = 'default', -- Style template
    difficulty = 4, -- Difficuly; increasing the value increases the amount of numbers in the pincode; level 1 = 4 number, level 2 = 5 numbers and so on // The ui will comfortably fit 10 numbers (level 6) this should be more than enough
    guesses = 5 -- Amount of guesses allowed before fail
}, function(success) -- Game callback
    if success then
        -- If success do something
        print('pincode success')
    else
        -- If fail do something
        print('pincode fail')
    end
end)
```

- Safe Crack

```lua
exports['boii_minigames']:safe_crack({
    style = 'default', -- Style template
    difficulty = 5 -- Difficuly; This increases the amount of lock a player needs to unlock this scuffs out a little above 6 locks I would suggest to use levels 1 - 5 only.
}, function(success)
    if success then
        print('safe_crack success')
    else
        print('safe_crack fail')
    end
end)
```

- Skill Bar

```lua
 exports['boii_minigames']:skill_bar({
    style = 'default', -- Style template
    icon = 'fa-solid fa-paw', -- Any font-awesome icon; will use template icon if none is provided
    orientation = 2, -- Orientation of the bar; 1 = horizontal centre, 2 = vertical right.
    area_size = 20, -- Size of the target area in %
    perfect_area_size = 5, -- Size of the perfect area in %
    speed = 0.5, -- Speed the target area moves
    moving_icon = true, -- Toggle icon movement; true = icon will move randomly, false = icon will stay in a static position
    icon_speed = 3, -- Speed to move the icon if icon movement enabled; this value is / 100 in the javascript side true value is 0.03
}, function(success) -- Game callback
    if success == 'perfect' then
        -- If perfect do something
        print('skill_bar perfect')
    elseif success == 'success' then
        -- If success do something
        print('skill_bar success')
    elseif success == 'failed' then
        -- If failed do something
        print('skill_bar fail')
    end
end)
```

- Skill Circle

```lua
exports['boii_minigames']:skill_circle({
    style = 'default', -- Style template
    icon = 'fa-solid fa-paw', -- Any font-awesome icon; will use template icon if none is provided
    area_size = 4, -- Size of the target area in Math.PI / "value"
    speed = 0.02, -- Speed the target area moves
}, function(success) -- Game callback
    if success == 'perfect' then
        -- If perfect do something
        print('skill_circle perfect')
    elseif success == 'success' then
        -- If success do something
        print('skill_circle success')
    elseif success == 'failed' then
        -- If failed do something
        print('skill_circle fail')
    end
end)
```

- Wire Cut

```lua
exports['boii_minigames']:wire_cut({
    style = 'default', -- Style template
    timer = 60000 -- Time allowed to complete game in (ms)
}, function(success)
    if success then
        print('wire_cut success')
    else
        print('wire_cut fail')
    end
end)
```

### Preview
https://www.youtube.com/watch?v=LgTMKqg4d8w

### Support
https://discord.gg/boiidevelopment
