//------------------------------\\
//---\\ BOII | DEVELOPMENT //---\\
//------------------------------\\

// Game styles
const pincode_styles = {
    ['default']: {
        audio: { // Audio sounds are optional simply replace the sound with undefined and no sound will play. e.g. clicked_key: undefined,
            clicked_key: 'assets/audio/beep.ogg', // Sound played when clicking a chip
            success: 'assets/audio/succeeded.ogg', // Sound played when success 
            failed: 'assets/audio/system_fault.ogg', // Sound played when failed
            volume: 0.2 // Volume to play sounds 
        },
    }
}

// Game class
class Pincode {
    constructor() {
        this.style = pincode_styles['default'];
        this.loading_screen = $('#pincode_loading');
        this.difficulty = null;
        this.guesses = null;
        this.code_length = 3 + this.difficulty;
        this.code = this.generate_code(this.code_length);
        this.guess_history = [];
    }

    // Function to init game
    init(data) {
        this.style = pincode_styles[data.style];
        this.difficulty = data.difficulty || 1;
        this.guesses = data.guesses || 6;
        this.code_length = 3 + this.difficulty;
        this.code = this.generate_code(this.code_length);
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


    // Function to generate a random pin code
    generate_code(length) {
        let code = "";
        for (let i = 0; i < length; i++) {
            code += Math.floor(Math.random() * 10).toString();
        }
        return code;
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
            <div class="pincode_container">
                <div class="pincode_display">
                    <div class="pincode_digits"></div>
                    <div class="attempts_remaining">Attempts Remaining: ${this.guesses}</div>
                </div>
                <div class="pincode_keypad">
                    ${this.gen_keypad_buttons()}
                </div>
                <div class="pincode_submit">
                    <button class="pincode_submit_button"><i class="fa-solid fa-lock"></i></button>
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
        $('.pincode_digits').text('*'.repeat(this.code_length));
        $('.keypad_button').click((e) => {
            this.handle_keypad_input($(e.target).text());
            this.play_sound('clicked_key');
        });
        $('.pincode_submit_button').click(() => {
            this.submit_pincode();
        });
    }

    // Function to generate keypad buttons
    gen_keypad_buttons() {
        const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'];
        return buttons.map(number => `<button class="keypad_button">${number}</button>`).join('');
    }

    // Function to check a guess
    check_guess(guess) {
        let correct_digits = 0;
        let correct_positions = 0;
        let code_digits = Array.from(this.code);
        let guess_digits = Array.from(guess);
        for (let i = 0; i < code_digits.length; i++) {
            if (code_digits[i] === guess_digits[i]) {
                correct_positions++;
                code_digits[i] = null;
                guess_digits[i] = null;
            }
        }
        for (let i = 0; i < guess_digits.length; i++) {
            if (guess_digits[i] !== null) {
                let index = code_digits.indexOf(guess_digits[i]);
                if (index !== -1) {
                    correct_digits++;
                    code_digits[index] = null;
                }
            }
        }
        return {correct_digits, correct_positions};
    }

    // Function to handle keypad presses
    handle_keypad_input(input) {
        if ($('.pincode_digits').html().includes('<span')) {
            $('.pincode_digits').text('*'.repeat(this.code_length));
        }
        let currentDigits = $('.pincode_digits').text();
        if (currentDigits.replace(/\*/g, '').length < this.code_length) {
            $('.pincode_digits').text(currentDigits.replace('*', input));
        }
    }

    // Function to submit guess
    submit_pincode() {
        let guess = $('.pincode_digits').text().replace(/\*/g, '');
        if (guess.length === this.code_length) {
            let result = this.check_guess(guess);
            this.color_code_digits(guess, result);
            this.guesses--;
            $('.attempts_remaining').text(`Attempts Remaining: ${this.guesses}`);
            if (result.correct_positions === this.code_length) {
                this.game_end(true);
            } else if (this.guesses === 0) {
                this.game_end(false);
            }
        }
    }

    // Function to handle colour coding of numbers
    color_code_digits(guess, result) {
        let coloured_digits = '';
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === this.code[i]) {
                coloured_digits += `<span style="color:green;">${guess[i]}</span>`;
            } else if (this.code.includes(guess[i])) {
                coloured_digits += `<span style="color:yellow;">${guess[i]}</span>`;
            } else {
                coloured_digits += `<span style="color:red;">${guess[i]}</span>`;
            }
        }
        $('.pincode_digits').html(coloured_digits);
    }

    // Function to handle game end
    game_end(success) {
        let result_text = success ? 'Access Granted' : 'Access Denied';
        let result_audio = success ? 'success' : 'failed';
        $('.pincode_digits').html(`<span style="color: ${success ? 'green' : 'red'}; font-size: 2rem; letter-spacing: 0px;">${result_text}</span>`);
        this.play_sound(result_audio);
        setTimeout(() => {
            $('#main_container').empty();
            $.post(`https://${GetParentResourceName()}/pincode_end`, JSON.stringify({ 'success': success }));
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
    difficulty: 10, // Difficuly; increasing the value increases the amount of numbers in the pincode; level 1 = 4 number, level 2 = 5 numbers and so on // The ui will comfortably fit 10 numbers (level 6) this should be more than enough
    guesses: 5 // Amount of guesses allowed before fail
}
start_minigame('pincode', game_test_data)
*/