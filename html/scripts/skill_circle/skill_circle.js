//------------------------------\\
//---\\ BOII | DEVELOPMENT //---\\
//------------------------------\\

// Game styles
const skill_circle_styles = {
    ['default']: {
        icon: {
            type: 'fa-solid fa-fish' // Default icon used if none is provided
        },
        audio: { // Audio sounds are optional simply replace the sound with undefined and no sound will play. e.g. downloaded: undefined,
            success: 'assets/audio/beep.ogg', // Sound played for success
            perfect: 'assets/audio/glitchy.ogg', // Sound played when icon is in perfect area
            failed: 'assets/audio/system_fault.ogg', // Sound played when failed
            volume: 0.3 // Volume to play sounds 
        },
    }
     // You can add more style templates here..
}

// Game class
class SkillCircle {
    constructor() {
        this.style = skill_circle_styles['default'];
        this.current_key = '';
        this.radius = 100;
        this.circle_width = 300;
        this.circle_height = 300;
        this.icon_angle = 0;
        this.target_zone_angle = 0;
        this.speed = 0.01;
        this.area_size = Math.PI / 3;
        this.perfect_zone_angle = 0;
        this.perfect_zone_size = Math.PI / 18;
        this.game_active = true;
        this.icon_direction = null;
    }

    // Function to init game
    init(data) {
        this.style = skill_circle_styles[data.style];
        this.style.icon.type = data.icon || skill_circle_styles[data.style].icon.type;
        this.speed = data.speed || this.speed;
        this.area_size = Math.PI / data.area_size || this.area_size;
        this.icon_angle = Math.random() * Math.PI * 2;
        this.target_zone_angle = Math.random() * Math.PI * 2;
        this.perfect_zone_angle = this.target_zone_angle + this.area_size / 2 - this.perfect_zone_size / 2;
        this.build_ui();
        this.animate();
        this.choose_random_key();
        this.bind_key_events();
    }

    // Function to build ui
    build_ui() {
        const icon_html = `<i class="${this.style.icon.type}" aria-hidden="true"></i>`;
        const content = `
            <div class="skill_circle_container">
                <canvas id="skill_circle_canvas" width="${this.circle_width}" height="${this.circle_height}"></canvas>
                <div class="skill_circle_icon">${icon_html}</div>
                <div class="current_key_display"></div>
            </div>
        `;
        $('#main_container').html(content);
        this.canvas = document.getElementById('skill_circle_canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    // Function to choose a random key to press
    choose_random_key() {
        const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.current_key = keys[Math.floor(Math.random() * keys.length)];
        $('.current_key_display').text(`${this.current_key}`);
    }

    // Function to draw circle
    draw_circle() {
        this.ctx.clearRect(0, 0, this.circle_width, this.circle_height);
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(255, 255, 255, 1)';
        this.ctx.shadowBlur = 3;
        this.ctx.beginPath();
        this.ctx.lineWidth = 40;
        this.ctx.strokeStyle = 'rgba(15, 15, 15, 1)';
        this.ctx.arc(this.circle_width / 2, this.circle_height / 2, this.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
        const start = this.target_zone_angle;
        const end = this.target_zone_angle + this.area_size;
        this.ctx.beginPath();
        this.ctx.lineWidth = 40;
        this.ctx.arc(this.circle_width / 2, this.circle_height / 2, this.radius, start, end);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.stroke();
        const target_center = this.target_zone_angle + this.area_size / 2;
        const perfect_start_x = this.circle_width / 2 + (this.radius - 20) * Math.cos(target_center);
        const perfect_start_y = this.circle_height / 2 + (this.radius - 20) * Math.sin(target_center);
        const perfect_end_x = this.circle_width / 2 + (this.radius + 20) * Math.cos(target_center);
        const perfect_end_y = this.circle_height / 2 + (this.radius + 20) * Math.sin(target_center);
        this.ctx.beginPath();
        this.ctx.moveTo(perfect_start_x, perfect_start_y);
        this.ctx.lineTo(perfect_end_x, perfect_end_y);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();
        this.set_icon_position();
    }
    
    // Function to set icon position
    set_icon_position() {
        const iconX = this.circle_width / 2 + this.radius * Math.cos(this.icon_angle);
        const iconY = this.circle_height / 2 + this.radius * Math.sin(this.icon_angle);
        $('.skill_circle_icon').css({ left: `${iconX}px`, top: `${iconY}px` });
    }

    // Function to bind key events
    bind_key_events() {
        $(document).off('keydown').on('keydown', (e) => {
            if (e.key.toUpperCase() === this.current_key && this.game_active) {
                this.game_active = false;
                this.check_position();
            }
        });
    }

    // Function to check position
    check_position() {
        const tolerance = 1.0;
        const tolerance_radians = tolerance * (Math.PI / 180);
        const perfect_center = this.target_zone_angle + (this.area_size / 2);
        const perfect_start = perfect_center - (this.perfect_zone_size / 2) - tolerance_radians;
        const perfect_end = perfect_center + (this.perfect_zone_size / 2) + tolerance_radians;
        const target_start = this.target_zone_angle - tolerance_radians;
        const target_end = this.target_zone_angle + this.area_size + tolerance_radians;
        if (this.icon_angle >= perfect_start && this.icon_angle <= perfect_end) {
            this.game_end('perfect');
        } else if (this.icon_angle >= target_start && this.icon_angle <= target_end) {
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
                    $.post(`https://${GetParentResourceName()}/skill_circle_end`, JSON.stringify({ 'success': result }));
                }, 1500);
                break;
            case 'success':
                this.play_sound(result);
                setTimeout(() => {
                    $('#main_container').empty();
                    $.post(`https://${GetParentResourceName()}/skill_circle_end`, JSON.stringify({ 'success': result }));
                }, 1500);
                break;
            case 'failed':
                this.play_sound(result);
                setTimeout(() => {
                    $('#main_container').empty();
                    $.post(`https://${GetParentResourceName()}/skill_circle_end`, JSON.stringify({ 'success': result }));
                }, 1500);
                break;
            default: break;
        }
    }

    play_sound(sound_key) {
        if (this.style.audio[sound_key]) {
            let sound = new Audio(this.style.audio[sound_key]);
            sound.volume = this.style.audio.volume;
            sound.play();
        }
    }

    animate() {
        if (!this.game_active) return;
        this.target_zone_angle += this.speed;
        if (this.target_zone_angle > Math.PI * 2) {
            this.target_zone_angle -= Math.PI * 2;
        }
        this.draw_circle();
        requestAnimationFrame(() => this.animate());
    }
}

/*
let game_test_data = {
    style: 'default', // Style template
    icon: 'fa-solid fa-gear', // Any font-awesome icon; will use template icon if none is provided
    speed: 0.02, // Speed of target zone movement
    area_size: Math.PI / 4, // Size of target zone
};

start_minigame('skill_circle', game_test_data)
*/
