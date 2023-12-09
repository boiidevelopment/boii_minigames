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
        game = 'skill_circle',
        data = {
            style = game_data.style,
            area_size = game_data.area_size,
            speed = game_data.speed,
        }
    })
end
--[[
    NUI
]]

-- Nui callback to end game
RegisterNUICallback('skill_circle_end', function(data)
    SetNuiFocus(false, false)
    active = false
    callback(data.success)
end)

--[[
    EXPORT
]]

exports('skill_circle', start_game)

--[[
    TEST
]]

if config.use_test_commands then
    RegisterCommand('test_skill_circle', function()
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
    end)
end