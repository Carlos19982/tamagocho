
//niveles de comida
const foodEffects = {
    "ensalada": 3.6,
    "manzana": 3,
    "yogurt": 3.3,
    "smoothie": 4.5,
    "zanahoria": 1,
    "hamburguesa": 5,
    "pizza": 10,
    "papas fritas": 4,
    "refresco": 3,
    "helado":3
    };
    
    
    // --- Escala de puestos y salarios ---
    const puestos = [
      { nombre: "Pasante", sueldo: 60 },
      { nombre: "Empleado Junior", sueldo: 100 },
      { nombre: "Empleado Senior", sueldo: 140 },
      { nombre: "Supervisor", sueldo: 180 },
      { nombre: "Coordinador", sueldo: 240 },
      { nombre: "Gerente", sueldo: 300 },
      { nombre: "Director", sueldo: 400 },
      { nombre: "CEO", sueldo: 500 }
    ];
    
    // --- Configuración del ciclo ---
    const cicloMs = 280000; // Aproximadamente 4.67 minutos
    const tiempoTotalSueñoPersonalizado =3000000; // 50 minutos
    let promotionCheckedThisCycle = false;
    
    // Parámetros de Flappy Bird
    let birdY = 0, birdVelocity = 0, gravity, jumpImpulse, obstacleSpeed = 2;
    
    if (window.innerWidth < 600) {
    // Configuración para móvil
    gravity = 0.3;
    jumpImpulse = -6;
    } else {
    // Configuración para ordenador
    gravity = 0.2;
    jumpImpulse = -7;
    }
    let intervaloGlobal, sleepInterval, sleepUpdateInterval;
    let minijuegoActivo = false, minijuegoScore = 0, obstacleInterval = null, collisionInterval = null, isJumping = false;
    let tamagotchi, estaDurmiendo = false, ciclosDesdeCumple = 0, juegoTerminado = false;
    let flappyEnded = false;
    
    // --- Funciones de actualización y utilidades ---
    function updateSleepProgress() {
      const sleepProgress = JSON.parse(localStorage.getItem("sleepProgress"));
      if (!sleepProgress || !estaDurmiendo) return;
      const { startTime, initialValue, duration } = sleepProgress;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      tamagotchi.sueno = Math.max(0, initialValue * (1 - progress));
      if (progress >= 1) {
        tamagotchi.sueno = 0;
        localStorage.removeItem("sleepProgress");
      }
      actualizarInterfaz();
    }
    function backgroundUpdateDuringSleep() {
    // Actualiza el estado en modo dormido (puedes usar la función que ya tienes en la clase)
    tamagotchi.actualizarEstadoDormido();
    console.log("Actualización en background durante el sueño.");
    // Aquí puedes agregar cualquier otra actualización que quieras ejecutar mientras duerme
    }
    
    function showPopup(message, duration = 10000) {
    const popup = document.getElementById("popup-message");
    popup.textContent = message;
    popup.style.display = "block";
    // Opcional: Agregar una animación de desvanecimiento
    setTimeout(() => {
    popup.style.display = "none";
    }, duration);
    }
    
    // Excluye los botones de work-menu y de minijuegos al desactivar controles
// Excluye los botones de work-menu, de minijuegos y de food-menu al desactivar controles,
// y además, NO desactiva la interacción en el contenedor del personaje.
// Excluye los botones de work-menu, de minijuegos y de food-menu al desactivar controles,
// y además, NO desactiva la interacción en el contenedor del personaje.
// --- REEMPLAZA TU FUNCIÓN disableControls ACTUAL CON ESTA ---

