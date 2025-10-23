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
    let needsRedraw = hora !== bg_lastRenderedHour;
    let skyGradient, sunColor, isNight, isSunset, groundColor, hillColor1, hillColor2;

    // --- OPTIMIZACIÓN: Mover la creación de gradientes y cálculo de sol/luna ---
    // Estos valores solo se recalculan cuando la hora cambia.
    if (needsRedraw) {
    if (hora >= 5 && hora < 7) {
        skyGradient = bg_ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#2c3e50'); skyGradient.addColorStop(0.6, '#e74c3c'); skyGradient.addColorStop(1, '#f1c40f');
        sunColor = '#ffd700'; isNight = false; isSunset = false;
        groundColor = '#38302b'; hillColor1 = '#4a3f37'; hillColor2 = '#5c4e44';
    } else if (hora >= 7 && hora < 12) {
        skyGradient = bg_ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#87CEEB'); skyGradient.addColorStop(1, '#a9dff3');
        sunColor = '#FFDE00'; isNight = false; isSunset = false;
        groundColor = '#5d7a3c'; hillColor1 = '#4b6330'; hillColor2 = '#526e33';
    } else if (hora >= 12 && hora < 17) {
        skyGradient = bg_ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#63a4ff'); skyGradient.addColorStop(1, '#89bfff');
        sunColor = '#FFEE88'; isNight = false; isSunset = false;
        groundColor = '#6b8c43'; hillColor1 = '#546e35'; hillColor2 = '#5b7a39';
    } else if (hora >= 17 && hora < 21) {
        skyGradient = bg_ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#34495e'); skyGradient.addColorStop(0.5, '#e67e22'); skyGradient.addColorStop(1, '#d35400');
        sunColor = '#ff6347'; isNight = false; isSunset = true;
        groundColor = '#4a403a'; hillColor1 = '#3b332e'; hillColor2 = '#453a34';
    } else {
        skyGradient = bg_ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#0c0a18'); skyGradient.addColorStop(1, '#2c3e50');
        sunColor = '#f4f4f4'; isNight = true; isSunset = false;
        groundColor = '#2b2f31'; hillColor1 = '#1c1e22'; hillColor2 = '#222629';
    }
        // Calcular posición del sol/luna (arco en el cielo)
        const cyclePercent = ((hora - 5 + 24) % 24) / 18; // Ciclo de 18h de luz (5am a 11pm)
        bg_sunMoonPos.x = width * cyclePercent;
        bg_sunMoonPos.y = height * 0.7 - Math.sin(cyclePercent * Math.PI) * height * 0.6;

        bg_lastRenderedHour = hora;
        bg_backgroundCacheCanvas.width = bg_canvas.width;
        bg_backgroundCacheCanvas.height = bg_canvas.height;
        bg_backgroundCacheCtx.scale(dpr, dpr);
        bg_backgroundCacheCtx.imageSmoothingEnabled = false;

        bg_backgroundCacheCtx.fillStyle = skyGradient;
        bg_backgroundCacheCtx.fillRect(0, 0, width, height);
        drawLandscape(bg_backgroundCacheCtx, width, height, groundColor, hillColor1, hillColor2);
    }
    // --- FIN DE LA OPTIMIZACIÓN ---

    // Para el resto del código, necesitamos saber si es de noche o atardecer.
    // Lo recalculamos aquí de forma muy ligera, sin crear gradientes.
    isNight = (hora < 5 || hora >= 21);
    isSunset = (hora >= 17 && hora < 21);

    // El color del sol/luna también debe estar disponible fuera del bloque `if (needsRedraw)`
    if (isNight) sunColor = '#f4f4f4';
    else if (isSunset) sunColor = '#ff6347';
    else if (hora >= 5 && hora < 7) sunColor = '#ffd700';
    else if (hora >= 12 && hora < 17) sunColor = '#FFEE88';
    else sunColor = '#FFDE00';

    // --- ¡NUEVO! Limpiar caché de sprites si la hora cambia para regenerar colores ---
    if (needsRedraw) bg_sprites = {};

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