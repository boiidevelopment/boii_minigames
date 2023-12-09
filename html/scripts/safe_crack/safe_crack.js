//------------------------------\\
//---\\ BOII | DEVELOPMENT //---\\
//------------------------------\\

// Game styles
const safe_crack_styles = {
    ['default']: {
        audio: {
            rotate_left: 'assets/audio/safe_lock_1.mp3', // Sound played when rotating left
            rotate_right: 'assets/audio/safe_lock_2.mp3', // Sound played when rotating right
            aligned: 'assets/audio/safe_lock_4.mp3', // Sound played when in alignment area
            success: 'assets/audio/succeeded.ogg', // Sound played when the game is won
            failed: 'assets/audio/system_fault.ogg', // Sound played when the game is lost
            volume: 0.2, // Volume to play sounds
            aligned_volume: 0.8 // Volume to play sounds -- louder than rotation to ensure players can hear
        },
    }
};

// Game class
class SafeCrack {
    constructor() {
        this.style = safe_crack_styles['default'];
        this.difficulty = null;
        this.rings = [];
        this.canvas = null;
        this.ctx = null;
        this.center = { x: 0, y: 0 };
        this.selected_ring_index = 0;
        this.initial_direction = Math.random() < 0.5 ? 'left' : 'right';
    }

    // Function to init game
    init(data) {
        this.style = safe_crack_styles[data.style];
        this.difficulty = data.difficulty || 3;
        $(document).ready(() => {
            $(document).keyup((e) => this.handle_exit(e));
        });
        this.build_ui();
        this.setup_rings();
        this.selected_ring_index = this.rings.length - 1;
        this.draw_rings();
        this.bind_key_presses();
    }

    // Function to handle exit on escape or backspace
    handle_exit(e) {
        if (e.key === "Escape" || e.key === "Backspace") {
            this.game_end(false);
        }
    }

    // Function to bind key presses
    bind_key_presses() {
        $(document).on('keydown', (event) => {
            this.selected_ring_index = this.rings.findIndex(ring => !ring.notch_aligned);
            if (this.selected_ring_index === -1) {
                return;
            }
            const index = this.selected_ring_index;
            const rotation_step = 0.1;
            const direction = index % 2 === 0 ? this.initial_direction : (this.initial_direction === 'left' ? 'right' : 'left');
            const direction_key = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';
            if (event.key === direction_key) {
                const delta = direction === 'left' ? -rotation_step : rotation_step;
                this.rotate_ring(index, delta); 
                this.play_sound(direction === 'left' ? 'rotate_left' : 'rotate_right');
            }
            if ([' '].includes(event.key)) {
                const index = this.selected_ring_index;
                if (index !== -1) {
                    this.update_notch_alignment(index);
                    const lock_icon = $(`#lock_icon_${index}`);
                    lock_icon.toggleClass('fa-lock-open', this.rings[index].notch_aligned)
                            .toggleClass('fa-lock', !this.rings[index].notch_aligned);
                    if (this.rings[index].notch_aligned) {
                        lock_icon.css('color', 'rgba(180, 180, 180, 1)');
                    } else {
                        lock_icon.css('color', 'rgba(180, 180, 180, 0.25)');
                    }
                    if (this.rings[index].notch_aligned) {
                        this.selected_ring_index = this.rings.findIndex((r, i) => !r.notch_aligned && i > index);
                        const next_direction = this.selected_ring_index % 2 === 0 ? 'fa-arrow-right' : 'fa-arrow-left';
                        $('#direction_arrow').removeClass().addClass(`fas ${next_direction}`);
                        if (this.selected_ring_index === -1) {
                            this.check_completion();
                        }
                    }
                }
            }
        });
    }

    // Function to build main ui
    build_ui() {
        let audio_elements = '';
        for (let key in this.style.audio) {
            if (key !== 'volume' && this.style.audio[key]) {
                audio_elements += `<audio id="${key}_sound" src="${this.style.audio[key]}" preload="auto"></audio>`;
            }
        }
        let lock_icons = '';
        for (let i = 0; i < this.difficulty; i++) {
            lock_icons += `<i class="fas fa-lock" id="lock_icon_${i}"></i><br>`;
        }
        const content = `
            <div class="safe_crack_container">
                <canvas id="safeCanvas" width="1000" height="1000"></canvas>
                <div class="lock-container">
                <div class="dial">
                        <!-- Numbers will be added dynamically with JavaScript -->
                    </div>
                    <div class="dial-center"></div>
                </div>

                <div class="lock_icons_container">
                    <div class="lock_icons">
                        ${lock_icons}
                    </div>
                </div>
            </div>
            ${audio_elements}
        `;
        $('#main_container').html(content);
        this.canvas = document.getElementById('safeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.center = { x: 500, y: this.canvas.height / 2 };
        this.setup_rings();
        const dial = document.querySelector('.dial');
        for (let i = 0; i < 60; i++) {
            const number = document.createElement('div');
            number.classList.add('number');
            number.style.transform = `rotate(${i * 6}deg)`;
            if (i % 5 === 0) {
                number.innerHTML = (i / 5) * 5;
                number.style.transform += ` translateY(-95px)`;
                number.style.fontSize = '0.8rem';
            } else { // For notches
                number.innerHTML = '|';
                number.style.transform += ` translateY(-115px)`;
                number.style.fontSize = '1rem';
            }
            dial.appendChild(number);
        }

    }
    
    // Function to setup rings
    setup_rings() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.rings = [];
        for (let i = 0; i < this.difficulty; i++) {
            this.rings.push({
                radius: (40 * this.difficulty) - (i * 50),
                marker_notch: Math.random() * Math.PI * 2,
                rotating_notch: Math.random() * Math.PI * 2, 
                notch_aligned: false
            });
        }
    }
    