function disableControls() {
  console.log("Llamando a disableControls..."); // Log para depuración

  // Deshabilitar botones específicos, excepto los de menús abiertos o necesarios
  document.querySelectorAll("button").forEach(button => {
    // Excepciones: botones dentro de menús específicos, botones de minijuego, admin, tienda interna, compra, cerrar overlays
    if (
      button.closest("#work-menu") || // Botones dentro del menú de trabajo
      button.closest("#admin-menu") || // Botones dentro del menú de admin
      button.closest("#food-menu") ||  // Botones dentro del menú de comida
      button.closest("#clean-menu") || // Botones dentro del menú de limpieza
      button.closest("#game-menu") ||  // Botones dentro del menú de juegos
      ["juego-saltar", "juego-reaccion", "juego-ducha", "boton-saltar", "admin-close", "btn-store-comida", "btn-store-objetos", "close-inventory"].includes(button.id) || // IDs específicos exentos (incluido el de cerrar inventario)
      button.closest("#store-overlay") // Permitir botones dentro del overlay de tienda (incluye .buy-btn y btn-store-comida/objetos)
      // El botón de cerrar el menú de trabajo (#close-work-menu) también está exento por button.closest("#work-menu")
    ) {
       // console.log("Botón NO deshabilitado:", button.id || button.textContent.substring(0, 20));
      // Estos botones se dejan activos o su estado lo controla el menú/overlay
    } else {
       // console.log("Botón SÍ deshabilitado:", button.id || button.textContent.substring(0, 20));
       button.disabled = true; // Deshabilita el resto de botones generales
    }
  });

  // --- NO DESACTIVAR LOS ICONOS DE TOGGLE (Tienda e Inventario) ---
  // Los iconos #store-icon y #inventory-icon deben permanecer clickeables
  // para poder cerrar los overlays que abren.
  // Por lo tanto, NO aplicamos pointerEvents = "none" a ellos aquí.

  // Deshabilitar interacción con otros elementos si es necesario (ej. muñeco)
  const muñecoContainer = document.getElementById("muñeco-container");
  if (muñecoContainer) {
      // Deshabilitar clics en el muñeco mientras un overlay/menú está abierto (excepto para despertar)
      // Se podría refinar si se quiere permitir despertar siempre
      // muñecoContainer.style.pointerEvents = "none";
      // Considerar si realmente se quiere deshabilitar el muñeco aquí o manejarlo en los listeners de apertura/cierre
  }

   // Se asume que enableControls revertirá cualquier 'pointerEvents = "none"' que se aplique aquí o en otro lugar.
   // Por simplicidad y para asegurar el toggle, es mejor evitar deshabilitar los iconos aquí.
   console.log("disableControls ejecutado (icono tienda/inventario permanecen activos).");
}

  // Bloquear la interacción con el botón de tienda, si así lo deseas
  const storeIcon = document.getElementById("store-icon");
  if (storeIcon) {
    storeIcon.style.pointerEvents = "none";
  }


  
  function enableControls() {
    // Reactiva todos los botones
    document.querySelectorAll("button").forEach(button => {
      button.disabled = false;
    });
    // Reactiva la interacción en los contenedores clave
    ["store-icon", "minijuego-container", "muñeco-container"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.pointerEvents = "auto";
      }
    });
  }
  
  
  
  // Reactiva todos los botones y la interacción en los contenedores
  function enableControls() {
    document.querySelectorAll("button").forEach(button => {
      button.disabled = false;
    });
    
    ["muñeco-container", "store-icon", "minijuego-container"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.pointerEvents = "auto";
      }
    });
  }
  
      
      function enableControls() {
        // Lista de IDs de los botones de acción que queremos reactivar
        const botonesAccion = [
          "btn-hambre",
          "btn-aburrimiento",
          "btn-sueno",
          "btn-higiene",
          "juego-saltar",
          "juego-reaccion",
          "juego-ducha",
          "boton-saltar"
        ];
        botonesAccion.forEach(id => {
          const btn = document.getElementById(id);
          if (btn) {
            btn.disabled = false;
          }
        });
      
        // Reactiva la interacción en los contenedores: personaje, tienda y área de minijuegos
        const contenedores = ["muñeco-container", "store-icon", "minijuego-container"];
        contenedores.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.pointerEvents = "auto";
          }
        });
      }
      
      
      
      

    function toggleWorkMenu() {
        const workMenu = document.getElementById("work-menu");
        if (getComputedStyle(workMenu).display === "block") {
          workMenu.style.display = "none";
          enableControls();
        } else {
          workMenu.style.display = "block";
          disableControls();
        }
      }
      
    // MODIFICACIÓN: toggleMenu para actualizar controles
    function toggleMenu(menuId) {
      const menu = document.getElementById(menuId);
      if (getComputedStyle(menu).display === "block") {
        menu.style.display = "none";
        enableControls();
      } else {
        menu.style.display = "block";
        disableControls();
      }
    }
    
    document.addEventListener("click", function (e) {
      ["food-menu", "clean-menu", "game-menu"].forEach((id) => {
        const menu = document.getElementById(id);
        if (getComputedStyle(menu).display === "block" &&
            !e.target.closest("#" + id) &&
            !e.target.closest("button[id^='btn-']")) {
          menu.style.display = "none";
          enableControls();
        }
      });
    });
    ["food-menu", "clean-menu", "game-menu"].forEach((id) => {
      document.getElementById(id).addEventListener("click", (e) => e.stopPropagation());
    });
    function actualizarProgreso(id, valor) {
      const barra = document.getElementById(id);
      let porcentaje = (valor / 10) * 100;
      barra.style.width = porcentaje + "%";
      if (valor < 3) barra.className = "progress-bar verde";
      else if (valor < 7) barra.className = "progress-bar naranja";
      else barra.className = "progress-bar rojo";
    }
    function setFontSize(elem) {
      const [minAge, maxAge] = [0, 100];
      let [minSize, maxSize] = window.innerWidth < 600 ? [1.2, 2.5] : [1.5, 3.5];
      let age = Math.min(Math.max(tamagotchi.edad, minAge), maxAge);
      elem.style.fontSize = minSize + ((age - minAge) / (maxAge - minSize)) * (maxSize - minSize) + "rem";
    }
    function actualizarInfoContainer() {
    const infoContainer = document.getElementById("info-container");
    if (juegoTerminado) return;
    if (infoContainer.style.display === "block") {
    infoContainer.innerHTML = `<strong>${tamagotchi.nombre}</strong><br>
                             Trabajo: ${tamagotchi.trabajo}<br>
                             Edad: ${tamagotchi.edad}<br>
                             Puesto: ${tamagotchi.puesto}<br>
                             Monedas: ${tamagotchi.coins}`;
    }
    }
    function updateStorePrices() {
    // Selecciona el elemento span del producto "Pastilla" en la sección de medicinas
    const pastillaSpan = document.querySelector(".store-section.medicines .store-item span");
    if (pastillaSpan) {
    if (tamagotchi && tamagotchi.edad < 10) {
    pastillaSpan.textContent = "Pastilla - 60 monedas";
    } else {
    pastillaSpan.textContent = "Pastilla - 150 monedas";
    }
    }
    }
    
    
    // Función para actualizar el menú de alimentos dinámico
    function updateFoodMenu() {
    const foodMenu = document.getElementById("food-menu");
    foodMenu.innerHTML = "";
    
    if (tamagotchi.foodInventory.length === 0) {
    foodMenu.innerHTML = "<p>No tienes alimentos comprados.</p>";
    } else {
    // Crear un objeto para contar las ocurrencias de cada producto.
    const foodCounts = {};
    tamagotchi.foodInventory.forEach(food => {
    foodCounts[food] = (foodCounts[food] || 0) + 1;
    });
    
    // Crear un botón por cada producto único
    Object.keys(foodCounts).forEach(food => {
    const btn = document.createElement("button");
    // Mostrar el nombre del producto con la primera letra en mayúscula
    // y añadir " xN" si hay más de uno.
    let displayName = food.charAt(0).toUpperCase() + food.slice(1);
    if (foodCounts[food] > 1) {
      displayName += " x" + foodCounts[food];
    }
    btn.textContent = displayName;
    
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Se usa la jeringuilla si es ese el producto, sino se alimenta o cura con pastilla
      if (food === "pastilla") {
        tamagotchi.tomarPastilla();
      } else if (food === "jeringuilla") {
        tamagotchi.tomarJeringuilla();
      } else {
        tamagotchi.alimentar(food);
      }
      // Eliminar una instancia del producto del inventario
      const index = tamagotchi.foodInventory.indexOf(food);
      if (index !== -1) {
        tamagotchi.foodInventory.splice(index, 1);
      }
      updateFoodMenu();
      actualizarInterfaz();
      document.getElementById("food-menu").style.display = "none";
      enableControls();
    });
    
    foodMenu.appendChild(btn);
    });
    }
    }
    
    
    
    
    function actualizarInterfaz() {
      if (juegoTerminado) return;
      updateFoodMenu();
      actualizarProgreso("progress-hambre", tamagotchi.hambre);
      actualizarProgreso("progress-aburrimiento", tamagotchi.aburrimiento);
      actualizarProgreso("progress-sueno", tamagotchi.sueno);
      actualizarProgreso("progress-higiene", tamagotchi.higiene);
      actualizarMuñeco();
      actualizarNotificaciones();
      actualizarInfoContainer();
      guardarTamagotchi();
    }
    function actualizarMuñeco() {
      const elems = {
        feliz: document.getElementById("tamagochi-feliz"),
        felizCaca: document.getElementById("tamagochi-feliz-caca"),
        normal: document.getElementById("tamagochi"),
        dormido: document.getElementById("tamagochi-domir"),
        caca: document.getElementById("tamagochi_caca"),
        cacaDormido: document.getElementById("tamagochi_caca-domir"),
        sueño: document.getElementById("tamagochi_sueño"),
        sueñoCaca: document.getElementById("tamagochi_sueño_caca"),
        aburrido: document.getElementById("tamagochi_aburrido"),
        aburridoCaca: document.getElementById("tamagochi_aburrido_caca"),
        hambriento: document.getElementById("tamagochi_hambriento"),
        hambrientoCaca: document.getElementById("tamagochi_hambriento_caca"),
        muerto: document.getElementById("tamagochi_muerto")
      };
      Object.values(elems).forEach((e) => e.style.display = "none");
      let preId = "", animation = "";
      let isSucio = tamagotchi.higiene >= 7 || tamagotchi.cagado;
      let isDormido = estaDurmiendo;
      if (tamagotchi.estado === "muerto") {
        preId = "tamagochi_muerto";
      } else if (isDormido) {
        preId = isSucio ? "tamagochi_caca-domir" : "tamagochi-domir";
        animation = "sleeping 1s ease-in-out infinite";
      } else if (tamagotchi.hambre >= 8 || tamagotchi.aburrimiento >= 8 || tamagotchi.sueno >= 8) {
        let valueEffect = 0, effect = "";
        if (tamagotchi.hambre >= 8 && tamagotchi.hambre > valueEffect) { effect = "hambriento"; valueEffect = tamagotchi.hambre; }
        if (tamagotchi.aburrimiento >= 8 && tamagotchi.aburrimiento > valueEffect) { effect = "aburrido"; valueEffect = tamagotchi.aburrimiento; }
        if (tamagotchi.sueno >= 8 && tamagotchi.sueno > valueEffect) { effect = "sueño"; valueEffect = tamagotchi.sueno; }
        preId = "tamagochi_" + effect + (isSucio ? "_caca" : "");
        if (effect === "hambriento") animation = "pulsate 1s ease-in-out infinite";
        else if (effect === "aburrido") animation = "swing 1s ease-in-out infinite";
        else if (effect === "sueño") animation = "sleeping 1s ease-in-out infinite";
      } else {
        preId = "tamagochi-feliz" + (isSucio ? "-caca" : "");
        animation = "happyBounce 2s ease-in-out infinite";
      }
      const elem = document.getElementById(preId);
      if (elem) {
        elem.style.display = "block";
        elem.style.animation = animation;
        setFontSize(elem);
      }
    }
    function actualizarNotificaciones() {
      const container = document.getElementById("notification-container");
      let mensajes = [];
      if (tamagotchi.hambre >= 8.5) mensajes.push(`${tamagotchi.nombre} tiene hambre.`);
      if (tamagotchi.aburrimiento >= 8.5) mensajes.push(`${tamagotchi.nombre} está aburrido.`);
      if (tamagotchi.sueno >= 8.5) mensajes.push(`${tamagotchi.nombre} tiene sueño.`);
      if (tamagotchi.higiene >= 8.5) mensajes.push(`${tamagotchi.nombre} necesita higiene.`);
      if (tamagotchi.enfermo) mensajes.push(`${tamagotchi.nombre} está enfermo.`);
      if (mensajes.length === 0) container.style.display = "none";
      else {
        container.style.display = "block";
        container.innerHTML = "";
        mensajes.forEach((msg) => {
          let div = document.createElement("div");
          div.className = "notification";
          div.textContent = msg;
          container.appendChild(div);
        });
      }
    }
    function mostrarMensajeDeMuerte() {
      clearTimeout(intervaloGlobal);
      if (sleepInterval) clearInterval(sleepInterval);
      if (sleepUpdateInterval) clearInterval(sleepUpdateInterval);
      document.body.classList.remove("sleeping");
      juegoTerminado = true;
      document.getElementById("muñeco-container").style.pointerEvents = "none";
      document.querySelectorAll("button").forEach((btn) => btn.disabled = true);
      actualizarMuñeco();
      const mensaje = `Tu Tamagotchi ha muerto por ${tamagotchi.cause}.<br><br>
                       Información:<br>Nombre: ${tamagotchi.nombre}<br>
                       Trabajo: ${tamagotchi.trabajo}<br>Edad: ${tamagotchi.edad}`;
      const infoContainer = document.getElementById("info-container");
      infoContainer.innerHTML = `<strong>FIN DE JUEGO</strong><br>${mensaje}`;
      infoContainer.style.display = "block";
      guardarTamagotchi();
      localStorage.setItem("gameOver", "true");
      setTimeout(() => { localStorage.clear(); window.location.reload(); }, 10000);
    }
    
    // --- Funciones de Minijuegos ---
    function startMinijuego() {
      minijuegoActivo = true;
      minijuegoScore = 0;
      disableControls();
      document.getElementById("minijuego-container").style.display = "flex";
      document.getElementById("minijuego-instructions").innerText = "¡Presiona 'Saltar' para evitar el obstáculo!";
      const btn = document.getElementById("boton-saltar");
      btn.style.display = "block";
      btn.textContent = "Saltar";
      btn.disabled = false;
      btn.onclick = handleJump;
      obstacleInterval = setInterval(spawnObstacle, 2000);
      collisionInterval = setInterval(checkCollision, 50);
    }
    function spawnObstacle() {
    const gameArea = document.getElementById("minijuego-gamearea");
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    
    // Posicionamiento y dimensiones del obstáculo
    obstacle.style.left = gameArea.offsetWidth + "px"; // Parte derecha del área
    obstacle.style.bottom = "0px"; // Sale desde abajo
    obstacle.style.width = "20px"; // Ancho del obstáculo
    obstacle.style.height = "20px"; // Altura del obstáculo (puedes ajustarlo)
    
    // Aplicar animación para mover el obstáculo de derecha a izquierda
    obstacle.style.animation = "moveObstacle 2s linear forwards";
    
    gameArea.appendChild(obstacle);
    
    obstacle.addEventListener("animationend", () => {
    if (minijuegoActivo && gameArea.contains(obstacle)) {
    minijuegoScore++;
    tamagotchi.aburrimiento = Math.max(0, tamagotchi.aburrimiento - 1);
    document.getElementById("minijuego-instructions").innerText =
      "Puntos: " + minijuegoScore + " | Aburrimiento: " + tamagotchi.aburrimiento.toFixed(1);
    if (tamagotchi.aburrimiento === 0) {
      endMinijuego(true, "diversion");
    } else {
      actualizarInterfaz();
    }
    obstacle.remove();
    }
    });
    }
    
    function handleJump() {
      if (!minijuegoActivo || isJumping) return;
      const character = document.getElementById("game-character");
      isJumping = true;
      character.classList.add("jump");
      setTimeout(() => {
        character.classList.remove("jump");
        isJumping = false;
      }, 500);
    }
    function checkCollision() {
      if (!minijuegoActivo) return;
      const character = document.getElementById("game-character");
      const charRect = character.getBoundingClientRect();
      const obstacles = document.querySelectorAll("#minijuego-gamearea .obstacle");
      obstacles.forEach((obstacle) => {
        const obsRect = obstacle.getBoundingClientRect();
        if (
          obsRect.left < charRect.right &&
          obsRect.right > charRect.left &&
          obsRect.top < charRect.bottom &&
          obsRect.bottom > charRect.top &&
          !isJumping
        ) {
          pauseGameForCollision();
        }
      });
    }
    function pauseGameForCollision() {
      document.querySelectorAll("#minijuego-gamearea .obstacle").forEach((obstacle) => {
        obstacle.style.animationPlayState = "paused";
      });
      clearInterval(obstacleInterval);
      clearInterval(collisionInterval);
      document.getElementById("minijuego-instructions").innerText = "¡Golpeado!";
      setTimeout(() => {
        endMinijuego(false, "diversion");
      }, 3000);
    }
    function startReactionGame() {
      minijuegoActivo = true;
      disableControls();
      const container = document.getElementById("minijuego-container");
      container.style.display = "flex";
      const instructions = document.getElementById("minijuego-instructions");
      instructions.innerText = "Prepárate... espera la señal";
      const btn = document.getElementById("boton-saltar");
      btn.style.display = "none";
      btn.disabled = false;
      let reactionStartTime;
      function handlePrematureClick(e) {
        if (!reactionStartTime) {
          instructions.innerText = "¡Pulsaste antes de tiempo!";
          clearTimeout(timeoutId);
          container.removeEventListener("click", handlePrematureClick);
          setTimeout(() => {
            endMinijuego(false);
            btn.textContent = "Saltar";
            btn.onclick = handleJump;
          }, 2000);
        }
      }
      container.addEventListener("click", handlePrematureClick);
      const delay = Math.floor(Math.random() * 3000) + 2000;
      const timeoutId = setTimeout(() => {
        instructions.innerText = "¡Reacciona!";
        btn.style.display = "block";
        reactionStartTime = Date.now();
        container.removeEventListener("click", handlePrematureClick);
      }, delay);
      btn.onclick = function () {
        if (!reactionStartTime) {
          instructions.innerText = "¡Pulsaste antes de tiempo!";
          clearTimeout(timeoutId);
          container.removeEventListener("click", handlePrematureClick);
          setTimeout(() => {
            endMinijuego(false);
            btn.textContent = "Saltar";
            btn.onclick = handleJump;
          }, 2000);
          return;
        }
        btn.disabled = true;
        const reactionTime = Date.now() - reactionStartTime;
        let reduction = reactionTime <= 200 ? 2 : reactionTime >= 800 ? 0 : 2 * ((800 - reactionTime) / 600);
        tamagotchi.aburrimiento = Math.max(0, tamagotchi.aburrimiento - reduction);
        instructions.innerText = "Tiempo de reacción: " + reactionTime + " ms\nReducción: " + reduction.toFixed(2);
        setTimeout(() => {
          endMinijuego(true);
          btn.textContent = "Saltar";
          btn.onclick = handleJump;
        }, 2000);
      };
    }
    function startShowerGame() {
      const preElements = document.querySelectorAll("#muñeco-container pre");
      preElements.forEach((el) => {
        if (window.getComputedStyle(el).display !== "none")
          el.style.animation = "fadeOut 12s forwards";
      });
      minijuegoActivo = true;
      disableControls();
      document.getElementById("minijuego-container").style.display = "flex";
      const instructions = document.getElementById("minijuego-instructions");
      instructions.innerText = "¡Haz clic en las gotas para ducharlo!";
      const gameArea = document.getElementById("minijuego-gamearea");
      const btn = document.getElementById("boton-saltar");
      btn.style.display = "none";
      btn.disabled = false;
      let dropletsNeeded = 5, clickedCount = 0;
      function spawnDroplet() {
        const droplet = document.createElement("div");
        droplet.classList.add("droplet");
        droplet.style.top = "0px";
        droplet.style.left = Math.random() * (gameArea.offsetWidth - 20) + "px";
        gameArea.appendChild(droplet);
        let startTime = null;
        function animateDroplet(timestamp) {
          if (!startTime) startTime = timestamp;
          let progress = timestamp - startTime;
          droplet.style.top = Math.min(progress / 5, gameArea.offsetHeight - 20) + "px";
          if (progress < 5000) requestAnimationFrame(animateDroplet);
          else { if (gameArea.contains(droplet)) gameArea.removeChild(droplet); }
        }
        requestAnimationFrame(animateDroplet);
        droplet.addEventListener("click", function (e) {
          e.stopPropagation();
          if (gameArea.contains(droplet)) {
            gameArea.removeChild(droplet);
            clickedCount++;
            instructions.innerText = "Gotas: " + clickedCount + " / " + dropletsNeeded;
            if (clickedCount >= dropletsNeeded) {
              clearInterval(showerInterval);
              tamagotchi.higiene = 0;
              tamagotchi.cagado = false;
              tamagotchi.happyLock = false;
              endMinijuego(true, "ducha");
            }
          }
        });
      }
      let showerInterval = setInterval(spawnDroplet, 1000);
      setTimeout(() => {
        clearInterval(showerInterval);
        if (clickedCount < dropletsNeeded) {
          instructions.innerText = "No lograste ducharlo a tiempo.";
          setTimeout(() => { endMinijuego(false, "ducha"); }, 2000);
        }
      }, 15000);
    }
    function endMinijuego(victoria, gameType = null) {
      minijuegoActivo = false;
      clearInterval(obstacleInterval);
      clearInterval(collisionInterval);
      document.querySelectorAll("#minijuego-gamearea .obstacle, #minijuego-gamearea .droplet")
              .forEach((el) => el.remove());
      document.getElementById("minijuego-container").style.display = "none";
      enableControls();
      actualizarInterfaz();
      if (gameType === "ducha") showerAfterGame();
      else if (gameType === "diversion") rotateAfterGame();
    }
    function rotateAfterGame() {
      const preElements = document.querySelectorAll("#muñeco-container pre");
      let current = null;
      preElements.forEach((el) => { if (window.getComputedStyle(el).display !== "none") current = el; });
      if (current) {
        current.style.animation = "rotateEffect 3s linear infinite";
        setTimeout(() => { actualizarMuñeco(); }, 3000);
      }
    }
    function showerAfterGame() {
      const preElements = document.querySelectorAll("#muñeco-container pre");
      preElements.forEach((el) => { el.style.animation = ""; });
      actualizarMuñeco();
      let current = null;
      preElements.forEach((el) => { if (window.getComputedStyle(el).display !== "none") current = el; });
      if (current) {
        current.style.opacity = 0;
        current.style.animation = "fadeIn 3s forwards";
        setTimeout(() => { current.style.opacity = 1; current.style.animation = ""; }, 3000);
      }
    }
    
    // --- Clase Tamagotchi ---
    class Tamagotchi {
      constructor(nombre, trabajo, edadInicial) {
        this.nombre = nombre;
        this.trabajo = trabajo;
        this.edad = edadInicial;
        this.edadInterna = edadInicial;
        this.hambre = 0;
        this.aburrimiento = 0;
        this.sueno = 0;
        this.higiene = 0;
        this.estado = "vivo";
        this.cause = "";
        this.critico = false;
        this.causeCritica = "";
        this.cagado = false;
        this.enfermo = false;
        this.ciclosEnfermo = 0;
        this.pastillaCount = 0;
        this.pastillaDisponible = true;
        this.happyLock = false;
        this.statsHistory = { hambre: [], aburrimiento: [], sueno: [], higiene: [] };
        this.coins = 0;
        this.foodInventory = [];
        this.nivel = 0;
        this.puesto = puestos[this.nivel].nombre;
        this.salarioActual = puestos[this.nivel].sueldo;
        this.consecutiveGoodCycles = 0;
        this.consecutiveFastFood = 0;
    this.consecutiveHealthyFood = 0;
        // Propiedades para ascensos posteriores
        this.lastPromotionAge = edadInicial;
        this.flappyHighScore = 0;
      }
      alimentar(food) {
    const reduction = foodEffects[food] || 0;
    this.hambre = Math.max(0, this.hambre - reduction);
    // Los otros indicadores se modifican de forma fija
    this.aburrimiento = Math.min(10, this.aburrimiento + 0.3);
    this.sueno = Math.min(10, this.sueno + 0.3);
    this.higiene = Math.min(10, this.higiene + 0.3);
    
    // Nueva lógica para contar comidas consecutivas:
    const healthyFoods = ["ensalada", "manzana", "yogurt", "smoothie", "zanahoria"];
    const fastFoods = ["hamburguesa", "pizza", "papas fritas", "refresco", "helado"];
    
    if (fastFoods.includes(food)) {
    // Se consumió comida rápida, se reinicia el contador de comida sana.
    this.consecutiveFastFood = (this.consecutiveFastFood || 0) + 1;
    this.consecutiveHealthyFood = 0;
    if (this.consecutiveFastFood >= 4) {
    this.enfermo = true;
    alert("¡Demasiada comida rápida! Tu Tamagotchi se ha enfermado.");
    // Reiniciamos el contador para evitar múltiples alertas seguidas.
    this.consecutiveFastFood = 0;
    }
    } else if (healthyFoods.includes(food)) {
    // Se consumió comida sana, se reinicia el contador de comida rápida.
    this.consecutiveHealthyFood = (this.consecutiveHealthyFood || 0) + 1;
    this.consecutiveFastFood = 0;
    if (this.consecutiveHealthyFood >= 6) {
    this.enfermo = true;
    alert("¡Demasiada comida sana! Tu Tamagotchi se ha enfermado.");
    this.consecutiveHealthyFood = 0;
    }
    } else {
    // En caso de que el alimento no esté clasificado, se reinician ambos contadores.
    this.consecutiveFastFood = 0;
    this.consecutiveHealthyFood = 0;
    }
    }
    
    
    tomarPastilla() {
    if (this.enfermo) {
    this.hambre = Math.max(0, this.hambre - 1);
    this.aburrimiento = Math.min(10, this.aburrimiento + 0.5);
    this.sueno = Math.min(10, this.sueno + 0.3);
    this.higiene = Math.min(10, this.higiene + 0.3);
    this.pastillaCount++;
    if (this.pastillaCount >= 3) {
    this.enfermo = false;
    this.ciclosEnfermo = 0;
    this.pastillaCount = 0;
    }
    }
    }
    
      tomarJeringuilla() {
    if (this.enfermo) {
    this.enfermo = false;
    this.pastillaCount = 0;
    this.ciclosEnfermo = 0;
    alert("¡Te has curado con la jeringuilla!");
    } else {
    alert("No estás enfermo, la jeringuilla no es necesaria.");
    }
    }
    
      intentarEnfermarse() {
        if (!this.enfermo) {
          let prob = 0;
          if (this.edad < 5) prob = 0.4;
          else if (this.edad < 10) prob = 0.2;
          else if (this.edad < 45) prob = 0.01;
          else if (this.edad < 60) prob = 0.02;
          else if (this.edad < 70) prob = 0.04;
          else if (this.edad < 80) prob = 0.1;
          else if (this.edad < 90) prob = 0.15;
          else if (this.edad < 95) prob = 0.5;
          else if (this.edad < 100) prob = 0.7;
          if (Math.random() < prob) {
            this.enfermo = true;
            this.ciclosEnfermo = 0;
            this.pastillaCount = 0;
            this.pastillaDisponible = true;
          }
        }
      }
      actualizarEstado() {
        this.hambre = Math.min(10, this.hambre + 1);
        this.aburrimiento = Math.min(10, this.aburrimiento + 0.3);
        this.sueno = Math.min(10, this.sueno + 0.2);
        this.higiene = Math.min(10, this.higiene + 0.4);
        if (this.enfermo) {
          this.hambre = Math.min(10, this.hambre + 0.3);
          this.sueno = Math.min(10, this.sueno + 0.2);
          this.higiene = Math.min(10, this.higiene + 0.2);
          this.ciclosEnfermo++;
          this.pastillaDisponible = true;
        } else {
          this.intentarEnfermarse();
        }
        if (this.edad < 10 && !this.cagado) {
          let prob = this.edad < 5 ? 0.5 : 0.2;
          if (Math.random() < prob) {
            this.cagado = true;
            if (this.hambre < 3 && this.aburrimiento < 3 && this.sueno < 3 && this.higiene < 3)
              this.happyLock = true;
          }
        }
        if (this.cagado) {
          this.higiene = Math.min(10, this.higiene + 0.4);
        }
        this.statsHistory.hambre.push(this.hambre);
        this.statsHistory.aburrimiento.push(this.aburrimiento);
        this.statsHistory.sueno.push(this.sueno);
        this.statsHistory.higiene.push(this.higiene);
      }
      actualizarEstadoDormido() {
        this.hambre = Math.min(10, this.hambre + 1);
        this.aburrimiento = Math.min(10, this.aburrimiento + 0.3);
        this.higiene = Math.min(10, this.higiene + 0.4);
        if (this.enfermo) {
          this.hambre = Math.min(10, this.hambre + 0.3);
          this.higiene = Math.min(10, this.higiene + 0.2);
          this.ciclosEnfermo++;
          this.pastillaDisponible = true;
        } else {
          this.intentarEnfermarse();
        }
        if (this.cagado) {
          this.higiene = Math.min(10, this.higiene + 0.4);
        }
        this.statsHistory.hambre.push(this.hambre);
        this.statsHistory.aburrimiento.push(this.aburrimiento);
        this.statsHistory.sueno.push(this.sueno);
        this.statsHistory.higiene.push(this.higiene);
      }
      cumpleAnios() {
        this.edad++;
        const avgHambre = this.statsHistory.hambre.reduce((a, b) => a + b, 0) / this.statsHistory.hambre.length;
        const avgAburrimiento = this.statsHistory.aburrimiento.reduce((a, b) => a + b, 0) / this.statsHistory.aburrimiento.length;
        const avgSueno = this.statsHistory.sueno.reduce((a, b) => a + b, 0) / this.statsHistory.sueno.length;
        const avgHigiene = this.statsHistory.higiene.reduce((a, b) => a + b, 0) / this.statsHistory.higiene.length;
        const mediaStats = (avgHambre + avgAburrimiento + avgSueno + avgHigiene) / 4;
        let ajuste = mediaStats >= 2.0 ? 2 : -0.5;
        this.edadInterna += 1 + ajuste;
        console.log(`[Año: ${this.edad}] Media acumulativa: ${mediaStats.toFixed(2)} | Ajuste: ${ajuste} | Edad Interna: ${this.edadInterna.toFixed(1)}`);
        if (this.edadInterna >= 100) {
          this.estado = "muerto";
          this.cause = "vejez";
          mostrarMensajeDeMuerte();
        }
      }
    }
    function guardarTamagotchi() {
      localStorage.setItem("tamagotchiData", JSON.stringify(tamagotchi));
      localStorage.setItem("ciclosDesdeCumple", ciclosDesdeCumple);
      localStorage.setItem("estaDurmiendo", estaDurmiendo);
    }
    // --- REEMPLAZA TU FUNCIÓN cargarTamagotchi ACTUAL CON ESTA ---

