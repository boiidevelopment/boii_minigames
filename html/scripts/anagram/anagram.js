//------------------------------\\
//---\\ BOII | DEVELOPMENT //---\\
//------------------------------\\

// Game styles
const anagram_styles = {
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
                font: 'VT323' // Font family
            },
            game_header: { // Header text
                colour: 'rgba(255, 255, 255, 0.8)', // Colour
                low_time_colour: 'rgba(153, 0, 0, 1)', // Colour when running out of time
                size: '1.5rem', // Font size
                font: 'VT323' // Font family
            },
            guesses: { // Previous guesses text
                correct: 'rgba(56, 118, 29, 1)', // Colour for correct answers
                incorrect: 'rgba(153, 0, 0, 1)', // Colour for incorrect answers
                size: '1.2rem', // Font size
                font: 'VT323' // Font family
            },
            input: { // Input field text
                colour: 'rgba(31, 30, 30, 1)', // Colour of input text
                size: '1.2rem', // Font size
                font: 'VT323' // Font family
            },
            password: { // Password text
                colour: 'rgba(255, 0, 0, 1', // Colour of the shuffled word
                size: '1.3rem', // Font size
                font: 'VT323' // Font family
            },
            result: { // Result screen text
                success: 'rgba(255, 255, 255, 0.8)', // Colour for success
                failed: 'rgba(255, 255, 255, 0.8)', // Colour for failed
                size: '5rem', // Font size
                font: 'VT323' // Font family
            }
        },
        loading_icons: { // Loading sequence icons
            icon_1: {
                icon: 'fa-solid fa-lock', // Icon
                loading_colour: 'rgba(255, 255, 255, 0.5)', // Colour whilst loading
                finished_colour: 'rgba(255, 255, 255, 0.8)', // Colour once loaded
                size: '5rem' // Font size
            },
            icon_2: {
                icon: 'fa-solid fa-unlock', // Icon
                loading_colour: 'rgba(255, 255, 255, 0.5)', // Colour whilst loading
                finished_colour: 'rgba(255, 255, 255, 0.8)', // Colour once loaded
                size: '5rem' // Font size
            },
            icon_3: {
                icon: 'fa-solid fa-lock-open', // Icon
                loading_colour: 'rgba(255, 255, 255, 0.5)', // Colour whilst loading
                finished_colour: 'rgba(255, 255, 255, 0.8)', // Colour once loaded
                size: '5rem' // Font size
            }
        },
    }
    // You can add more style templates here..
}

// Word lists
const anagram_word_lists = {
    level_1: ['wolf', 'lime', 'book', 'dark', 'zone'],
    level_2: ['crisp', 'flame', 'whale', 'skirt', 'brick'], 
    level_3: ['timber', 'silver', 'public', 'guitar', 'travel'],
    level_4: ['fantasy', 'diamond', 'captain', 'gallery', 'freedom'],
    level_5: ['terminal', 'treasure', 'doctrine', 'sculpture', 'evidence'],
    level_6: ['navigator', 'challenge', 'strategic', 'celebrity', 'innovator'],
    level_7: ['astrophysics', 'philanthropy', 'cryptocurrency', 'microprocessor', 'photosynthesis'],
    level_8: ['misinterpretation', 'oversimplification', 'uncharacteristically', 'disproportionately', 'incomprehensibility'],
    level_9: ['constitutionalism', 'interdisciplinary', 'misappropriation', 'psychotherapeutic', 'neurotransmitter'],
    level_10: ['interconnectivity', 'counterintelligence', 'uncompromisingly', 'indistinguishable', 'intercontinental']
}

// Game class
class Anagram {
    constructor() {
        this.style = anagram_styles['default'];
        this.loading_screen = $('#anagram_loading');
        this.loading_time = null;
        this.difficulty = null;
        this.guesses = null;
        this.time_remaining = null;
    }

    // Function to init game
    init(data) {
        this.style = anagram_styles[data.style];
        this.loading_time = data.loading_time || 10000;
        this.difficulty = data.difficulty || 1;
        this.guesses = data.guesses || 6;
        this.time_remaining = data.timer || 30000;
        $(document).ready(() => {
            $(document).keyup((e) => this.handle_exit(e));
        });
        this.build_ui();
    }

