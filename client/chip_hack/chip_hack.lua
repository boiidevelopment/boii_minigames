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
    print("Starting game with data: ", json.encode(game_data))
    SendNUIMessage({
        action = 'start_minigame',
        game = 'chip_hack',
        data = {
            style = game_data.style,
            loading_time = game_data.loading_time,
            chips = game_data.chips,
            timer = game_data.timer
        }
    })
end
--[[
    NUI
]]

-- Nui callback to end game
RegisterNUICallback('chip_hack_end', function(data)
    SetNuiFocus(false, false)
    active = false
    print(json.encode(data))
    print("Callback function: ", callback)

    callback(data.success)
end)

--[[
    EXPORT
]]

exports('chip_hack', start_game)

--[[
    TEST
]]

if config.use_test_commands then
    RegisterCommand('test_chip_hack', function()
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
    end)
end