function cargarTamagotchi(data) {
  // Crea una nueva instancia base
  let t = new Tamagotchi(data.nombre, data.trabajo, data.edad);

  // Carga todas las propiedades guardadas
  t.hambre = data.hambre;
  t.aburrimiento = data.aburrimiento;
  t.sueno = data.sueno;
  t.higiene = data.higiene;
  t.estado = data.estado;
  t.cause = data.cause || "";
  t.critico = data.critico || false;
  t.causeCritica = data.causeCritica || "";
  t.cagado = data.cagado || false;
  t.enfermo = data.enfermo || false;
  t.ciclosEnfermo = data.ciclosEnfermo || 0;
  t.pastillaCount = data.pastillaCount || 0;
  t.pastillaDisponible = data.pastillaDisponible !== undefined ? data.pastillaDisponible : true;
  t.happyLock = data.happyLock || false;
  t.edadInterna = data.edadInterna || data.edad; // Usa edadInterna guardada o la edad normal si no existe
  t.statsHistory = data.statsHistory || { hambre: [], aburrimiento: [], sueno: [], higiene: [] }; // Historial
  t.coins = data.coins || 0; // Monedas
  t.foodInventory = data.foodInventory || []; // Inventario de comida

  // --- ¡LA LÍNEA IMPORTANTE QUE FALTABA! ---
  t.objectInventory = data.objectInventory || []; // Carga el inventario de objetos guardado, o un array vacío si no existe

  // Carga datos de nivel y promoción
  t.nivel = data.nivel !== undefined ? data.nivel : 0;
  t.puesto = puestos[t.nivel].nombre; // Asegura que el puesto coincida con el nivel cargado
  t.salarioActual = puestos[t.nivel].sueldo; // Asegura que el salario coincida con el nivel cargado
  t.consecutiveGoodCycles = data.consecutiveGoodCycles || 0;
  t.lastPromotionAge = data.lastPromotionAge !== undefined ? data.lastPromotionAge : t.edad;
  t.flappyHighScore = data.flappyHighScore !== undefined ? data.flappyHighScore : 0;

  // Puedes añadir aquí la carga de otras propiedades si las agregas en el futuro
   t.consecutiveFastFood = data.consecutiveFastFood || 0;
   t.consecutiveHealthyFood = data.consecutiveHealthyFood || 0;


  // Devuelve el objeto Tamagotchi completamente cargado
  return t;
}
    
    // --- Sistema de salarios y ascenso ---
    function actualizarSalario() {
      if (tamagotchi) {
        tamagotchi.salarioActual = puestos[tamagotchi.nivel].sueldo;
        tamagotchi.puesto = puestos[tamagotchi.nivel].nombre;
      }
    }
    function pagarSalario() {
      actualizarSalario();
      tamagotchi.coins += tamagotchi.salarioActual;
      console.log(`Se pagó ${tamagotchi.salarioActual} monedas. Puesto: ${tamagotchi.puesto}`);
    }
    // Ascenso de Pasante a Junior y de Junior en adelante.
    function checkPromotion() {
        if (tamagotchi.nivel === 0) { 
          if (!promotionCheckedThisCycle) {
            if (tamagotchi.hambre < 7 && tamagotchi.sueno < 7 && tamagotchi.higiene < 7 && !tamagotchi.enfermo) {
                console.log("El contador que quiero ver es:"+tamagotchi.consecutiveGoodCycles);
              tamagotchi.consecutiveGoodCycles++;
            } else {
                console.log("El contador fallos es:"+tamagotchi.consecutiveGoodCycles);
              tamagotchi.consecutiveGoodCycles = 0;
            }
            promotionCheckedThisCycle = true;
          }
          
          if (tamagotchi.consecutiveGoodCycles >= 3) {
            tamagotchi.nivel = 1; // Ascenso a Empleado Junior
            actualizarSalario();
            tamagotchi.consecutiveGoodCycles = 0;
            tamagotchi.lastPromotionAge = tamagotchi.edad;
            alert("¡Felicidades! Tu Tamagotchi ha ascendido a Empleado Junior.");
          }
        
    } else if (tamagotchi.nivel === 1) { 
    // Ascenso de Empleado Junior a Empleado Senior
    const avgStats = (tamagotchi.hambre + tamagotchi.aburrimiento + tamagotchi.sueno + tamagotchi.higiene) / 4;
    if ((tamagotchi.edad - tamagotchi.lastPromotionAge) >= 10 &&
      avgStats < 6 &&
      tamagotchi.flappyHighScore >= 30) {
    tamagotchi.nivel = 2; // Ascenso a Empleado Senior
    actualizarSalario();
    tamagotchi.lastPromotionAge = tamagotchi.edad;
    alert("¡Felicidades! Tu Tamagotchi ha ascendido a Empleado Senior.");
    }
    } else if (tamagotchi.nivel === 2) {
    // Ascenso de Empleado Senior a Supervisor
    const avgStats = (tamagotchi.hambre + tamagotchi.aburrimiento + tamagotchi.sueno + tamagotchi.higiene) / 4;
    if ((tamagotchi.edad - tamagotchi.lastPromotionAge) >= 9 &&
      avgStats < 5 &&
      tamagotchi.flappyHighScore >= 60) {
    tamagotchi.nivel = 3; // Ascenso a Supervisor
    actualizarSalario();
    tamagotchi.lastPromotionAge = tamagotchi.edad;
    alert("¡Felicidades! Tu Tamagotchi ha ascendido a Supervisor.");
    }
    } else if (tamagotchi.nivel === 3) {
    // Ascenso de Supervisor a Coordinador
    const avgStats = (tamagotchi.hambre + tamagotchi.aburrimiento + tamagotchi.sueno + tamagotchi.higiene) / 4;
    if ((tamagotchi.edad - tamagotchi.lastPromotionAge) >= 7 &&
      avgStats < 4 &&
      tamagotchi.coins >= 2000 &&
      tamagotchi.flappyHighScore >= 80) {
    tamagotchi.nivel = 4; // Ascenso a Coordinador
    actualizarSalario();
    tamagotchi.lastPromotionAge = tamagotchi.edad;
    alert("¡Felicidades! Tu Tamagotchi ha ascendido a Coordinador.");
    }
    } else if (tamagotchi.nivel === 4) { 
    // Ascenso de Coordinador a Gerente
    const totalStats = tamagotchi.statsHistory.hambre.reduce((a, b) => a + b, 0) +
                     tamagotchi.statsHistory.aburrimiento.reduce((a, b) => a + b, 0) +
                     tamagotchi.statsHistory.sueno.reduce((a, b) => a + b, 0) +
                     tamagotchi.statsHistory.higiene.reduce((a, b) => a + b, 0);
    const count = tamagotchi.statsHistory.hambre.length * 4;
    const globalAvg = totalStats / count;
    
    if ((tamagotchi.edad - tamagotchi.lastPromotionAge) >= 5 &&
      globalAvg < 3.5 &&
      tamagotchi.coins >= 3000 &&
      tamagotchi.flappyHighScore >= 90) {
    tamagotchi.nivel = 5; // Ascenso a Gerente
    actualizarSalario();
    tamagotchi.lastPromotionAge = tamagotchi.edad;
    alert("¡Felicidades! Tu Tamagotchi ha ascendido a Gerente.");
    }
    } else if (tamagotchi.nivel === 5) { 
    // Ascenso de Gerente a Director
    const totalStats = tamagotchi.statsHistory.hambre.reduce((a, b) => a + b, 0) +
                     tamagotchi.statsHistory.aburrimiento.reduce((a, b) => a + b, 0) +
                     tamagotchi.statsHistory.sueno.reduce((a, b) => a + b, 0) +
                     tamagotchi.statsHistory.higiene.reduce((a, b) => a + b, 0);
    const count = tamagotchi.statsHistory.hambre.length * 4;
    const globalAvg = totalStats / count;
    
    if ((tamagotchi.edad - tamagotchi.lastPromotionAge) >= 5 &&
      globalAvg < 2.5 &&
      tamagotchi.coins >= 5000 &&
      tamagotchi.flappyHighScore >= 100) {
    tamagotchi.nivel = 6; // Ascenso a Director
    actualizarSalario();
    tamagotchi.lastPromotionAge = tamagotchi.edad;
    alert("¡Felicidades! Tu Tamagotchi ha ascendido a Director.");
    }
    } else if (tamagotchi.nivel === 6) { 
    // Ascenso de Director a CEO
    const totalStats = tamagotchi.statsHistory.hambre.reduce((a, b) => a + b, 0) +
                     tamagotchi.statsHistory.aburrimiento.reduce((a, b) => a + b, 0) +
                     tamagotchi.statsHistory.sueno.reduce((a, b) => a + b, 0) +
                     tamagotchi.statsHistory.higiene.reduce((a, b) => a + b, 0);
    const count = tamagotchi.statsHistory.hambre.length * 4;
    const globalAvg = totalStats / count;
    
    if ((tamagotchi.edad - tamagotchi.lastPromotionAge) >= 5 &&
      globalAvg < 2.0 &&
      tamagotchi.coins >= 8000 &&
      tamagotchi.flappyHighScore >= 150) {
    tamagotchi.nivel = 7; // Ascenso a CEO
    actualizarSalario();
    tamagotchi.lastPromotionAge = tamagotchi.edad;
    alert("¡Felicidades! Tu Tamagotchi ha ascendido a CEO.");
    }
    }
    }
    
    
    // --- Ciclo de Sueño ---
    function actualizarEstadoDormido() {
      tamagotchi.actualizarEstadoDormido();
      if (tamagotchi.hambre === 10 || tamagotchi.aburrimiento === 10 || tamagotchi.higiene === 10) {
        if (tamagotchi.hambre === 10) tamagotchi.cause = "hambre";
        else if (tamagotchi.aburrimiento === 10) tamagotchi.cause = "aburrimiento extremo";
        else if (tamagotchi.higiene === 10) tamagotchi.cause = "falta de higiene";
        tamagotchi.estado = "muerto";
        mostrarMensajeDeMuerte();
        return;
      }
      ciclosDesdeCumple++;
      if (ciclosDesdeCumple >= 3) {
        tamagotchi.cumpleAnios();
        ciclosDesdeCumple = 0;
      }
      actualizarInterfaz();
    }
    function iniciarCiclosSueño() {
      sleepInterval = setInterval(() => {
        if (tamagotchi.estado === "muerto") {
          mostrarMensajeDeMuerte();
          return;
        }
        actualizarEstadoDormido();
        pagarSalario(); // Se paga salario durante el sueño
    
        // Cobro de impuestos
        contadorCiclosImpuestos++;
        if (contadorCiclosImpuestos >= ciclosParaImpuestos) {
          const impuestoActual = impuestosPorNivel[tamagotchi.nivel] || 0;
          tamagotchi.coins -= impuestoActual;
          showPopup("Se te ha cobrado " + impuestoActual + " monedas por impuestos.", 3000);
          contadorCiclosImpuestos = 0;
        }
        
        // Reiniciamos la verificación de promoción en cada ciclo de sueño
        promotionCheckedThisCycle = false;
        
        // Verificar si se cumplen las condiciones para ascender
        checkPromotion();
      }, tiempoTotalSueñoPersonalizado);
    }
    
    
    
    
    function iniciarSueño() {
      disableControls();
      estaDurmiendo = true;
      document.body.classList.add("sleeping");
      clearTimeout(intervaloGlobal);
      localStorage.removeItem("cycleStart");
      localStorage.setItem("sleepCycleStart", Date.now());
      const startTime = Date.now();
      localStorage.setItem("sleepStart", startTime);
      const initialValue = tamagotchi.sueno;
      const duration = 10000;
      localStorage.setItem("sleepProgress", JSON.stringify({ startTime, initialValue, duration }));
      sleepUpdateInterval = setInterval(updateSleepProgress, 100);
      updateSleepProgress();
      iniciarCiclosSueño();
      guardarTamagotchi();
    }
    function despertar() {
      if (estaDurmiendo) {
        estaDurmiendo = false;
        if (sleepInterval) clearInterval(sleepInterval);
        if (sleepUpdateInterval) clearInterval(sleepUpdateInterval);
        localStorage.removeItem("sleepProgress");
        localStorage.removeItem("sleepCycleStart");
        document.body.classList.remove("sleeping");
        localStorage.setItem("cycleStart", Date.now());
        scheduleNextUpdate();
        enableControls();
        actualizarInterfaz();
        guardarTamagotchi();
      }
    }
    
    // --- Ciclo Normal (despierto) ---
    const impuestosPorNivel = {
    0: 80, // Pasante
    1: 200, // Empleado Junior
    2: 300, // Empleado Senior
    3: 400, // Supervisor
    4: 500, // Coordinador
    5: 600, // Gerente
    6: 800, // Director
    7: 900  // CEO (puedes ajustar este valor)
    };
    
    let contadorCiclosImpuestos = 0;
    const ciclosParaImpuestos = 5; // Cada 5 ciclos se aplican impuestos
    
    function scheduleNextUpdate() {
    clearTimeout(intervaloGlobal);
    
    if (estaDurmiendo) {
    console.log("El personaje está durmiendo, no se programa el ciclo normal.");
    return;
    }
    if (tamagotchi.estado === "muerto") {
    mostrarMensajeDeMuerte();
    return;
    }
    promotionCheckedThisCycle = false;
    let cycleStart = parseInt(localStorage.getItem("cycleStart"));
    if (!cycleStart) {
    cycleStart = Date.now();
    localStorage.setItem("cycleStart", cycleStart);
    }
    const now = Date.now();
    const elapsed = now - cycleStart;
    
    // Calculamos cuántos ciclos completos han pasado mientras estabas desconectado
    const fullCyclesPassed = Math.floor(elapsed / cicloMs);
    if (fullCyclesPassed > 0) {
        console.log("Simulando " + fullCyclesPassed + " ciclos offline.");
        for (let i = 0; i < fullCyclesPassed; i++) {
            console.log("Nuevo ciclo offline iniciado. Reiniciando promotionCheckedThisCycle.");
            promotionCheckedThisCycle = false;
          tamagotchi.actualizarEstado();
          if (tamagotchi.hambre === 10 || tamagotchi.aburrimiento === 10 ||
              tamagotchi.sueno === 10 || tamagotchi.higiene === 10) {
            if (tamagotchi.hambre === 10) tamagotchi.cause = "hambre";
            else if (tamagotchi.aburrimiento === 10) tamagotchi.cause = "insomnio";
            else if (tamagotchi.sueno === 10) tamagotchi.cause = "insomnio";
            else if (tamagotchi.higiene === 10) tamagotchi.cause = "falta de higiene";
            tamagotchi.estado = "muerto";
            mostrarMensajeDeMuerte();
            return;
          }
          contadorCiclosImpuestos++;
          if (contadorCiclosImpuestos >= ciclosParaImpuestos) {
            const impuestoActual = impuestosPorNivel[tamagotchi.nivel] || 0;
            tamagotchi.coins -= impuestoActual;
            showPopup("Se te ha cobrado " + impuestoActual + " monedas por impuestos.", 3000);
            contadorCiclosImpuestos = 0;
          }
          ciclosDesdeCumple++;
          if (ciclosDesdeCumple >= 4) {
            tamagotchi.cumpleAnios();
            ciclosDesdeCumple = 0;
          }
          pagarSalario();
          checkPromotion();
      
          // Al finalizar este ciclo, reiniciamos la verificación para el próximo
          console.log("Nuevo ciclo iniciado. Reiniciando promotionCheckedThisCycle.");
          promotionCheckedThisCycle = false;
        }
        actualizarInterfaz();
        // Reajustamos cycleStart para conservar el tiempo sobrante del ciclo actual
        cycleStart = now - (elapsed % cicloMs);
        localStorage.setItem("cycleStart", cycleStart);
      
        // También, antes de salir del bloque offline, reiniciamos la variable
        promotionCheckedThisCycle = false;
      }
      
    
    const updatedElapsed = now - cycleStart;
    let remainingMs = cicloMs - (updatedElapsed % cicloMs);
    
    console.log("scheduleNextUpdate -> cycleStart:", cycleStart, "now:", now, "updatedElapsed:", updatedElapsed, "remainingMs:", remainingMs);
    
    intervaloGlobal = setTimeout(() => {
    if (tamagotchi.estado === "muerto") {
    mostrarMensajeDeMuerte();
    return;
    }
    tamagotchi.actualizarEstado();
    if (tamagotchi.hambre === 10 || tamagotchi.aburrimiento === 10 ||
      tamagotchi.sueno === 10 || tamagotchi.higiene === 10) {
    if (tamagotchi.hambre === 10) tamagotchi.cause = "hambre";
    else if (tamagotchi.aburrimiento === 10) tamagotchi.cause = "insomnio";
    else if (tamagotchi.sueno === 10) tamagotchi.cause = "insomnio";
    else if (tamagotchi.higiene === 10) tamagotchi.cause = "falta de higiene";
    tamagotchi.estado = "muerto";
    mostrarMensajeDeMuerte();
    return;
    }
    ciclosDesdeCumple++;
    if (ciclosDesdeCumple >= 4) {
    tamagotchi.cumpleAnios();
    ciclosDesdeCumple = 0;
    }
    contadorCiclosImpuestos++;
    if (contadorCiclosImpuestos >= ciclosParaImpuestos) {
    const impuestoActual = impuestosPorNivel[tamagotchi.nivel] || 0;
    tamagotchi.coins -= impuestoActual;
    showPopup("Se te ha cobrado " + impuestoActual + " monedas por impuestos.", 3000);
    contadorCiclosImpuestos = 0;
    }
    pagarSalario();
    checkPromotion();
    actualizarInterfaz();
    localStorage.setItem("cycleStart", Date.now());
    scheduleNextUpdate();
    }, remainingMs);
    }
    
    
    
    
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
      } else if (document.visibilityState === "visible") {
        scheduleNextUpdate();
      }
    });
    
    // --- Inicialización del Juego ---
    // --- REEMPLAZA TODOS LOS BLOQUES "DOMContentLoaded" EXISTENTES CON ESTE ---

