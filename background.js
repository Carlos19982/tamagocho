
/**
 * background.js
 * 
 * Motor de renderizado del fondo dinámico para el Tamagotchi.
 * Este script es autocontenido y se puede incluir en cualquier página
 * que necesite el fondo animado.
 */

// Variables globales para el motor del fondo
let bg_canvas, bg_ctx, bg_stars, bg_clouds, bg_fireflies, bg_shootingStars;
let bg_sunMoonPos = { x: 0, y: 0 };
let bg_animationFrameId;

// Variables para la optimización
let bg_lastFrameTime = 0;
const BG_TARGET_FPS = 15;
const BG_FRAME_INTERVAL = 1000 / BG_TARGET_FPS;

// --- ¡NUEVO! Canvas para pre-renderizar el fondo estático (cielo y colinas) ---
let bg_backgroundCacheCanvas = null;
let bg_backgroundCacheCtx = null;
let bg_lastRenderedHour = -1; // Para saber cuándo redibujar el fondo estático

let bg_isAnimationRunning = false;
// --- ¡NUEVO! Variable para guardar el elemento de colisión ---
let bg_collisionElement = null;
// --- ¡NUEVO! Caché para los sprites pre-renderizados ---
let bg_sprites = {};

/**
 * Inicia el motor del fondo. Busca el canvas y comienza el bucle de animación.
 * @param {string|null} collisionElementId - El ID del elemento con el que las nubes pueden colisionar.
 */
function initBackgroundCanvas(collisionElementId = null) {
    bg_canvas = document.getElementById('background-canvas');
    if (!bg_canvas) {
        console.error("No se encontró el elemento canvas con id 'background-canvas'.");
        return;
    }
    bg_ctx = bg_canvas.getContext('2d');

    // --- ¡NUEVO! Inicializar el canvas de caché ---
    bg_backgroundCacheCanvas = document.createElement('canvas');
    bg_backgroundCacheCtx = bg_backgroundCacheCanvas.getContext('2d');
    bg_lastRenderedHour = -1; // Forzar el primer renderizado

    // --- ¡NUEVO! Guardar la referencia al elemento de colisión si se proporciona ---
    if (collisionElementId) {
        bg_collisionElement = document.getElementById(collisionElementId);
    }

    // Desactiva el suavizado para un look pixel-perfect
    bg_ctx.imageSmoothingEnabled = false;

    // Inicializar elementos del escenario
    bg_stars = [];
    for (let i = 0; i < 250; i++) {
        bg_stars.push({
            x: Math.random(),
            y: Math.random(),
            radius: Math.random() * 1.5,
            alpha: Math.random() * 0.5 + 0.5
        });
    }

    bg_fireflies = [];
    for (let i = 0; i < 20; i++) {
        bg_fireflies.push({
            x: Math.random(),
            y: Math.random() * 0.2 + 0.75,
            radius: Math.random() * 1.5 + 0.5,
            alpha: 0,
            alphaSpeed: Math.random() * 0.02 + 0.01,
            vx: (Math.random() - 0.5) * 0.0001,
            vy: (Math.random() - 0.5) * 0.0001
        });
    }

    bg_shootingStars = [];

    bg_clouds = [];
    for (let i = 0; i < 10; i++) {
        bg_clouds.push({
            x: Math.random(),
            y: Math.random() * 0.4 + 0.1,
            speed: Math.random() * 0.0001 + 0.00005,
            width: Math.random() * 100 + 50
        });
    }

    startBackgroundAnimation();
}

/**
 * Inicia o reanuda el bucle de animación del fondo.
 */
function startBackgroundAnimation() {
    if (bg_isAnimationRunning) return;
    bg_isAnimationRunning = true;
    if (bg_animationFrameId) cancelAnimationFrame(bg_animationFrameId);
    bg_lastFrameTime = performance.now();
    animateBackground(bg_lastFrameTime);
}

/**
 * Detiene el bucle de animación del fondo.
 * @param {boolean} clear - Si es true, pinta el canvas de negro.
 */