    // Function to draw rings
    draw_rings() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.rings.forEach(ring => this.draw_ring(ring));
    }

    // Function handle drawing rings
    draw_ring(ring) {
        const ring_thickness = 20;
        const notch_width = 0.3;
        const notch_2 = 0.05;
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, ring.radius, 0, Math.PI * 2);
        this.ctx.lineWidth = ring_thickness;
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, ring.radius, ring.marker_notch - notch_width / 2, ring.marker_notch + notch_width / 2);
        this.ctx.lineWidth = ring_thickness;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0)';
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, ring.radius, ring.rotating_notch - notch_2 / 2, ring.rotating_notch + notch_2 / 2);
        this.ctx.lineWidth = ring_thickness;
        this.ctx.strokeStyle = ring.notch_aligned ? 'rgba(0, 255, 0, 0)' : 'rgba(255, 0, 0, 0)';
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
    }
    
    // Function to handle ring rotation
    rotate_ring(index, delta) {
        if (this.is_rotating) return;
        this.is_rotating = true;
        this.rings[index].rotating_notch = (this.rings[index].rotating_notch + delta + Math.PI * 2) % (Math.PI * 2);
        this.check_alignment_zone(index);
        this.draw_rings();
        const dial = document.querySelector('.dial');
        const current_rotation = parseFloat(dial.getAttribute('data-rotation') || 0);
        const new_rotation = current_rotation + (delta * (180 / Math.PI));
        dial.style.transform = `rotate(${new_rotation}deg)`;
        dial.setAttribute('data-rotation', new_rotation.toString());
        setTimeout(() => {
            this.is_rotating = false;
        }, 10);
    }
    
    // Function to check alignment zone
    check_alignment_zone(index) {
        const ring = this.rings[index];
        const tolerance = 0.15;
        const angle_difference = Math.abs(ring.rotating_notch - ring.marker_notch);
        const effective_difference = Math.min(angle_difference, Math.PI * 2 - angle_difference);
        if (effective_difference < tolerance && !ring.aligned_sound) {
            this.play_sound('aligned');
            ring.aligned_sound = true;
        } else if (effective_difference >= tolerance) {
            ring.aligned_sound = false;
        }
    }

    // Function to update notch alignment
    update_notch_alignment(index) {
        const ring = this.rings[index];
        const tolerance = 0.1;
        const angle_difference = Math.abs(ring.rotating_notch - ring.marker_notch);
        const effective_difference = Math.min(angle_difference, Math.PI * 2 - angle_difference);
        ring.notch_aligned = effective_difference < tolerance;
    }

    // Function to check completion
    check_completion() {
        const aligned = this.rings.every(ring => ring.notch_aligned);
        if (aligned) {
            this.game_end(true);
        }
    }

    // Function to handle game end
    game_end(success) {
        clearInterval(this.timer_interval);
        if (success) {
            this.play_sound('success');
        } else {
            this.play_sound('failed');
        }
        setTimeout(() => {
            $('#main_container').empty();
            $.post(`https://${GetParentResourceName()}/safe_crack_end`, JSON.stringify({ 'success': success }));
        }, 2000);
    }

    // Function to play sounds
    play_sound(sound_key) {
        if (this.style.audio[sound_key]) {
            let sound = new Audio(this.style.audio[sound_key]);
            if (sound_key === 'aligned') {
                sound.volume = this.style.audio.aligned_volume;
            } else {
                sound.volume = this.style.audio.volume;
            }
            sound.play();
        }
    }    
}

/*
// Uncomment this test data if you want to preview the UI live in a web browser
let game_test_data = {
    style: 'default', // Style template
    difficulty: 3 // Difficuly; This increases the amount of lock a player needs to unlock this scuffs out a little above 6 locks I would suggest to use levels 1 - 5 only.
}
start_minigame('safe_crack', game_test_data)
*/