// --- REEMPLAZA TODOS LOS BLOQUES "DOMContentLoaded" EXISTENTES CON ESTE (VERSIÓN CON TOGGLE CORREGIDO) ---

// --- REEMPLAZA TODOS LOS BLOQUES "DOMContentLoaded" EXISTENTES CON ESTE (VERSIÓN FINAL CON CAMBIOS SOLICITADOS) ---

// --- REEMPLAZA TODOS LOS BLOQUES "DOMContentLoaded" EXISTENTES CON ESTE (VERSIÓN COMPLETA CON DEBUG BOTONES TIENDA) ---

document.addEventListener("DOMContentLoaded", () => {
  // --- Inicialización de la Interfaz y Carga de Datos ---
  console.log("DOM completamente cargado y parseado.");

  // Ocultar menús y overlays inicialmente
  document.getElementById("work-menu").style.display = "none";
  document.getElementById("clean-menu").style.display = "none";
  document.getElementById("game-menu").style.display = "none";
  document.getElementById("food-menu").style.display = "none";
  document.getElementById("minijuego-container").style.display = "none";
  document.getElementById("store-overlay").style.display = "none";
  document.getElementById("inventory-overlay").style.display = "none";
  document.getElementById("store-food").style.display = "none"; // Ocultar sección comida tienda por defecto
  document.getElementById("store-objects").style.display = "none"; // Ocultar sección objetos tienda por defecto
  document.getElementById("admin-overlay").style.display = "none";

  const menuContainer = document.querySelector(".menu-container");
  const gameContainer = document.querySelector(".tamagochi-container");
  const startBtn = document.getElementById("start-game");
  const storedData = localStorage.getItem("tamagotchiData");

  // --- Lógica de Carga de Datos (sin cambios) ---
  if (storedData) {
      console.log("Cargando datos guardados...");
      tamagotchi = cargarTamagotchi(JSON.parse(storedData));
      ciclosDesdeCumple = parseInt(localStorage.getItem("ciclosDesdeCumple")) || 0;
      estaDurmiendo = localStorage.getItem("estaDurmiendo") === "true";
      const cycleStart = localStorage.getItem("cycleStart");
      if (estaDurmiendo) {
          console.log("El Tamagotchi estaba durmiendo. Calculando progreso offline.");
          document.body.classList.add("sleeping");
          let sleepCycleStart = parseInt(localStorage.getItem("sleepCycleStart"));
          if (sleepCycleStart) {
              let elapsed = Date.now() - sleepCycleStart;
              let cyclesElapsed = Math.floor(elapsed / tiempoTotalSueñoPersonalizado);
              let remainder = elapsed % tiempoTotalSueñoPersonalizado;
              for (let i = 0; i < cyclesElapsed; i++) { /* ... simulación sueño offline ... */
                  tamagotchi.actualizarEstadoDormido(); pagarSalario(); contadorCiclosImpuestos++;
                  if (contadorCiclosImpuestos >= ciclosParaImpuestos) { const imp = impuestosPorNivel[tamagotchi.nivel] || 0; tamagotchi.coins -= imp; contadorCiclosImpuestos = 0; }
                  promotionCheckedThisCycle = false; checkPromotion(); ciclosDesdeCumple++;
                  if (ciclosDesdeCumple >= 3) { tamagotchi.cumpleAnios(); ciclosDesdeCumple = 0; }
              }
              localStorage.setItem("sleepCycleStart", Date.now() - remainder);
              let sleepStart = parseInt(localStorage.getItem("sleepStart"));
              if (sleepStart) { /* ... actualizar barra sueño offline ... */
                  let sleepElapsed = Date.now() - sleepStart; const sleepDuration = 10000;
                  if (sleepElapsed >= sleepDuration) { tamagotchi.sueno = 0; localStorage.removeItem("sleepProgress"); }
                  else { const d = JSON.parse(localStorage.getItem("sleepProgress")); const iV = d?.initialValue !== undefined ? d.initialValue : tamagotchi.sueno; const p = Math.min(sleepElapsed / sleepDuration, 1); tamagotchi.sueno = Math.max(0, iV * (1 - p)); const uST = Date.now() - sleepElapsed; localStorage.setItem("sleepProgress", JSON.stringify({ startTime: uST, initialValue: iV, duration: sleepDuration })); }
              }
          }
          disableControls(); iniciarCiclosSueño(); sleepUpdateInterval = setInterval(updateSleepProgress, 100);
      } else if (cycleStart) { console.log("El Tamagotchi estaba despierto. Calculando progreso offline."); scheduleNextUpdate(); }
      else { console.log("No hay datos de ciclo guardados, iniciando ciclo normal."); localStorage.setItem("cycleStart", Date.now()); scheduleNextUpdate(); }
      menuContainer.style.display = "none"; gameContainer.style.display = "flex";
      actualizarInterfaz(); updateStorePrices();
      if (tamagotchi.estado === "muerto") { mostrarMensajeDeMuerte(); }
  } else { console.log("No hay datos guardados, mostrando menú de inicio."); menuContainer.style.display = "block"; gameContainer.style.display = "none"; }

  // --- Listeners de Botones y Elementos Interactivos ---

  // Botón Iniciar Juego
  if (startBtn) { /* ... listener startBtn sin cambios ... */
      startBtn.addEventListener("click", () => {
          const n = document.getElementById("nombre").value, t = document.getElementById("trabajo").value, e = parseInt(document.getElementById("edad").value) || 0;
          if (!n || !t || isNaN(e)) { alert("Por favor, completa todos los campos correctamente."); return; }
          tamagotchi = new Tamagotchi(n, t, e); ciclosDesdeCumple = 0; estaDurmiendo = false; localStorage.clear(); localStorage.setItem("cycleStart", Date.now());
          actualizarInterfaz(); updateStorePrices(); menuContainer.style.display = "none"; gameContainer.style.display = "flex"; scheduleNextUpdate(); guardarTamagotchi();
      });
  }

  // Contenedor del Muñeco (Click, Long Press, Multi-Tap)
  const muñecoContainer = document.getElementById("muñeco-container");
  if (muñecoContainer) { /* ... listener muñecoContainer sin cambios ... */
      let longPressTimer; let adminTapCount = 0; let adminTapTimeout;
      muñecoContainer.addEventListener("click", () => {
           if (minijuegoActivo) return; if (estaDurmiendo) { despertar(); return; }
           if (tamagotchi && tamagotchi.estado !== "muerto") { const iC = document.getElementById("info-container"); const iV = iC.style.display === "block"; iC.style.display = iV ? "none" : "block"; if (!iV) { actualizarInfoContainer(); } }
           adminTapCount++; if (adminTapCount === 1) { adminTapTimeout = setTimeout(() => { adminTapCount = 0; }, 2000); }
           if (adminTapCount === 10) { clearTimeout(adminTapTimeout); adminTapCount = 0; if (tamagotchi && tamagotchi.nombre === "Carlos") { const aO = document.getElementById("admin-overlay"); if (aO) { actualizarAdminVidaInterna(); aO.style.display = "block"; disableControls(); } } }
      });
      const startLP = (e) => { if (estaDurmiendo || minijuegoActivo || tamagotchi?.estado === "muerto") return; if (e.type === 'touchstart') e.preventDefault(); clearTimeout(longPressTimer); longPressTimer = setTimeout(showWorkMenu, 3000); };
      const cancelLP = () => { clearTimeout(longPressTimer); };
      muñecoContainer.addEventListener("mousedown", startLP); muñecoContainer.addEventListener("touchstart", startLP, { passive: false });
      muñecoContainer.addEventListener("mouseup", cancelLP); muñecoContainer.addEventListener("mouseleave", cancelLP);
      muñecoContainer.addEventListener("touchend", cancelLP); muñecoContainer.addEventListener("touchcancel", cancelLP);
  }

  // Botones de Acción Principal
  document.getElementById("btn-hambre")?.addEventListener("click", (e) => { e.stopPropagation(); if (tamagotchi?.estado !== "muerto" && !estaDurmiendo) { updateFoodMenu(); toggleMenu("food-menu"); } });
  document.getElementById("btn-aburrimiento")?.addEventListener("click", (e) => { e.stopPropagation(); if (tamagotchi?.estado !== "muerto" && !estaDurmiendo) toggleMenu("game-menu"); });
  document.getElementById("btn-sueno")?.addEventListener("click", (e) => { e.stopPropagation(); if (tamagotchi?.estado !== "muerto" && !estaDurmiendo) { iniciarSueño(); actualizarInterfaz(); } });
  document.getElementById("btn-higiene")?.addEventListener("click", (e) => { e.stopPropagation(); if (tamagotchi?.estado !== "muerto" && !estaDurmiendo) toggleMenu("clean-menu"); });

  // Botones dentro de los Menús Desplegables
  document.getElementById("juego-saltar")?.addEventListener("click", (e) => { e.stopPropagation(); document.getElementById("game-menu").style.display = "none"; if (!estaDurmiendo) startMinijuego(); });
  document.getElementById("juego-reaccion")?.addEventListener("click", (e) => { e.stopPropagation(); document.getElementById("game-menu").style.display = "none"; if (!estaDurmiendo) startReactionGame(); });
  document.getElementById("juego-ducha")?.addEventListener("click", (e) => { e.stopPropagation(); document.getElementById("clean-menu").style.display = "none"; if (!estaDurmiendo) startShowerGame(); });
  document.getElementById("boton-saltar")?.addEventListener("click", (e) => { e.stopPropagation(); });

  // Menú de Trabajo (Cierre solo con 'X')
  document.getElementById("close-work-menu")?.addEventListener("click", (e) => {
      e.stopPropagation(); document.getElementById("work-menu").style.display = "none";
      if (!estaDurmiendo && !minijuegoActivo && getComputedStyle(document.getElementById("store-overlay")).display === 'none' && getComputedStyle(document.getElementById("inventory-overlay")).display === 'none' && getComputedStyle(document.getElementById("admin-overlay")).display === 'none') { enableControls(); }
  });
  document.getElementById("btn-flappy")?.addEventListener("click", (e) => { e.stopPropagation(); document.getElementById("work-menu").style.display = "none"; if (!estaDurmiendo) startFlappyGame(); });
 
  document.getElementById("btn-requisitos")?.addEventListener("click", (e) => {
    e.stopPropagation();
    mostrarRequisitosAscenso();
});

  // --- Tienda (Interruptor / Toggle y Listeners Compra con DEBUG) ---
  const storeIcon = document.getElementById("store-icon");
  const storeOverlay = document.getElementById("store-overlay");
  if (storeIcon && storeOverlay) {
      storeIcon.addEventListener("click", function(e) {
          e.stopPropagation(); if (estaDurmiendo || minijuegoActivo) return;
          const isVisible = getComputedStyle(storeOverlay).display === "block";
          if (isVisible) { storeOverlay.style.display = "none"; if (getComputedStyle(document.getElementById("inventory-overlay")).display === 'none') { enableControls(); } }
          else { updateStorePrices(); storeOverlay.style.display = "block"; disableControls(); if(getComputedStyle(document.getElementById("store-food")).display === 'none' && getComputedStyle(document.getElementById("store-objects")).display === 'none') { document.getElementById("store-food").style.display = "block"; } }
      });
  }
  // Botones secciones tienda
  document.getElementById("btn-store-comida")?.addEventListener("click", function(e) { e.stopPropagation(); document.getElementById("store-food").style.display = "block"; document.getElementById("store-objects").style.display = "none"; });
  document.getElementById("btn-store-objetos")?.addEventListener("click", function(e) { e.stopPropagation(); document.getElementById("store-food").style.display = "none"; document.getElementById("store-objects").style.display = "block"; });

  // --- Listeners Botones Compra (CON DEBUG DETALLADO) ---
  // Botones de Compra (Comida y Medicinas)
  console.log("Asignando listeners a botones de compra de comida/medicina...");
  document.querySelectorAll("#store-food .buy-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
          console.log("Botón Comprar Comida/Medicina clickeado:", btn);
          e.stopPropagation();
          if (!tamagotchi) { console.error("Tamagotchi no definido al intentar comprar."); return; }
          const storeItem = btn.closest(".store-item");
          if (!storeItem) { console.error("No se encontró .store-item ancestro."); return; }
          const spanElement = storeItem.querySelector("span");
          if (!spanElement) { console.error("No se encontró span dentro de .store-item"); return; }
          const spanText = spanElement.textContent;
          console.log("Texto del Span:", spanText);
          const productNameMatch = spanText.match(/^([a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+)\s*-/i);
          const costMatch = spanText.match(/(\d+)\s*monedas/i);
          if (!productNameMatch || !costMatch) { console.error("Error al parsear nombre o costo con Regex:", spanText); alert("Error al leer la información del producto."); return; }
          let productName = productNameMatch[1].trim().toLowerCase();
          let cost = parseInt(costMatch[1], 10);
          console.log(`Parseado -> Nombre: '${productName}', Costo: ${cost}`);
          if (isNaN(cost)) { console.error("El costo parseado no es un número:", cost); alert("Error al leer el costo del producto."); return; }
          if (tamagotchi.coins < cost) { console.log(`Monedas insuficientes: ${tamagotchi.coins} < ${cost}`); alert("No tienes suficientes monedas."); return; }
          console.log(`Comprando: ${productName} por ${cost} monedas.`);
          tamagotchi.coins -= cost;
          if (!tamagotchi.foodInventory) tamagotchi.foodInventory = [];
          tamagotchi.foodInventory.push(productName);
          guardarTamagotchi(); actualizarInterfaz(); showPopup(`Has comprado ${productName}.`);
      });
  });
  console.log("Listeners de comida/medicina asignados.");

   // Botones de Compra (Objetos)
   console.log("Asignando listeners a botones de compra de objetos...");
   document.querySelectorAll("#store-objects .store-item").forEach(item => {
       const buyButton = item.querySelector("button.buy-btn");
       const spanElement = item.querySelector("span");
       if (buyButton && spanElement) {
           buyButton.addEventListener("click", (e) => {
              console.log("Botón Comprar Objeto clickeado:", buyButton);
              e.stopPropagation();
              if (!tamagotchi) { console.error("Tamagotchi no definido al intentar comprar objeto."); return; }
              const text = spanElement.textContent;
              console.log("Texto del Span (Objeto):", text);
               const parts = text.split(" - ");
               if (parts.length < 2) { console.error("Formato incorrecto (split no funcionó):", text); alert("Error al leer información del objeto."); return; }
               const nombre = parts[0].trim();
               const costString = parts[1].replace(/monedas/i, "").trim();
               const costo = parseInt(costString, 10);
               console.log(`Parseado -> Nombre: '${nombre}', Costo String: '${costString}', Costo Num: ${costo}`);
               if (isNaN(costo)) { console.error("El costo parseado del objeto no es un número:", costo); alert("Error al leer el costo del objeto."); return; }
               console.log(`Intentando comprar objeto: ${nombre} | Costo: ${costo}`);
               comprarObjeto(nombre, costo); // Llama a la función global
               showPopup(`Has comprado ${nombre}.`);
           });
       } else { console.warn("No se encontró botón de compra o span en el item de tienda de objetos:", item); }
   });
   console.log("Listeners de objetos asignados.");
  // --- FIN Listeners Botones Compra ---


  // --- Inventario de Objetos (Interruptor / Toggle) ---
  const inventoryIcon = document.getElementById("inventory-icon");
  const inventoryOverlay = document.getElementById("inventory-overlay");
  const closeInventory = document.getElementById("close-inventory");
  if (inventoryIcon && inventoryOverlay) { /* ... listener icono inventario sin cambios ... */
      inventoryIcon.addEventListener("click", (e) => {
          e.stopPropagation(); if (estaDurmiendo || minijuegoActivo) return;
          const isVisible = getComputedStyle(inventoryOverlay).display === "block";
          if (isVisible) { inventoryOverlay.style.display = "none"; if (getComputedStyle(document.getElementById("store-overlay")).display === 'none') { enableControls(); } }
          else { populateInventoryList(); inventoryOverlay.style.display = "block"; disableControls(); }
      });
  }
  if (closeInventory && inventoryOverlay) { /* ... listener botón cerrar inventario sin cambios ... */
      closeInventory.addEventListener("click", (e) => {
          e.stopPropagation(); inventoryOverlay.style.display = "none";
          if (getComputedStyle(document.getElementById("store-overlay")).display === 'none') { if (!estaDurmiendo && !minijuegoActivo) enableControls(); }
      });
  }

  // --- Menú Admin --- (Sin cambios en su lógica interna)
  document.getElementById("admin-close")?.addEventListener("click", () => { /* ... listener admin-close ... */
      document.getElementById("admin-overlay").style.display = "none"; if (!estaDurmiendo && !minijuegoActivo && getComputedStyle(document.getElementById("store-overlay")).display === 'none' && getComputedStyle(document.getElementById("inventory-overlay")).display === 'none') { enableControls(); }
  });
  document.getElementById("reset-stats")?.addEventListener("click", () => { /* ... */ });
  document.getElementById("admin-work-position")?.addEventListener("change", (e) => { /* ... */ });
  document.getElementById("admin-edad-aceptar")?.addEventListener("click", (e) => { /* ... */ });


  // --- Cerrar Menús/Overlays al hacer clic fuera (MODIFICADO para no cerrar work-menu) ---
   document.addEventListener("click", function (e) {
      const menusToCloseOnClickOutside = ["food-menu", "clean-menu", "game-menu"]; // Excluye work-menu
      let clickedInsideInteractiveElement = false;
      const interactiveAreas = ["#food-menu", "#clean-menu", "#game-menu", "#work-menu", "#store-overlay", "#inventory-overlay", "#admin-overlay", "#store-icon", "#inventory-icon", ".buttons-container", "#muñeco-container"];
      for (const area of interactiveAreas) { if (e.target.closest(area)) { clickedInsideInteractiveElement = true; break; } }

      if (!clickedInsideInteractiveElement) {
          let somethingClosed = false;
          menusToCloseOnClickOutside.forEach(id => { const m = document.getElementById(id); if (m && getComputedStyle(m).display === "block") { m.style.display = "none"; somethingClosed = true; } });
           const sO = document.getElementById("store-overlay"); if (sO && getComputedStyle(sO).display === 'block') { sO.style.display = 'none'; somethingClosed = true; }
           const iO = document.getElementById("inventory-overlay"); if (iO && getComputedStyle(iO).display === 'block') { iO.style.display = 'none'; somethingClosed = true; }
           if (somethingClosed && !estaDurmiendo && !minijuegoActivo && getComputedStyle(document.getElementById("store-overlay")).display === 'none' && getComputedStyle(document.getElementById("inventory-overlay")).display === 'none' && getComputedStyle(document.getElementById("admin-overlay")).display === 'none' && getComputedStyle(document.getElementById("work-menu")).display === 'none') { enableControls(); }
      }
   });

   // Evitar que clics dentro de los menús/overlays los cierren (propagación)
   ["food-menu", "clean-menu", "game-menu", "work-menu", "store-overlay", "inventory-overlay", "admin-overlay"].forEach((id) => {
       document.getElementById(id)?.addEventListener("click", (e) => e.stopPropagation());
   });

  console.log("Listeners de DOMContentLoaded asignados.");

}); // --- FIN DEL BLOQUE DOMContentLoaded ---
    
    function showWorkMenu() {
        disableControls();
        document.getElementById("work-menu").style.display = "block";
      }
    
    // --- Funciones para el juego Flappy Bird ---
    let flappyGameRunning = false;
    let flappyBird, flappyObstacles = [], flappyScore = 0, flappyLastObstacleTime = 0;
    let flappyGameArea, flappyGameRequest;
    flappyEnded = false;
    function startFlappyGame() {
        flappyEnded = false;
        
        // Oculta la interfaz principal y el menú de trabajo
        document.querySelector(".tamagochi-container").style.display = "none";
        document.getElementById("work-menu").style.display = "none";
        
        // Muestra el área de juego de Flappy Bird
        const flappyGame = document.getElementById("flappy-game");
        flappyGame.style.display = "block";
        
        // Reinicia variables del juego
        flappyGameRunning = false;
        flappyScore = 0;
        flappyObstacles = [];
        flappyLastObstacleTime = Date.now();
        
        // Posiciona el pájaro en el centro vertical del juego
        flappyBird = document.getElementById("flappy-bird");
        const gameHeight = flappyGame.offsetHeight;
        birdY = gameHeight / 2;
        birdVelocity = 0;
        flappyBird.style.top = birdY + "px";
        
        // Elimina obstáculos existentes de partidas anteriores
        const existingObstacles = document.querySelectorAll(".obstacle-flappy");
        existingObstacles.forEach(obs => obs.remove());
        
        // Muestra la superposición de inicio
        const startOverlay = document.getElementById("flappy-start-overlay");
        startOverlay.style.display = "flex";
        
        // Espera a que el usuario haga clic para iniciar el juego
        startOverlay.addEventListener("click", function startListener(e) {
          startOverlay.style.display = "none";
          startOverlay.removeEventListener("click", startListener);
          
          // Agrega eventos para que el pájaro salte al hacer clic o tocar
          flappyGame.addEventListener("mousedown", flappyFlap);
          flappyGame.addEventListener("touchstart", flappyFlap);
          
          flappyGameRunning = true;
          
          // Reinicia lastTimestamp y arranca el loop usando requestAnimationFrame
          lastTimestamp = null;
          requestAnimationFrame(flappyGameLoop);
        });
      }
      
      let lastTimestamp = null;  // Variable global para almacenar el timestamp del último frame
    
      function flappyGameLoop(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        
        // Obtenemos el elemento del juego
        const flappyGame = document.getElementById("flappy-game");
        if (!flappyGame) {
          console.error("No se encontró el elemento 'flappy-game'.");
          return;
        }
        
        // Usamos un factor ajustado; aquí lo hacemos con delta/10 en vez de delta/16.67
        const factor = delta / 8; // Experimenta con este divisor
        
        // Actualizamos la física
        birdVelocity += gravity * factor;
        birdY += birdVelocity * factor;
        flappyBird.style.top = birdY + "px";
        
        // Verifica límites del pájaro
        if (birdY < 0 || birdY + flappyBird.offsetHeight > flappyGame.offsetHeight) {
          endFlappyGame();
          return;
        }
        
        // Creamos obstáculos cada 2000ms
        if (Date.now() - flappyLastObstacleTime > 2000) {
          createFlappyObstacles();
          flappyLastObstacleTime = Date.now();
        }
        
        // Actualizamos cada obstáculo
        flappyObstacles.forEach((obs, index) => {
          obs.x -= obstacleSpeed * factor;
          obs.element.style.left = obs.x + "px";
          
          // Si el obstáculo superior ha pasado al pájaro, sumamos punto
          if (obs.type === "top" && !obs.passed && obs.x + obs.width < flappyBird.offsetLeft) {
            obs.passed = true;
            flappyScore++;
          }
          
          if (checkFlappyCollision(obs)) {
            endFlappyGame();
            return;
          }
          
          if (obs.x + obs.width < 0) {
            obs.element.remove();
            flappyObstacles.splice(index, 1);
          }
        });
        
        requestAnimationFrame(flappyGameLoop);
      }
      
      
    function flappyFlap() {
      birdVelocity = jumpImpulse;
    }
    // MODIFICACIÓN: Función para crear obstáculos de Flappy Bird con un gap para esquivar
    function createFlappyObstacles() {
      const flappyGame = document.getElementById("flappy-game");
      const gap = 240; // Tamaño del espacio entre obstáculos
      const gameHeight = flappyGame.offsetHeight;
      const gameWidth = flappyGame.offsetWidth;
      const topObstacleHeight = Math.floor(Math.random() * (gameHeight - gap - 50)) + 50;
      const bottomObstacleHeight = gameHeight - gap - topObstacleHeight;
      
      // Obstáculo superior
      const topObstacle = document.createElement("div");
      topObstacle.classList.add("obstacle-flappy");
      topObstacle.style.height = topObstacleHeight + "px";
      topObstacle.style.width = "60px";
      topObstacle.style.left = gameWidth + "px";
      topObstacle.style.top = "0px";
      flappyGame.appendChild(topObstacle);
      
      // Obstáculo inferior
      const bottomObstacle = document.createElement("div");
      bottomObstacle.classList.add("obstacle-flappy");
      bottomObstacle.style.height = bottomObstacleHeight + "px";
      bottomObstacle.style.width = "60px";
      bottomObstacle.style.left = gameWidth + "px";
      bottomObstacle.style.top = (topObstacleHeight + gap) + "px";
      flappyGame.appendChild(bottomObstacle);
      
      // Se añade el obstáculo superior (usado para contar puntos) y el inferior
      flappyObstacles.push({ element: topObstacle, x: gameWidth, width: 60, type: "top", passed: false });
      flappyObstacles.push({ element: bottomObstacle, x: gameWidth, width: 60, type: "bottom", passed: false });
    }
    function checkFlappyCollision(obs) {
      const birdRect = flappyBird.getBoundingClientRect();
      const obsRect = obs.element.getBoundingClientRect();
      return !(birdRect.right < obsRect.left ||
               birdRect.left > obsRect.right ||
               birdRect.bottom < obsRect.top ||
               birdRect.top > obsRect.bottom);
    }
    // MODIFICACIÓN: endFlappyGame actualizada para mostrar el record y verificar ascenso.
    function endFlappyGame() {
    if (flappyEnded) return; // Evita que se ejecute varias veces
    flappyEnded = true;
    flappyGameRunning = false;
    cancelAnimationFrame(flappyGameRequest);
    if (flappyScore > tamagotchi.flappyHighScore) {
    tamagotchi.flappyHighScore = flappyScore;
    }
    alert("Flappy Bird finalizado.\nPuntuación: " + flappyScore + "\nRecord: " + tamagotchi.flappyHighScore);
    document.getElementById("flappy-game").style.display = "none";
    document.querySelector(".tamagochi-container").style.display = "flex";
    enableControls(); // Activa los botones al volver al Tamagotchi
    checkPromotion();
    }
    
    function mostrarRequisitosAscenso() {
    const display = document.getElementById("requisitos-display");
    // Si ya hay contenido, lo borramos para simular el toggle
    if (display.innerHTML.trim() !== "") {
    display.innerHTML = "";
    return;
    }
    
    let requisitosList = [];
    // Calcula el promedio de indicadores y la diferencia de edad
    const avgStats = (tamagotchi.hambre + tamagotchi.aburrimiento + tamagotchi.sueno + tamagotchi.higiene) / 4;
    const diffEdad = tamagotchi.edad - tamagotchi.lastPromotionAge;
    
    switch(tamagotchi.nivel) {
    case 0:
    requisitosList.push({
      text: "Niveles de hambre, sueño e higiene por debajo de 7",
      cumplido: tamagotchi.hambre < 7 && tamagotchi.sueno < 7 && tamagotchi.higiene < 7
    });
    requisitosList.push({
      text: "No estar enfermo",
      cumplido: !tamagotchi.enfermo
    });
    requisitosList.push({
      text: "Acumular 3 ciclos de buen desempeño",
      cumplido: tamagotchi.consecutiveGoodCycles >= 3
    });
    break;
    case 1:
    requisitosList.push({
      text: "Haber pasado al menos 10 años desde el último ascenso",
      cumplido: diffEdad >= 10
    });
    requisitosList.push({
      text: "Promedio de indicadores menor a 6",
      cumplido: avgStats < 6
    });
    requisitosList.push({
      text: "Conseguir al menos 30 puntos en Flappy Bird",
      cumplido: tamagotchi.flappyHighScore >= 30
    });
    break;
    case 2:
    requisitosList.push({
      text: "Haber pasado al menos 9 años desde el último ascenso",
      cumplido: diffEdad >= 9
    });
    requisitosList.push({
      text: "Promedio de indicadores menor a 5",
      cumplido: avgStats < 5
    });
    requisitosList.push({
      text: "Conseguir al menos 60 puntos en Flappy Bird",
      cumplido: tamagotchi.flappyHighScore >= 60
    });
    break;
    case 3:
    requisitosList.push({
      text: "Haber pasado al menos 7 años desde el último ascenso",
      cumplido: diffEdad >= 7
    });
    requisitosList.push({
      text: "Promedio de indicadores menor a 4",
      cumplido: avgStats < 4
    });
    requisitosList.push({
      text: "Contar con al menos 2000 monedas",
      cumplido: tamagotchi.coins >= 2000
    });
    requisitosList.push({
      text: "Conseguir al menos 80 puntos en Flappy Bird",
      cumplido: tamagotchi.flappyHighScore >= 80
    });
    break;
    case 4:
    requisitosList.push({
      text: "Haber pasado al menos 5 años desde el último ascenso",
      cumplido: diffEdad >= 5
    });
    requisitosList.push({
      text: "Promedio global de indicadores menor a 3.5",
      cumplido: avgStats < 3.5
    });
    requisitosList.push({
      text: "Contar con al menos 3000 monedas",
      cumplido: tamagotchi.coins >= 3000
    });
    requisitosList.push({
      text: "Conseguir al menos 90 puntos en Flappy Bird",
      cumplido: tamagotchi.flappyHighScore >= 90
    });
    break;
    case 5:
    requisitosList.push({
      text: "Haber pasado al menos 5 años desde el último ascenso",
      cumplido: diffEdad >= 5
    });
    requisitosList.push({
      text: "Promedio global de indicadores menor a 2.5",
      cumplido: avgStats < 2.5
    });
    requisitosList.push({
      text: "Contar con al menos 5000 monedas",
      cumplido: tamagotchi.coins >= 5000
    });
    requisitosList.push({
      text: "Conseguir al menos 100 puntos en Flappy Bird",
      cumplido: tamagotchi.flappyHighScore >= 100
    });
    break;
    case 6:
    requisitosList.push({
      text: "Haber pasado al menos 5 años desde el último ascenso",
      cumplido: diffEdad >= 5
    });
    requisitosList.push({
      text: "Promedio global de indicadores menor a 2.0",
      cumplido: avgStats < 2.0
    });
    requisitosList.push({
      text: "Contar con al menos 8000 monedas",
      cumplido: tamagotchi.coins >= 8000
    });
    requisitosList.push({
      text: "Conseguir al menos 150 puntos en Flappy Bird",
      cumplido: tamagotchi.flappyHighScore >= 150
    });
    break;
    case 7:
    requisitosList.push({
      text: "¡Ya eres el CEO! No hay más ascensos.",
      cumplido: true
    });
    break;
    default:
    requisitosList.push({
      text: "No se han definido requisitos para tu puesto actual.",
      cumplido: false
    });
    }
    
    // Construye el HTML con una lista; los requisitos cumplidos se mostrarán tachados
    let html = "<ul style='list-style: none; padding: 0;'>";
    requisitosList.forEach(item => {
    html += "<li>" + (item.cumplido ? "<s>" + item.text + "</s>" : item.text) + "</li>";
    });
    html += "</ul>";
    
    display.innerHTML = html;
    /* document.getElementById("btn-requisitos").addEventListener("click", mostrarRequisitosAscenso); */
    }
    
    
    // --- Resto de la lógica (guardar, cargar, eventos, etc.) ---
    // Se mantiene lo establecido en el código original.
    let adminTapCount = 0;
