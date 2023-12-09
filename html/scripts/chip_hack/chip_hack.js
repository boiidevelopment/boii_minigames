//------------------------------\\
//---\\ BOII | DEVELOPMENT //---\\
//------------------------------\\

const chip_hack_styles = {
    ['default']: {
        audio: { // Audio sounds are optional simply replace the sound with undefined and no sound will play. e.g. downloaded: undefined,
            downloaded: 'assets/audio/reinforced.ogg', // Sound played when loading icon 1 is complete
            uploaded: 'assets/audio/reinforced.ogg', // Sound played when loading icon 2 is complete
            accessed: 'assets/audio/reinforced.ogg', // Sound played when loading icon 3 is complete
            clicked_chip: 'assets/audio/slick.ogg', // Sound played when clicking a chip
            low_time: 'assets/audio/beep.ogg', // Sound played when running out of time
            success: 'assets/audio/succeeded.ogg', // Sound played when success
            failed: 'assets/audio/system_fault.ogg', // Sound played when failed
            volume: 0.2 // Volume to play sounds 
        },
        text: { 
            loading_messages: { // Loading sequence text
                loading_colour: 'rgba(255, 255, 255, 0.5)', // Colour whilst loading
                finished_colour: 'rgba(255, 255, 255, 0.8)', // Colour once loaded
                size: '2rem', // Font size
                font: 'Orbitron' // Font family
            }, 
            game_header: { // Header text
                colour: 'rgba(255, 255, 255, 0.8)', // Colour
                low_time_colour: 'rgba(153, 0, 0, 1)', // Colour when running out of time
                size: '1rem', // Font size
                font: 'Orbitron' // Font family
            },
            result: { // Result screen text
                success: 'rgba(255, 255, 255, 0.8)', // Colour for success
                failed: 'rgba(255, 255, 255, 0.8)', // Colour for failed
                size: '5rem', // Font size
                font: 'Orbitron' // Font family
            }
        },
        loading_icons: { // Loading sequence icons
            icon_1: {
                icon: 'fa-solid fa-virus', // Icon
                loading_colour: 'rgba(255, 255, 255, 0.5)', // Colour whilst loading
                finished_colour: 'rgba(255, 255, 255, 0.8)', // Colour once loaded
                size: '5rem' // Font size
            },
            icon_2: {
                icon: 'fa-solid fa-server', // Icon
                loading_colour: 'rgba(255, 255, 255, 0.5)', // Colour whilst loading
                finished_colour: 'rgba(255, 255, 255, 0.8)', // Colour once loaded
                size: '5rem' // Font size
            },
            icon_3: {
                icon: 'fa-solid fa-microchip', // Icon
                loading_colour: 'rgba(255, 255, 255, 0.5)', // Colour whilst loading
                finished_colour: 'rgba(255, 255, 255, 0.8)', // Colour once loaded
                size: '5rem' // Font size
            }
        },
        chip: { // Icon players need to find
            icon: 'fa-solid fa-microchip', // Icon
            colour: 'rgba(77, 203, 194, 1)', // Colour
            size: '2rem' // Font size
        }
    }
    // You can add more style templates here..
}

class ChipHack {
    constructor() {
        this.style = chip_hack_styles['default'];
        this.loading_screen = $('#chip_hack_loading');
        this.loading_time = null;
        this.chips_found = 0;
        this.chips_needed = null;
        this.time_remaining = null;
    }

    // Function to init game
    init(data) {
        console.log("Initializing game with data: ", JSON.stringify(data, null, 4));
        this.style = chip_hack_styles[data.style];
        this.loading_time = data.loading_time || 10000;
        this.chips_needed = data.chips || 6;
        this.time_remaining = data.timer || 60000;
        $(document).ready(() => {
            $(document).keyup((e) => this.handle_exit(e));
        });
        this.build_ui();
    }

    // Function to handle exit on escape or backspace
    handle_exit(e) {
        if (e.key === "Escape" || e.key === "Backspace") {
            this.game_end(false);
        }
    }

