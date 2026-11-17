// --- COPIAR IP AL PORTAPAPELES ---
function copiarIP(ip) {
    navigator.clipboard.writeText(ip).then(() => {
        const toast = document.getElementById('toast');
        if(toast) {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

// --- DETECTAR TECLA ENTER EN EL INPUT DE INTEGRANTES DE CLAN ---
document.addEventListener('DOMContentLoaded', () => {
    const inputMiembro = document.getElementById('memberName');
    if (inputMiembro) {
        inputMiembro.addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                if (typeof agregarIntegrante === 'function') {
                    agregarIntegrante();
                }
            }
        });
    }
});

// --- SISTEMA DE PARTÍCULAS TÓXICAS / ESPORAS ---
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height + height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 0.8 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.6 + 0.2;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset();
                this.y = height + 10;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 50, 50, ${this.opacity})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ff2a2a';
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 65 }, () => new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

// ==========================================
// --- 5. EFECTOS DE SONIDO AMBIENTAL (AUDIO TOGGLE) ---
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Creamos el botón flotante de audio dinámicamente en cualquier página
    const audioBtnContainer = document.createElement('div');
    audioBtnContainer.innerHTML = `
        <button id="audioToggleBtn" title="Activar/Desactivar Sonido Ambiental" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: rgba(0,0,0,0.85); border: 1px solid #ff4747; color: #ff4747; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; box-shadow: 0 4px 15px rgba(255,71,71,0.4); transition: all 0.3s ease;">
            🔇
        </button>
    `;
    document.body.appendChild(audioBtnContainer);

    let audioCtx = null;
    let isPlaying = false;
    let noiseNode = null;

    document.getElementById('audioToggleBtn').addEventListener('click', () => {
        const btn = document.getElementById('audioToggleBtn');
        
        if (!isPlaying) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Generador de estática / viento post-apocalíptico
            const bufferSize = audioCtx.sampleRate * 2;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            noiseNode = audioCtx.createBufferSource();
            noiseNode.buffer = buffer;
            noiseNode.loop = true;

            // Filtro de bajas frecuencias (estilo viento tétrico)
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 320;

            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.12; // Volumen suave

            noiseNode.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            noiseNode.start();
            isPlaying = true;
            btn.innerHTML = "🔊";
            btn.style.borderColor = "#4eff4e";
            btn.style.color = "#4eff4e";
            btn.style.boxShadow = "0 0 20px rgba(78,255,78,0.6)";
        } else {
            if (audioCtx) {
                audioCtx.close();
            }
            isPlaying = false;
            btn.innerHTML = "🔇";
            btn.style.borderColor = "#ff4747";
            btn.style.color = "#ff4747";
            btn.style.boxShadow = "0 0 15px rgba(255,71,71,0.4)";
        }
    });
});

// ==========================================
// --- 4. VISOR DE LA CREDENCIAL DE SUPERVIVIENTE (ID CARD) ---
// ==========================================
function mostrarCredencialID(nick, rol) {
    const cardContainer = document.getElementById('survivorIdCard');
    if (!cardContainer) return;

    cardContainer.style.display = 'block';
    document.getElementById('cardNick').innerText = nick;
    document.getElementById('cardRol').innerText = rol;

    const canvasCard = document.getElementById('card_skin_container');
    if (canvasCard && typeof skinview3d !== 'undefined') {
        canvasCard.innerHTML = ""; 
        try {
            const cardSkinViewer = new skinview3d.SkinViewer({
                canvas: canvasCard,
                width: 120,
                height: 160,
                skin: `https://crafthead.net/skin/${encodeURIComponent(nick)}`
            });
            cardSkinViewer.fov = 50;
            cardSkinViewer.zoom = 0.65;
            cardSkinViewer.animation = new skinview3d.IdleAnimation();
        } catch(e) {
            console.log("Skinviewer error:", e);
        }
    }
}