let adminTapTimeout;

function resetAdminTap() {
  adminTapCount = 0;
  clearTimeout(adminTapTimeout);
}

document.getElementById("muñeco-container").addEventListener("click", () => {
  adminTapCount++;
  if (adminTapCount === 1) {
    adminTapTimeout = setTimeout(resetAdminTap, 2000); // 2 segundos para la secuencia
  }
  
  // Si se detectan 10 pulsaciones en el lapso, se muestra el menú de admin solo si el nombre es "Carlos"
  if (adminTapCount === 10) {
    resetAdminTap();
    if (tamagotchi && tamagotchi.nombre === "Carlos") {
      const adminOverlay = document.getElementById("admin-overlay");
      if (adminOverlay) {
        actualizarAdminVidaInterna(); // Actualiza la vida interna antes de mostrar
        adminOverlay.style.display = "block";
      }
    } 
  }
  
});
document.getElementById("admin-close").addEventListener("click", () => {
  document.getElementById("admin-overlay").style.display = "none";
});


// Listener para resetear todas las stats a 0
document.getElementById("reset-stats").addEventListener("click", () => {
    if (!tamagotchi) return;
    tamagotchi.hambre = 0;
    tamagotchi.aburrimiento = 0;
    tamagotchi.sueno = 0;
    tamagotchi.higiene = 0;
    actualizarInterfaz();
    guardarTamagotchi();
    alert("¡Tus stats se han reseteado a 0!");
  });
  
  // Listener para cambiar de puesto (ascender) al seleccionar un trabajo en el menú de admin
  document.getElementById("admin-work-position").addEventListener("change", (e) => {
    if (!tamagotchi) return;
    // Suponemos que el valor del option es el índice correspondiente en el array "puestos"
    const nuevoNivel = parseInt(e.target.value);
    tamagotchi.nivel = nuevoNivel;
    actualizarSalario(); // Actualiza puesto y salario
    guardarTamagotchi();
    alert("Ascendido a " + puestos[nuevoNivel].nombre);
  });