    // Function to build main ui
    build_ui() {
        let audio_elements = '';
        for (let key in this.style.audio) {
            if (key !== 'volume' && this.style.audio[key]) {
                audio_elements += `<audio id="${key}_sound" src="${this.style.audio[key]}" preload="auto"></audio>`;
            }
        }
        const content = `
            <div class="tablet_container">
                <div class="volume_buttons">
                    <div class="volume_btn"></div>
                    <div class="volume_btn"></div>
                </div>
                <div class="power_btn"></div>
                <div class="front_cam"></div>
                <div class="tablet_screen">
                    <div class="chip_hack_loading">
                        <div class="chip_hack_loading_icons">
                            <span class="chip_hack_loading_icon_1"><i class="${this.style.loading_icons.icon_1.icon}" style="color: ${this.style.loading_icons.icon_1.loading_colour}; font-size: ${this.style.loading_icons.icon_1.size};"></i></span>
                            <span class="chip_hack_loading_icon_2"><i class="${this.style.loading_icons.icon_2.icon}" style="color: ${this.style.loading_icons.icon_2.loading_colour}; font-size: ${this.style.loading_icons.icon_2.size};"></i></span>
                            <span class="chip_hack_loading_icon_3"><i class="${this.style.loading_icons.icon_3.icon}" style="color: ${this.style.loading_icons.icon_3.loading_colour}; font-size: ${this.style.loading_icons.icon_3.size};"></i></span>
                        </div>
                        <div class="tab_loading_text_1" style="color: ${this.style.text.loading_messages.loading_colour}; font-size: ${this.style.text.loading_messages.size}; font-family: ${this.style.text.loading_messages.font};"></div>
                    </div>
                </div>
            </div>
            ${audio_elements}
        `;
        $('#main_container').html(content);
        for (let key in this.style.audio) {
            if (key !== 'volume' && this.style.audio[key]) {
                $(`#${key}_sound`)[0].volume = this.style.audio.volume;
            }
        }
        this.start_loading_sequence();
    }

    // Function to start loading sequence
    start_loading_sequence() {
        this.flash_icon('.chip_hack_loading_icon_1', 'Downloading virus...');
        setTimeout(() => {
            this.play_sound('downloaded');
            this.complete_icon('.chip_hack_loading_icon_1');
            this.flash_icon('.chip_hack_loading_icon_2', 'Uploading virus...');
        }, this.loading_time/4);
        setTimeout(() => {
            this.play_sound('uploaded');
            this.complete_icon('.chip_hack_loading_icon_2');
            this.flash_icon('.chip_hack_loading_icon_3', 'Accessing hardware...');
        }, this.loading_time/2);
        setTimeout(() => {
            this.play_sound('accessed');
            this.complete_icon('.chip_hack_loading_icon_3');
            this.end_loading_sequence('Connection successful!');
        }, this.loading_time);
    }

    // Function to flash icons whilst loading
    flash_icon(icon_class, text) {
        $('.chip_hack_loading_icons span').removeClass('flashing');
        $(icon_class).addClass('flashing');
        $('.tab_loading_text_1').text(text);
    }

    // Function to set icons complete after loading
    complete_icon(icon_class) {
        const icon_number = icon_class.split('_').pop();
        let finished_color;
        if (icon_number === "1") {
            finished_color = this.style.loading_icons.icon_1.finished_colour;
        } else if (icon_number === "2") {
            finished_color = this.style.loading_icons.icon_2.finished_colour;
        } else if (icon_number === "3") {
            finished_color = this.style.loading_icons.icon_3.finished_colour;
        }
        $(icon_class + ' i').css('color', finished_color);
    }

    // Function to end loading sequence
    end_loading_sequence(text) {
        $('.tab_loading_text_1').css('color', this.style.text.loading_messages.finished_colour).text(text);
        setTimeout(() => {
            $('.chip_hack_loading_icons').fadeOut(500);
        }, 1000);
        setTimeout(() => {
            $('.chip_hack_loading').fadeOut(500);
            this.build_game_area();
        }, 2000)
    }

    // Function to build game area
    build_game_area() {
        const content = `
            <div class="chip_hack_window">
                <div class="chip_hack_window_toolbar">
                    <span class="chip_hack_game_counter" style="color: ${this.style.text.game_header.colour}; font-size: ${this.style.text.game_header.size}; font-family: ${this.style.text.game_header.font};">Chips Found: ${this.chips_found} / ${this.chips_needed}</span>
                    <span class="chip_hack_game_timer" style="color: ${this.style.text.game_header.colour}; font-size: ${this.style.text.game_header.size}; font-family: ${this.style.text.game_header.font};">Time Remaining: ${Math.floor(this.time_remaining / 1000)} seconds</span>
                </div>
                <div class="chip_hack_game_area">
                    <div class="chip_hack_light"></div>
                </div>
            </div>
        `;
        $('.tablet_screen').html(content);
        this.setup_game_events();
        this.place_chip();
        this.setup_flashlight();
        this.start_timer();
    }

