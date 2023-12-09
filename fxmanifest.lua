----------------------------------
--<!>-- BOII | DEVELOPMENT --<!>--
----------------------------------

fx_version 'cerulean'

game 'gta5'

author 'boiidevelopment'

description 'BOII | Development - Utility: Minigames *(W.I.P)*'

version '0.0.1'

lua54 'yes'

ui_page 'html/index.html'

files {
    'html/**/*',
}
client_scripts {
    'client/config.lua',
    'client/main.lua',
    'client/**/*',
}
server_scripts {
    'server/*'
}
escrow_ignore {
    'client/**/*',
    'server/*'
}