    // Function to handle exist on escape press
    handle_exit(e) {
        if (e.key === "Escape") {
            this.game_end(false);
        }
    }

    // Function to build the main ui 
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
                    <div class="anagram_loading">
                        <div class="anagram_loading_icons">
                            <span class="anagram_loading_icon_1"><i class="${this.style.loading_icons.icon_1.icon}" style="color: ${this.style.loading_icons.icon_1.loading_colour}; font-size: ${this.style.loading_icons.icon_1.size};"></i></span>
                            <span class="anagram_loading_icon_2"><i class="${this.style.loading_icons.icon_2.icon}" style="color: ${this.style.loading_icons.icon_2.loading_colour}; font-size: ${this.style.loading_icons.icon_2.size};"></i></span>
                            <span class="anagram_loading_icon_3"><i class="${this.style.loading_icons.icon_3.icon}" style="color: ${this.style.loading_icons.icon_3.loading_colour}; font-size: ${this.style.loading_icons.icon_3.size};"></i></span>
                        </div>
                        <div class="anagram_loading_text" style="color: ${this.style.text.loading_messages.loading_colour}; font-size: ${this.style.text.loading_messages.size}; font-family: ${this.style.text.loading_messages.font};"></div>
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

    // Function to handle the loading sequence of icons/text
    start_loading_sequence() {
        this.flash_icon('.anagram_loading_icon_1', 'Initializing pwcrack.exe...');
        setTimeout(() => {
            this.play_sound('downloaded');
            this.complete_icon('.anagram_loading_icon_1');
            this.flash_icon('.anagram_loading_icon_2', 'Encrypting TCP/IP ports...');
        }, this.loading_time / 4);
        setTimeout(() => {
            this.play_sound('uploaded');
            this.complete_icon('.anagram_loading_icon_2');
            this.flash_icon('.anagram_loading_icon_3', 'Bypassing firewall...');
        }, this.loading_time / 2);
        setTimeout(() => {
            this.play_sound('accessed');
            this.complete_icon('.anagram_loading_icon_3');
            this.end_loading_sequence('System breached successfuly!');
        }, this.loading_time);
    }
    
    // Function to flash icon whilst loading
    flash_icon(icon_class, text) {
        $('.anagram_loading_icons span').removeClass('flashing');
        $(icon_class).addClass('flashing');
        $('.anagram_loading_text').text(text);
    }