    // Function to handle game timers
    start_timer() {
        this.timer_interval = setInterval(() => {
            this.time_remaining -= 1000;
            let seconds = Math.floor(this.time_remaining / 1000);
            let timer_text = $('.chip_hack_game_timer');
            timer_text.text(`Time Remaining: ${seconds} seconds`);
            if (this.time_remaining <= 10000 && this.time_remaining > 5000) {
                timer_text.css({
                    'color': this.style.text.game_header.low_time_colour,
                    'animation': 'flash 1.0s infinite'
                });
                this.play_sound('low_time');
            } else if (this.time_remaining <= 5000) {
                timer_text.css({
                    'color': this.style.text.game_header.low_time_colour,
                    'animation': 'flash 0.5s infinite'
                });
            } else {
                timer_text.css({
                    'color': this.style.text.game_header.colour,
                    'animation': 'none'
                });
            }
    
            if (this.time_remaining <= 0) {
                clearInterval(this.timer_interval);
                this.game_end(false);
            }
        }, 1000);
    
        this.half_second_interval = setInterval(() => {
            if (this.time_remaining <= 5000) {
                this.play_sound('low_time');
            }
        }, 500);
    }
    
    // Function to setup search light
    setup_flashlight() {
        const game_area = $('.chip_hack_game_area');
        const flash_light = $('.chip_hack_light');
        const shadow_radius = 50;
        game_area.mousemove((e) => {
            const game_area_offset = game_area.offset();
            let x = e.pageX - game_area_offset.left - shadow_radius;
            let y = e.pageY - game_area_offset.top - shadow_radius;
            x = Math.max(0, Math.min(x, game_area.width() - 2 * shadow_radius));
            y = Math.max(0, Math.min(y, game_area.height() - 2 * shadow_radius));
            flash_light.css({ 'left': `${x}px`, 'top': `${y}px` });
        });
    }
    
    // Function to setup game events
    setup_game_events() {
        const game_area = $('.chip_hack_game_area');
        const flash_light = $('.chip_hack_light');
        const shadow_radius = 50;
        game_area.mousemove((e) => {
            const game_area_offset = game_area.offset();
            let x = e.pageX - game_area_offset.left - shadow_radius;
            let y = e.pageY - game_area_offset.top - shadow_radius;
            x = Math.max(0, Math.min(x, game_area.width() - 2 * shadow_radius));
            y = Math.max(0, Math.min(y, game_area.height() - 2 * shadow_radius));
            flash_light.css({ 'left': `${x}px`, 'top': `${y}px` });
            $('.chip').each(function() {
                const chip_offset = $(this).offset();
                const distance = Math.sqrt(Math.pow(chip_offset.left - e.pageX, 2) + Math.pow(chip_offset.top - e.pageY, 2));
                if (distance < 50) {
                    $(this).css('opacity', 1);
                } else {
                    $(this).css('opacity', 0);
                }
            });
        });
        this.place_chip();
    }

    // Function to place a chip in game area
    place_chip() {
        $('.chip').remove();
        const game_area = $('.chip_hack_game_area');
        const chip_style = this.style.chip;
        const chip = $('<i>', {
            class: chip_style.icon,
            style: `color: ${chip_style.colour}; font-size: ${chip_style.size};`
        }).addClass('chip');
        const x = Math.random() * (game_area.width() - 50);
        const y = Math.random() * (game_area.height() - 50);
        chip.css({ 'left': `${x}px`, 'top': `${y}px` });
        game_area.append(chip);
        chip.click(() => this.handle_chip_click());
    }
    
    // Function to handle clicked chips
    handle_chip_click() {
        this.play_sound('clicked_chip');
        this.chips_found++;
        $('.chip_hack_game_counter').text(`Chips Found: ${this.chips_found} / ${this.chips_needed}`);
        this.time_remaining += 5000;
        if (this.chips_found < this.chips_needed) {
            this.place_chip();
        } else {
            this.game_end(true);
        }
    }

    // Function to handle game end
    game_end(success) {
        clearInterval(this.timer_interval);
        clearInterval(this.half_second_interval);
        let result_text = success ? 'success' : 'failed';
        let result_colour = success ? this.style.text.result.success : this.style.text.result.failed;
        let result_audio = success ? 'success' : 'failed';
        const content = `
            <div class="chip_hack_result_screen" style="color: ${result_colour}; font-size: ${this.style.text.result.size}; font-family: ${this.style.text.result.font};">
                ${result_text}
            </div>
        `;
        setTimeout(() => {
            $('.tablet_screen').html(content);
            this.play_sound(result_audio);
        }, 1000);
        setTimeout(() => {
            $('#main_container').empty();
            $.post(`https://${GetParentResourceName()}/chip_hack_end`, JSON.stringify({ 'success': success }));
        }, 2000);
    }

    // Function to play sounds
    play_sound(sound_key) {
        if (this.style.audio[sound_key]) {
            $(`#${sound_key}_sound`)[0].play();
        }
    }
}

/*
// Uncomment this test data if you want to preview the UI live in a web browser
let game_test_data = {
    style: 'default', // Style template
    loading_time: 5000, // Total time to complete loading sequence in (ms)
    chips: 3, // Amount of chips needed for success
    timer: 30000 // Time allowed for to find chips in (ms)
}
start_minigame('chip_hack', game_test_data)
*/
