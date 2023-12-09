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
        game = 'key_drop',
        data = {
            style = game_data.style,
            score_limit = game_data.score_limit,
            miss_limit = game_data.miss_limit,
            fall_delay = game_data.fall_delay,
            new_letter_delay = game_data.new_letter_delay
        }
    })
end
--[[
    NUI
]]

-- Nui callback to end game
RegisterNUICallback('key_drop_end', function(data)
    SetNuiFocus(false, false)
    active = false
    callback(data.success)
end)

--[[
    EXPORT
]]

exports('key_drop', start_game)

--[[
    TEST
]]

if config.use_test_commands then
    RegisterCommand('test_key_drop', function()
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
    end)
end