// Función para actualizar el display de la vida interna en el menú admin
function actualizarAdminVidaInterna() {
  const span = document.getElementById("admin-vida-actual");
  if (span && tamagotchi) {
    // Se muestra con un decimal, por ejemplo
    span.textContent = tamagotchi.edadInterna.toFixed(1);
  }
}
  
document.getElementById("admin-edad-aceptar").addEventListener("click", (e) => {
  e.stopPropagation();
  const inputEdad = document.getElementById("admin-edad-interna");
  const inputDinero = document.getElementById("admin-dinero");
  const inputFlappy = document.getElementById("admin-flappy");
  let message = "";
  
  // Actualización independiente de la vida interna
  if (inputEdad.value.trim() !== "") {
    const newEdadInterna = parseFloat(inputEdad.value);
    if (!isNaN(newEdadInterna)) {
      tamagotchi.edadInterna = newEdadInterna;
      message += "Vida interna actualizada a " + newEdadInterna + ". ";
    } else {
      alert("Por favor, ingresa un número válido para la vida interna.");
      return;
    }
  }
  
  // Actualización independiente del dinero
  if (inputDinero.value.trim() !== "") {
    const newDinero = parseInt(inputDinero.value);
    if (!isNaN(newDinero)) {
      tamagotchi.coins = newDinero;
      message += "Dinero actualizado a " + newDinero + ". ";
    } else {
      alert("Por favor, ingresa un número válido para el dinero.");
      return;
    }
  }
  
  // Actualización independiente del record de Flappy Bird
  if (inputFlappy.value.trim() !== "") {
    const newFlappyRecord = parseInt(inputFlappy.value);
    if (!isNaN(newFlappyRecord)) {
      tamagotchi.flappyHighScore = newFlappyRecord;
      message += "Record de Flappy Bird actualizado a " + newFlappyRecord + ". ";
    } else {
      alert("Por favor, ingresa un número válido para el record de Flappy Bird.");
      return;
    }
  }
  
  if (message === "") {
    alert("No se ingresó ningún cambio.");
    return;
  }
  
  actualizarInterfaz();
  guardarTamagotchi();
  actualizarAdminVidaInterna();
  alert(message);
});


