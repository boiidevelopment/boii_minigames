//------------------------------\\
//---\\ BOII | DEVELOPMENT //---\\
//------------------------------\\

// Game styles
const skill_bar_styles = {
    ['default']: {
        icon: {
            type: 'fa-solid fa-fish' // Default icon used if none is provided
        },
        audio: { // Audio sounds are optional simply replace the sound with undefined and no sound will play. e.g. downloaded: undefined,
            success: 'assets/audio/beep.ogg', // Sound played for success
            perfect: 'assets/audio/glitchy.ogg', // Sound played when icon is in perfect area
            failed: 'assets/audio/system_fault.ogg', // Sound played when failed
            volume: 0.2 // Volume to play sounds 
        },
    }
     // You can add more style templates here..
}

// Game class
class SkillBar {
    constructor() {
        this.style = skill_bar_styles['default'];
        this.area_size = null;
        this.perfect_area_size = null;
        this.speed = null;
        this.target_area_position = 0;
        this.moving_forward = true;
        this.game_active = true;
        this.icon_position = 0;
        this.orientation = null;
        this.moving_icon = null;
        this.icon_speed = null;
    }

    // Function to init game
    init(data) {
        this.style = skill_bar_styles[data.style];
        this.style.icon.type = data.icon || skill_bar_styles[data.style].icon.type;
        this.area_size = data.area_size || 10;
        this.perfect_area_size = data.perfect_area_size || 5;
        this.speed = data.speed || 1;
        this.orientation = data.orientation || 1;
        this.moving_icon = data.moving_icon || false;
        this.icon_speed = data.icon_speed || 0.02;
        this.build_ui();
        this.start_moving_target_area();
        if (this.moving_icon) {
            this.start_moving_icon();
        }
        this.bind_key_events();
    }

    // Function to build main ui
    build_ui() {
        const orientation_style = this.orientation === 2 ? 'transform: rotate(-90deg); top: 0%; left: 30%;' : '';
        const icon_orientation = this.orientation === 2 ? 'fa-rotate-90' : '';
        const icon_html = `<i class="${this.style.icon.type} ${icon_orientation}" aria-hidden="true"></i>`;
        const perfect_area = (this.area_size - this.perfect_area_size) / 2;
        const content = `
            <div class="skill_bar_container" style="${orientation_style}">
                <div class="skill_bar_icon">${icon_html}</div>
                <div class="skill_bar_target_area" style="width: ${this.area_size}%; left: 0;">
                    <div class="skill_bar_perfect_area" style="left: ${perfect_area}%; width: ${this.perfect_area_size}%"></div>
                </div>
            </div>
        `;
        $('#main_container').html(content);
        this.target_area = $('.skill_bar_target_area');
        this.randomise_positions();
    }
    
    // Function to randomise positioning
    randomise_positions() {
        this.target_area_position = Math.floor(Math.random() * (100 - this.area_size));
        this.icon_position = Math.floor(Math.random() * (100 - this.area_size));
        $('.skill_bar_icon').css('left', this.icon_position + '%');
        this.target_area.css('left', this.target_area_position + '%');
    }

    // Function to handle moving icon
    start_moving_icon() {
        let next_position = Math.random() * (100 - this.area_size);
        const update_icon_position = () => {
            if (!this.game_active) return;
            let distance = next_position - this.icon_position;
            this.icon_position += distance * this.icon_speed / 100;
            $('.skill_bar_icon').css('left', `${this.icon_position}%`);
            if (Math.abs(distance) < 0.1) {
                next_position = Math.random() * (100 - this.area_size);
            }
            requestAnimationFrame(update_icon_position);
        };
        requestAnimationFrame(update_icon_position);
    }

    // Function to handle moving target area
    start_moving_target_area() {
        const update_target_area = () => {
            if (!this.game_active) return;
            this.target_area_position += this.moving_forward ? this.speed : -this.speed;
            if (this.target_area_position > 100 - this.area_size) {
                this.target_area_position = 100 - this.area_size;
                this.moving_forward = false;
            } else if (this.target_area_position < 0) {
                this.target_area_position = 0;
                this.moving_forward = true;
            }
            this.target_area.css('left', this.target_area_position + '%');
            requestAnimationFrame(update_target_area);
        };
        requestAnimationFrame(update_target_area);
    }

    // Function to bind key events
    bind_key_events() {
        $(document).off('keydown').on('keydown', (event) => {
            if (event.key === ' ' && this.game_active) {
                this.game_active = false;
                clearInterval(this.movement_interval);
                clearInterval(this.moving_icon_interval);
                this.check_position();
            }
        });
    }

    // Function to check positions
    check_position() {
        const tolerance = 1.0;
        const container_size = this.target_area.parent().width();
        const target_area_position = parseFloat(this.target_area.css('left')) / container_size * 100;
        const target_area_size = parseFloat(this.target_area.css('width')) / container_size * 100;
        const perfect_area_start = target_area_position + (target_area_size - this.perfect_area_size) / 2;
        const perfect_area_end = perfect_area_start + this.perfect_area_size;
        const icon_position = parseFloat($('.skill_bar_icon').css('left')) / container_size * 100;
        if ((icon_position >= perfect_area_start - tolerance) && (icon_position <= perfect_area_end + tolerance)) {
            this.game_end('perfect');
        } else if ((icon_position >= target_area_position) && (icon_position <= target_area_position + target_area_size)) {
            this.game_end('success');
        } else {
            this.game_end('failed');
        }
    }

    // Function to handle game end
    game_end(result) {
        switch (result) {
            case 'perfect':
                this.play_sound(result);
                setTimeout(() => {
                    $('#main_container').empty();
                    $.post(`https://${GetParentResourceName()}/skill_bar_end`, JSON.stringify({ 'success': result }));
                }, 1500);
                break;
            case 'success':
                this.play_sound(result);
                setTimeout(() => {
                    $('#main_container').empty();
                    $.post(`https://${GetParentResourceName()}/skill_bar_end`, JSON.stringify({ 'success': result }));
                }, 1500);
                break;
            case 'failed':
                this.play_sound(result);
                setTimeout(() => {
                    $('#main_container').empty();
                    $.post(`https://${GetParentResourceName()}/skill_bar_end`, JSON.stringify({ 'success': result }));
                }, 1500);
                break;
            default: break;
        }
    }

    // Function to play sounds
    play_sound(sound_key) {
        if (this.style.audio[sound_key]) {
            let sound = new Audio(this.style.audio[sound_key]);
            sound.volume = this.style.audio.volume;
            sound.play();
        }
    }
}

/*
// Example usage:
let game_test_data = { 
    style: 'default', // Style template
    icon: 'fa-solid fa-fish', // Any font-awesome icon; will use template icon if none is provided
    orientation: 2, // Orientation of the bar; 1 = horizontal centre, 2 = vertical right.
    area_size: 20, // Size of the target area in %
    perfect_area_size: 5, // Size of the perfect area in %
    speed: 0.5, // Speed the target area moves
    moving_icon: true, // Toggle icon movement; true = icon will move randomly, false = icon will stay in a static position
    icon_speed: 3, // Speed to move the icon if icon movement enabled
};
start_minigame('skill_bar', game_test_data)
*/