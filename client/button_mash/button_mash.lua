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
        game = 'button_mash',
        data = {
            style = game_data.style,
            difficulty = game_data.difficulty
        }
    })
end
--[[
    NUI
]]

-- Nui callback to end game
RegisterNUICallback('button_mash_end', function(data)
    SetNuiFocus(false, false)
    active = false
    callback(data.success)
end)

--[[
    EXPORT
]]

exports('button_mash', start_game)

--[[
    TEST
]]

if config.use_test_commands then
    RegisterCommand('test_button_mash', function()
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
    end)
end