    // Function to change icon when finished loading
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
        $(icon_class).addClass('line_complete');
    }

    // Function to end loading sequence
    end_loading_sequence(text) {
        $('.anagram_loading_text').css('color', this.style.text.loading_messages.finished_colour).text(text);
        setTimeout(() => {
            $('.anagram_loading_icons').fadeOut(500);
        }, 1000);
        setTimeout(() => {
            $('.anagram_loading').fadeOut(500);
            this.build_game_area();
        }, 2000)
    }

    // Function to build game area
    build_game_area() {
        this.select_word();
        this.shuffled_word = this.shuffle_word(this.original_word);
        const content = `
            <div class="anagram_window">
                <div class="anagram_window_toolbar">
                    <span class="anagram_guesses_left" style="color: ${this.style.text.game_header.colour}; font-size: ${this.style.text.game_header.size}; font-family: ${this.style.text.game_header.font};">Guesses Remaining: ${this.guesses}</span>
                    <span class="anagram_game_timer" style="color: ${this.style.text.game_header.colour}; font-size: ${this.style.text.game_header.size}; font-family: ${this.style.text.game_header.font};">Time Remaining: ${Math.floor(this.time_remaining / 1000)} seconds</span>
                </div>
                <div class="anagram_window_body">
                    <div class="anagram_previous_guesses"></div>
                </div>
                <div class="anagram_window_footer">
                    <div class="anagram_footer_left">
                        <input type="text" class="anagram_guess_input" style="color: ${this.style.text.input.colour}; font-size: ${this.style.text.input.size}; font-family: ${this.style.text.input.font};" placeholder="Enter password.." />
                        <button class="anagram_submit_button">Submit</button>
                    </div>
                    <div class="anagram_footer_right">
                        <div class="anagram_password">Password: <span class="anagram_word" style="color: ${this.style.text.password.colour}; font-size: ${this.style.text.password.size}; font-family: ${this.style.text.password.font};">${this.shuffled_word}</span></div>
                    </div>    
                </div>
            </div>
        `;
        $('.tablet_screen').html(content);
        $('.anagram_submit_button').click(() => this.submit_guess());
        this.start_timer();
    }

    // Function to select a word list based on difficulty
    select_word() {
        let word_list;
        switch (this.difficulty) {
            case 1: word_list = anagram_word_lists.level_1; break;
            case 2: word_list = anagram_word_lists.level_2; break;
            case 3: word_list = anagram_word_lists.level_3; break;
            case 4: word_list = anagram_word_lists.level_4; break;
            case 5: word_list = anagram_word_lists.level_5; break;
            case 6: word_list = anagram_word_lists.level_6; break;
            case 7: word_list = anagram_word_lists.level_7; break;
            case 8: word_list = anagram_word_lists.level_8; break;
            case 9: word_list = anagram_word_lists.level_9; break;
            case 10: word_list = anagram_word_lists.level_10; break;
            default: word_list = anagram_word_lists.level_1;
        }
        this.original_word = word_list[Math.floor(Math.random() * word_list.length)];
    }

    // Function to shuffle the chosen word
    shuffle_word(word) {
        let shuffled = word.split('');
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.join('');
    }

    // Function to submit and validate a guess
    submit_guess() {
        let guess = $('.anagram_guess_input').val();
        if (!guess || guess.toLowerCase() !== this.original_word) {
            this.guesses--;
            $('.anagram_previous_guesses').append(`<div style="color: ${this.style.text.guesses.incorrect}; font-size: ${this.style.text.guesses.size}; font-family: ${this.style.text.guesses.font};">Incorrect: ${guess}</div>`);
            $('.anagram_guesses_left').text(`Guesses Left: ${this.guesses}`);
            if (this.guesses <= 0) {
                this.game_end(false);
            }
        } else {
            $('.anagram_previous_guesses').append(`<div style="color: ${this.style.text.guesses.correct}; font-size: ${this.style.text.guesses.size}; font-family: ${this.style.text.guesses.font};">Correct: ${guess}</div>`);
            $('.anagram_guesses_left').text(`Guesses Left: ${this.guesses}`);
            setTimeout(() => {
                this.game_end(true);
            }, 1000);
        }
        $('.anagram_guess_input').val('');
    }

    // Function to start count down timer
    start_timer() {
        this.timer_interval = setInterval(() => {
            this.time_remaining -= 1000;
            let seconds = Math.floor(this.time_remaining / 1000);
            let timer_text = $('.anagram_game_timer');
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

    // Function to handle game ending
    game_end(success) {
        clearInterval(this.timer_interval);
        clearInterval(this.half_second_interval);
        let result_text = success ? 'success' : 'failed';
        let result_colour = success ? this.style.text.result.success : this.style.text.result.failed;
        let result_audio = success ? 'success' : 'failed';
        const content = `
            <div class="anagram_result_screen" style="color: ${result_colour}; font-size: ${this.style.text.result.size}; font-family: ${this.style.text.result.font};">
                ${result_text}
            </div>
        `;
        setTimeout(() => {
            $('.tablet_screen').html(content);
            this.play_sound(result_audio);
        }, 1000);
        setTimeout(() => {
            $('#main_container').empty();
            $.post(`https://${GetParentResourceName()}/anagram_end`, JSON.stringify({ 'success': success }));
        }, 3000);
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
    difficulty: 10, // Game difficulty refer to const anagram_word_lists
    guesses: 5, // Amount of guesses until fail
    timer: 30000 // Time allowed for guessing in (ms)
}
start_minigame('anagram', game_test_data)
*/