function stopBackgroundAnimation(clear = false) {
    bg_isAnimationRunning = false;
    if (bg_animationFrameId) {
        cancelAnimationFrame(bg_animationFrameId);
        bg_animationFrameId = null;
    }
    if (clear && bg_ctx) {
        bg_ctx.fillStyle = 'black';
        bg_ctx.fillRect(0, 0, bg_canvas.width, bg_canvas.height);
    }
}

function animateBackground(timestamp) {
    if (!bg_isAnimationRunning) return;

    bg_animationFrameId = requestAnimationFrame(animateBackground);

    if (timestamp - bg_lastFrameTime < BG_FRAME_INTERVAL) {
        return;
    }
    bg_lastFrameTime = timestamp;

    actualizarFondoDinamico(timestamp);
}

// --- ¡OPTIMIZADO! Esta función ya no se usa en el bucle principal. ---
// Se mantiene por si se necesita para algo puntual, pero el rendimiento ahora
// depende de `createPixelatedSprite` y `drawImage`.
// function drawPixelatedCircle(ctx, x, y, radius, color) { ... }

// --- ¡NUEVO! Función para crear un sprite circular pixelado ---
function createPixelatedSprite(radius, color) {
    const spriteCanvas = document.createElement('canvas');
    const spriteCtx = spriteCanvas.getContext('2d');
    const diameter = radius * 2;
    spriteCanvas.width = diameter;
    spriteCanvas.height = diameter;

    spriteCtx.fillStyle = color;
    spriteCtx.beginPath();
    spriteCtx.arc(radius, radius, radius, 0, 2 * Math.PI);
    spriteCtx.fill();

    return spriteCanvas;
}

function drawMoon(ctx, x, y, radius, color) {
    // Usamos el sprite cacheado de la luna
    if (!bg_sprites.moon) {
        bg_sprites.moon = createPixelatedSprite(radius, color);
        const craterColor = 'rgba(200, 200, 200, 0.7)';
        const moonCtx = bg_sprites.moon.getContext('2d');
        // Dibujamos los cráteres una sola vez sobre el sprite de la luna
        moonCtx.fillStyle = craterColor;
        moonCtx.beginPath(); moonCtx.arc(radius * 0.6, radius * 0.7, radius * 0.2, 0, 2 * Math.PI); moonCtx.fill();
        moonCtx.beginPath(); moonCtx.arc(radius * 1.5, radius * 1.1, radius * 0.3, 0, 2 * Math.PI); moonCtx.fill();
        moonCtx.beginPath(); moonCtx.arc(radius * 1.1, radius * 1.5, radius * 0.15, 0, 2 * Math.PI); moonCtx.fill();
    }
    ctx.drawImage(bg_sprites.moon, x - radius, y - radius, radius * 2, radius * 2);
}

function drawCloud(ctx, cloud) {
    // Usamos un sprite cacheado para las nubes
    if (!bg_sprites.cloud) {
        bg_sprites.cloud = createPixelatedSprite(50, 'rgba(255, 255, 255, 0.8)'); // Radio base de 50
    }
    const craterColor = 'rgba(200, 200, 200, 0.7)';
    const baseRadius = cloud.width / 4;
    const scale = baseRadius / 50; // Escala relativa al radio base
    const w = bg_sprites.cloud.width;
    const h = bg_sprites.cloud.height;

    // Dibujamos el sprite varias veces, escalado y posicionado para formar la nube
    ctx.drawImage(bg_sprites.cloud, cloud.x * bg_canvas.width - w*scale/2, cloud.y * bg_canvas.height - h*scale/2, w * scale, h * scale);
    ctx.drawImage(bg_sprites.cloud, cloud.x * bg_canvas.width + baseRadius - w*scale*0.8/2, cloud.y * bg_canvas.height + baseRadius / 2 - h*scale*0.8/2, w * scale * 0.8, h * scale * 0.8);
    ctx.drawImage(bg_sprites.cloud, cloud.x * bg_canvas.width - baseRadius - w*scale*0.9/2, cloud.y * bg_canvas.height + baseRadius / 3 - h*scale*0.9/2, w * scale * 0.9, h * scale * 0.9);
    ctx.drawImage(bg_sprites.cloud, cloud.x * bg_canvas.width - w*scale*0.7/2, cloud.y * bg_canvas.height + baseRadius / 2 - h*scale*0.7/2, w * scale * 0.7, h * scale * 0.7);
}

