----------------------------------
--<!>-- BOII | DEVELOPMENT --<!>--
----------------------------------

-- Locals
local callback

--[[
    FUNCTIONS
]]

-- Function to start game
local function start_game(game_data, game_callback)
    if active then return end
    active = true
    callback = game_callback
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'start_minigame',
        game = 'anagram',
        data = {
            style = game_data.style,
            loading_time = game_data.loading_time,
            difficulty = game_data.difficulty,
            guesses = game_data.guesses,
            timer = game_data.timer
        }
    })
end
--[[
    NUI
]]

-- Nui callback to end game
RegisterNUICallback('anagram_end', function(data)
    SetNuiFocus(false, false)
    active = false
    callback(data.success)
end)

--[[
    EXPORT
]]

exports('anagram', start_game)

--[[
    TEST
]]

if config.use_test_commands then
    RegisterCommand('test_anagram', function()
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
    end)
end