document.getElementById("btn-store-comida").addEventListener("click", function() {
  const foodSection = document.getElementById("store-food");
  // Si ya se muestra, se oculta; de lo contrario, se muestra
  if (foodSection.style.display === "block") {
    foodSection.style.display = "none";
  } else {
    foodSection.style.display = "block";
    // Opcional: ocultar la sección de objetos si estuviera visible
    document.getElementById("store-objects").style.display = "none";
  }
});
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-store-comida").addEventListener("click", () => {
    document.getElementById("store-food").style.display = "block";
    document.getElementById("store-objects").style.display = "none";
  });
  document.getElementById("btn-store-objetos").addEventListener("click", () => {
    document.getElementById("store-food").style.display = "none";
    document.getElementById("store-objects").style.display = "block";
  });
});


// Función para manejar la compra de un objeto
// --- Asegúrate de que esta función exista (o añádela) en tm.js ---
function comprarObjeto(nombre, costo) {
  if (!tamagotchi) return; // Verificación de seguridad

  if (tamagotchi.coins >= costo) {
      tamagotchi.coins -= costo;

      // Inicializar el inventario si no existe
      if (!tamagotchi.objectInventory) {
          tamagotchi.objectInventory = [];
      }
      // Guardar en minúsculas para consistencia, si lo prefieres
      tamagotchi.objectInventory.push(nombre.toLowerCase());

      actualizarInterfaz(); // Actualizar monedas mostradas, etc.
      guardarTamagotchi(); // Guardar el estado
      showPopup(`Has comprado ${nombre} por ${costo} monedas.`);
  } else {
      showPopup(`No tienes suficientes monedas para comprar ${nombre}.`);
  }
}