// --- ¡NUEVO! Función para el efecto de "puff" al romperse una nube ---
function createPuffEffect(x, y) {
    const numParticles = 10;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, 0.7)';
        particle.style.borderRadius = '50%';
        particle.style.zIndex = '1'; // Encima del canvas, debajo del resto
        particle.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        document.body.appendChild(particle);

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50 + 20;
        setTimeout(() => { particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.5)`; particle.style.opacity = '0'; }, 10);
        setTimeout(() => particle.remove(), 1010);
    }
}


function drawSun(ctx, x, y, radius, color) {
    // Usamos sprites cacheados para el sol y su brillo
    if (!bg_sprites.sun) {
        bg_sprites.sun = createPixelatedSprite(radius, color);
    }
    if (!bg_sprites.sunGlow) {
        bg_sprites.sunGlow = createPixelatedSprite(radius * 1.8, 'rgba(255, 255, 224, 0.15)');
    }

    ctx.drawImage(bg_sprites.sunGlow, x - radius * 1.8, y - radius * 1.8, radius * 3.6, radius * 3.6);
    ctx.drawImage(bg_sprites.sun, x - radius, y - radius, radius * 2, radius * 2);
}

function drawLandscape(ctx, width, height, groundColor, hillColor1, hillColor2) {
    ctx.fillStyle = hillColor1;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.8);
    ctx.bezierCurveTo(width * 0.2, height * 0.7, width * 0.3, height * 0.75, width * 0.5, height * 0.8);
    ctx.bezierCurveTo(width * 0.7, height * 0.85, width * 0.8, height * 0.7, width, height * 0.75);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = hillColor2;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.85);
    ctx.bezierCurveTo(width * 0.3, height * 0.8, width * 0.4, height * 0.9, width * 0.7, height * 0.85);
    ctx.bezierCurveTo(width * 0.9, height * 0.8, width, height * 0.9, width, height * 0.9);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
}

function actualizarFondoDinamico(timestamp) {
    if (!bg_ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = bg_canvas.getBoundingClientRect();
    if (bg_canvas.width !== rect.width * dpr || bg_canvas.height !== rect.height * dpr) {
        bg_canvas.width = rect.width * dpr;
        bg_canvas.height = rect.height * dpr;
        bg_ctx.scale(dpr, dpr);
        bg_lastRenderedHour = -1; // Forzar redibujado de caché
    }
    const width = bg_canvas.clientWidth;
    const height = bg_canvas.clientHeight;

    const hora = new Date().getHours();
    const minutos = new Date().getMinutes();
    const horaDecimal = hora + minutos / 60;

    // --- MODIFICADO: Sistema de interpolación de colores para transiciones suaves ---
    const colorPalettes = [
        { time: 0,  sky: ['#0c0a18', '#2c3e50'], sun: '#f4f4f4', ground: '#2b2f31', hill1: '#1c1e22', hill2: '#222629' }, // Medianoche
        { time: 5,  sky: ['#2c3e50', '#e74c3c', '#f1c40f'], sun: '#ffd700', ground: '#38302b', hill1: '#4a3f37', hill2: '#5c4e44' }, // Amanecer
        { time: 7,  sky: ['#87CEEB', '#a9dff3'], sun: '#FFDE00', ground: '#5d7a3c', hill1: '#4b6330', hill2: '#526e33' }, // Mañana
        { time: 12, sky: ['#63a4ff', '#89bfff'], sun: '#FFEE88', ground: '#6b8c43', hill1: '#546e35', hill2: '#5b7a39' }, // Mediodía
        { time: 17, sky: ['#34495e', '#e67e22', '#d35400'], sun: '#ff6347', ground: '#4a403a', hill1: '#3b332e', hill2: '#453a34' }, // Atardecer
        { time: 21, sky: ['#0c0a18', '#2c3e50'], sun: '#f4f4f4', ground: '#2b2f31', hill1: '#1c1e22', hill2: '#222629' }, // Anochecer
        { time: 24, sky: ['#0c0a18', '#2c3e50'], sun: '#f4f4f4', ground: '#2b2f31', hill1: '#1c1e22', hill2: '#222629' }  // Siguiente medianoche (para cerrar el ciclo)
    ];

    let palette1, palette2;
    for (let i = 0; i < colorPalettes.length - 1; i++) {
        if (horaDecimal >= colorPalettes[i].time && horaDecimal < colorPalettes[i+1].time) {
            palette1 = colorPalettes[i];
            palette2 = colorPalettes[i+1];
            break;
        }
    }

    const timeRange = palette2.time - palette1.time;
    const progress = (horaDecimal - palette1.time) / timeRange;

    // Función para interpolar colores en formato hexadecimal
    function lerpColor(c1, c2, factor) {
        const r1 = parseInt(c1.substring(1, 3), 16);
        const g1 = parseInt(c1.substring(3, 5), 16);
        const b1 = parseInt(c1.substring(5, 7), 16);
        const r2 = parseInt(c2.substring(1, 3), 16);
        const g2 = parseInt(c2.substring(3, 5), 16);
        const b2 = parseInt(c2.substring(5, 7), 16);

        const r = Math.round(r1 + (r2 - r1) * factor).toString(16).padStart(2, '0');
        const g = Math.round(g1 + (g2 - g1) * factor).toString(16).padStart(2, '0');
        const b = Math.round(b1 + (b2 - b1) * factor).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    // Interpolar colores sólidos
    const sunColor = lerpColor(palette1.sun, palette2.sun, progress);
    const groundColor = lerpColor(palette1.ground, palette2.ground, progress);
    const hillColor1 = lerpColor(palette1.hill1, palette2.hill1, progress);
    const hillColor2 = lerpColor(palette1.hill2, palette2.hill2, progress);

    // Interpolar gradiente del cielo
    const skyGradient = bg_ctx.createLinearGradient(0, 0, 0, height);
    const maxStops = Math.max(palette1.sky.length, palette2.sky.length);
    for (let i = 0; i < maxStops; i++) {
        const color1 = palette1.sky[i] || palette1.sky[palette1.sky.length - 1];
        const color2 = palette2.sky[i] || palette2.sky[palette2.sky.length - 1];
        const stopColor = lerpColor(color1, color2, progress);
        const stopPosition = i / (maxStops - 1);
        skyGradient.addColorStop(isNaN(stopPosition) ? 1 : stopPosition, stopColor);
    }

    // Forzar redibujado del caché en cada frame para la transición suave
    let needsRedraw = true; 
    let isNight, isSunset;

    // --- MODIFICADO: Lógica de ciclo unificada para un movimiento continuo ---
    if (needsRedraw) {
        // El ciclo de 24h se mapea a un valor entre -0.1 y 1.1 para que el astro
        // empiece fuera de la pantalla y termine fuera de la pantalla.
        // El punto 0 del ciclo son las 5 AM.
        const cyclePercent = ((horaDecimal - 5 + 24) % 24) / 20; // 20 horas de "visibilidad"

        bg_sunMoonPos.x = width * cyclePercent; // La posición X es un porcentaje del ancho
        bg_sunMoonPos.y = height * 0.7 - Math.sin(cyclePercent * Math.PI) * height * 0.6;

        // bg_lastRenderedHour ya no es necesario para la lógica de redibujado principal
        bg_backgroundCacheCanvas.width = bg_canvas.width;
        bg_backgroundCacheCanvas.height = bg_canvas.height;
        bg_backgroundCacheCtx.scale(dpr, dpr);
        bg_backgroundCacheCtx.imageSmoothingEnabled = false;

        bg_backgroundCacheCtx.fillStyle = skyGradient;
        bg_backgroundCacheCtx.fillRect(0, 0, width, height);
        drawLandscape(bg_backgroundCacheCtx, width, height, groundColor, hillColor1, hillColor2);
    }

    isNight = (hora < 5 || hora >= 21);
    isSunset = (hora >= 17 && hora < 21);

    // Limpiar caché de sprites si la hora cambia para regenerar colores (si fuera necesario)
    if (hora !== bg_lastRenderedHour) {
        bg_sprites = {};
        bg_lastRenderedHour = hora;
    }

    if (isNight) {
        document.body.classList.add('night-mode');
        document.body.classList.remove('sunset-mode');
    } else if (isSunset) {
        document.body.classList.add('sunset-mode');
        document.body.classList.remove('night-mode');
    } else {
        document.body.classList.remove('night-mode');
        document.body.classList.remove('sunset-mode');
    }

    bg_ctx.clearRect(0, 0, width, height);
    bg_ctx.drawImage(bg_backgroundCacheCanvas, 0, 0, width, height);

    if (isNight) {
        bg_stars.forEach(star => {
            bg_ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (Math.sin(timestamp * 0.001 + star.x) * 0.2 + 0.8)})`;
            bg_ctx.fillRect(star.x * width, star.y * height, star.radius, star.radius);
        });
    }

    if (isNight) {
        drawMoon(bg_ctx, bg_sunMoonPos.x, bg_sunMoonPos.y, 25, sunColor);

        bg_fireflies.forEach(fly => {
            fly.alpha += fly.alphaSpeed;
            if (fly.alpha > 1 || fly.alpha < 0) fly.alphaSpeed *= -1;
            fly.x += fly.vx;
            fly.y += fly.vy;
            if (fly.x > 1 || fly.x < 0) fly.vx *= -1;
            if (fly.y > 0.95 || fly.y < 0.75) fly.vy *= -1;
            bg_ctx.fillStyle = `rgba(255, 255, 100, ${Math.max(0, fly.alpha)})`;
            bg_ctx.fillRect(fly.x * width, fly.y * height, fly.radius, fly.radius);
        });

        if (Math.random() < 0.002 && bg_shootingStars.length < 2) {
            bg_shootingStars.push({
                x: Math.random() * width,
                y: Math.random() * height * 0.3,
                len: Math.random() * 80 + 50,
                speed: Math.random() * 2 + 3,
                life: 1
            });
        }

        bg_shootingStars.forEach((star, index) => {
            star.x -= star.speed;
            star.y += star.speed / 3;
            star.life -= 0.015;
            if (star.life <= 0) bg_shootingStars.splice(index, 1);
            bg_ctx.strokeStyle = `rgba(255, 255, 255, ${star.life})`;
            bg_ctx.lineWidth = 2; bg_ctx.beginPath(); bg_ctx.moveTo(star.x, star.y); bg_ctx.lineTo(star.x + star.len, star.y - star.len / 3); bg_ctx.stroke();
        });
    } else {
        // --- MODIFICADO: Se elimina la lógica de transición con fundido. ---
        // Ahora solo se dibuja el sol, que sigue su trayectoria continua.
        drawSun(bg_ctx, bg_sunMoonPos.x, bg_sunMoonPos.y, 25, sunColor);
    }
    
    // --- ¡NUEVO! Lógica de colisión de nubes, ahora modular ---
    const charRect = bg_collisionElement ? bg_collisionElement.getBoundingClientRect() : null;

    bg_clouds.forEach((cloud, index) => {
        cloud.x += cloud.speed;
        if (cloud.x * width > width + cloud.width) {
            cloud.x = -cloud.width / width;
        }

        if (charRect) {
            const cloudX = cloud.x * bg_canvas.width;
            const cloudY = cloud.y * bg_canvas.height;
            const cloudWidth = cloud.width;
            const cloudHeight = cloud.width / 2;

            const hPad = charRect.width * 0.25;
            const vPad = charRect.height * 0.10;
            const collisionBox = {
                left: charRect.left + hPad, right: charRect.right - hPad,
                top: charRect.top + vPad, bottom: charRect.bottom - vPad
            };

            if (cloudX < collisionBox.right && cloudX + cloudWidth > collisionBox.left &&
                cloudY < collisionBox.bottom && cloudY + cloudHeight > collisionBox.top) {
                createPuffEffect(cloudX + cloudWidth / 2, cloudY + cloudHeight / 2);
                bg_clouds.splice(index, 1);
                return; // Saltar al siguiente ciclo del forEach
            }
        }
        drawCloud(bg_ctx, cloud);
    });
}