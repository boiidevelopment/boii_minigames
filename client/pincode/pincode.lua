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
        game = 'pincode',
        data = {
            style = game_data.style,
            difficulty = game_data.difficulty,
            guesses = game_data.guesses
        }
    })
end
--[[
    NUI
]]

-- Nui callback to end game
RegisterNUICallback('pincode_end', function(data)
    SetNuiFocus(false, false)
    active = false
    callback(data.success)
end)

--[[
    EXPORT
]]

exports('pincode', start_game)

--[[
    TEST
]]

if config.use_test_commands then
    RegisterCommand('test_pincode', function()
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
    end)
end