// Asigna listeners a los botones de la sección de objetos
ddocument.querySelectorAll("#store-objects .store-item").forEach(item => {
  item.querySelector("button.buy-btn").addEventListener("click", () => {
    const text = item.querySelector("span").textContent;
    // Asumimos que el formato es: "Nombre - costo monedas"
    const parts = text.split(" - ");
    if (parts.length < 2) {
      console.error("Formato de texto incorrecto:", text);
      return;
    }
    const nombre = parts[0].trim();
    // Removemos la palabra "monedas" y espacios para obtener solo el número.
    const costo = parseInt(parts[1].replace(/monedas/i, "").trim(), 10);
    console.log("Comprando:", nombre, "Costo:", costo, "Monedas actuales:", tamagotchi.coins);
    comprarObjeto(nombre, costo);
  });
});
// --- Encuentra esta sección en tu tm.js y MODIFÍCALA ---
document.addEventListener("DOMContentLoaded", () => {
  const inventoryIcon = document.getElementById("inventory-icon");
  const inventoryOverlay = document.getElementById("inventory-overlay");
  const closeInventory = document.getElementById("close-inventory");

  // Verificar si los elementos existen
  if (!inventoryIcon) console.error("¡Icono de inventario no encontrado!");
  if (!inventoryOverlay) console.error("¡Superposición de inventario no encontrada!");
  if (!closeInventory) console.error("¡Botón de cerrar inventario no encontrado!");

  // Solo añadir listeners si los elementos existen
  if (inventoryIcon && inventoryOverlay) {
      // Mostrar el overlay del inventario al hacer clic en el icono
      inventoryIcon.addEventListener("click", () => {
        populateInventoryList(); // *** AÑADE ESTA LÍNEA *** Llama a la función para rellenar la lista
        inventoryOverlay.style.display = "block"; // Muestra la superposición
      });
  }

  if (closeInventory && inventoryOverlay) {
      // Ocultar el overlay al hacer clic en el botón de cerrar
      closeInventory.addEventListener("click", () => {
        inventoryOverlay.style.display = "none";
      });
  }

  // ... (resto de tu código DOMContentLoaded, como listeners de botones de tienda, etc.)
});
// --- Añade esta función en alguna parte de tu tm.js ---
function populateInventoryList() {
  const listElement = document.getElementById("inventory-unique-list");
  if (!listElement) {
    console.error("¡Elemento de lista de inventario ('inventory-unique-list') no encontrado!");
    return;
  }
  listElement.innerHTML = ""; // Limpiar elementos anteriores

  // Verificar si Tamagotchi existe y tiene el array objectInventory
  if (!tamagotchi || !tamagotchi.objectInventory || tamagotchi.objectInventory.length === 0) {
    listElement.innerHTML = "<li>No tienes objetos comprados.</li>";
    return;
  }

  // Contar ocurrencias de cada objeto
  const itemCounts = {};
  tamagotchi.objectInventory.forEach(item => {
     // Normalizar el nombre del objeto (minúsculas) para un conteo consistente
     const normalizedItem = item.toLowerCase();
     itemCounts[normalizedItem] = (itemCounts[normalizedItem] || 0) + 1;
  });

  // Crear elementos de lista para cada objeto único y su cantidad
  Object.keys(itemCounts).forEach(itemName => {
    const listItem = document.createElement("li");
    // Poner en mayúscula la primera letra para mostrar
    let displayName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
    if (itemCounts[itemName] > 1) {
        displayName += ` (x${itemCounts[itemName]})`; // Mostrar cantidad si hay más de uno
    }
    listItem.textContent = displayName;
    listElement.appendChild(listItem);
  });
}

  //skyJUM`P
  
