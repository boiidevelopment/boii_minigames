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
        game = 'skill_bar',
        data = {
            style = game_data.style,
            icon = game_data.icon,
            orientation = game_data.orientation,
            area_size = game_data.area_size,
            perfect_area_size = game_data.perfect_area_size,
            speed = game_data.speed,
            moving_icon = game_data.moving_icon,
            icon_speed = game_data.icon_speed,
        }
    })
end
--[[
    NUI
]]

-- Nui callback to end game
RegisterNUICallback('skill_bar_end', function(data)
    SetNuiFocus(false, false)
    active = false
    callback(data.success)
end)

--[[
    EXPORT
]]

exports('skill_bar', start_game)

--[[
    TEST
]]

if config.use_test_commands then
    RegisterCommand('test_skill_bar', function()
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
    end)
end