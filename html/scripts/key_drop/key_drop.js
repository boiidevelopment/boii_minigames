//------------------------------\\
//---\\ BOII | DEVELOPMENT //---\\
//------------------------------\\

// Game styles
const key_drop_styles = {
    ['default']: {
        audio: {
            hit: 'assets/audio/beep.ogg', // Sound played when key is hit in time
            miss: 'assets/audio/slick.ogg', // Sound played when key is missed
            success: 'assets/audio/succeeded.ogg', // Sound played when the game is won
            failed: 'assets/audio/system_fault.ogg', // Sound played when the game is lost
            volume: 0.2, // Volume to play sounds
        },
    }
}

// Game class
class KeyDrop {
    constructor() {
        this.style = key_drop_styles['default'];
        this.score_limit = null;
        this.miss_limit = null;
        this.fall_delay = null;
        this.new_letter_delay = null;
        this.score = 0;
        this.misses = 0;
    }

    // Function to init game
    init(data) {
        this.style = key_drop_styles[data.style];
        this.score_limit = data.score_limit;
        this.miss_limit = data.miss_limit;
        this.fall_delay = data.fall_delay;
        this.new_letter_delay = data.new_letter_delay;
        this.build_ui();
        this.start_game();
    }

    // Function to build main ui
    build_ui() {
        const content = `
            <div class="key_drop_container"></div>
        `;
        $('#main_container').html(content);
    }

    // Function to start game
    start_game() {
        $('.key_drop_letter').remove();
        let $game_container = $('<div>', { class: 'key_drop_game' });
        $('.key_drop_container').append($game_container);
        this.drop_letter();
        this.build_key_presses();
    }

    // Function to handle dropping letters
    drop_letter() {
        var letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var position = Math.floor(Math.random() * ($('.key_drop_game').width() - 10));
        var $letter = $('<div>', { class: 'key_drop_letter', text: letter }).css({ top: '-80px', left: position + 'px' });
        $('.key_drop_game').append($letter);
        $letter.animate({ top: '60vh' }, this.fall_delay, () => {
            if (!$letter.hasClass('key_drop_hit')) {
                $letter.addClass('key_drop_miss');
                this.play_sound(this.style.audio.miss);
                this.misses++;
                if (this.misses >= this.miss_limit && !this.interval_cleared) {
                    clearTimeout(this.timeout_id);
                    setTimeout(() => this.game_end(false), this.new_letter_delay);
                    this.interval_cleared = true;
                }
            }
        });
        if (!this.interval_cleared) {
            this.timeout_id = setTimeout(() => this.drop_letter(), this.new_letter_delay);
        }
    }

    // Function to build key presses
    build_key_presses() {
        $(document).off('keyup').on('keyup', (event) => {
            var key = String.fromCharCode(event.keyCode);
            var $letter = $('.key_drop_letter').filter(function() {
                return $(this).text() === key;
            }).first();
            if ($letter.length) {
                $letter.addClass('key_drop_hit').stop();
                this.play_sound(this.style.audio.hit);
                this.score++;
                if (this.score === this.score_limit && !this.interval_cleared) {
                    clearTimeout(this.timeout_id);
                    setTimeout(() => this.game_end(true), this.new_letter_delay);
                    this.interval_cleared = true;
                }
            }
        });
    }

    // Function to handle game end
    game_end(success) {
        clearTimeout(this.timeout_id);
        $('.key_drop_letter').remove();
        $('.key_drop_container').empty();
        this.play_sound(success ? this.style.audio.success : this.style.audio.failed);
        $.post(`https://${GetParentResourceName()}/key_drop_end`, JSON.stringify({ 'success': success }));
    }

    // Funtion to play sounds
    play_sound(sound_path) {
        let sound = new Audio(sound_path);
        sound.volume = this.style.audio.volume;
        sound.play();
    }

}

/*
// Uncomment this test data if you want to preview the UI live in a web browser
let game_test_data = {
    style: 'default', // Style template
    score_limit: 3, // Amount of keys needed for success
    miss_limit: 3, // Amount of keys allowed to miss before fail
    fall_delay: 1000, // Time taken for keys to fall from top to bottom in (ms)
    new_letter_delay: 2000 // Time taken to drop a new key in (ms)
}
start_minigame('key_drop', game_test_data)
*/