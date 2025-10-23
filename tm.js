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

    // --- ¡NUEVO! Sistema de Tiers para Objetos ---
    const objectTiers = {
      'movil': [
        { id: 'movil_t1', name: 'Movil Tomophone básico', cost: 400 },
        { id: 'movil_t2', name: 'Movil Tomophone gama media', cost: 2000 },
        { id: 'movil_t3', name: 'Movil Tomophone gama alta', cost: 10000 }
      ],
      'habitacion': [
        { id: 'habitacion_t1', name: 'Habitación compartida', cost: 1000 },
        { id: 'habitacion_t2', name: 'Apartamento pequeño', cost: 5000 },
        { id: 'habitacion_t3', name: 'Casa con jardín', cost: 25000 }
      ],
      'bicicleta': [
        { id: 'bicicleta_t1', name: 'Bicicleta', cost: 800 },
        { id: 'bicicleta_t2', name: 'Moto scooter', cost: 4000 },
        { id: 'bicicleta_t3', name: 'Coche deportivo', cost: 20000 }
      ],
      'portatil': [
        { id: 'portatil_t1', name: 'Portatil básico', cost: 1500 },
        { id: 'portatil_t2', name: 'Portatil gaming', cost: 7000 },
        { id: 'portatil_t3', name: 'Estación de trabajo pro', cost: 30000 }
      ],
      'auriculares': [
        { id: 'auriculares_t1', name: 'Auriculares Xiaomi', cost: 500 },
        { id: 'auriculares_t2', name: 'Auriculares Sony Pro', cost: 2500 },
        { id: 'auriculares_t3', name: 'Auriculares de estudio', cost: 12000 }
      ]
    };

    const mercadilloObjects = {
      common: [
        { id: 'reloj_casio', name: 'Reloj Casio', value: [100, 200] },
        { id: 'taza_cafe', name: 'Taza de café', value: [100, 200] },
        { id: 'libro_viejo', name: 'Libro viejo', value: [100, 200] },
        { id: 'poster_pelicula', name: 'Póster de película', value: [100, 200] },
        { id: 'planta_plastico', name: 'Planta de plástico', value: [100, 200] },
        { id: 'figura_accion', name: 'Figura de acción', value: [100, 200] },
        { id: 'gorra', name: 'Gorra', value: [100, 200] },
        { id: 'gafas_sol', name: 'Gafas de sol', value: [100, 200] },
        { id: 'llavero', name: 'Llavero', value: [100, 200] },
        { id: 'comic', name: 'Cómic', value: [100, 200] }
      ],
      uncommon: [
        { id: 'vinilo_antiguo', name: 'Vinilo antiguo', value: [300, 700] },
        { id: 'camara_fotos', name: 'Cámara de fotos', value: [300, 700] },
        { id: 'walkman', name: 'Walkman', value: [300, 700] },
        { id: 'consola_retro', name: 'Consola retro', value: [300, 700] },
        { id: 'maquina_escribir', name: 'Máquina de escribir', value: [300, 700] },
        { id: 'telefono_antiguo', name: 'Teléfono antiguo', value: [300, 700] },
        { id: 'mapa_antiguo', name: 'Mapa antiguo', value: [300, 700] },
        { id: 'joya_plata', name: 'Joya de plata', value: [300, 700] }
      ],
      rare: [
        { id: 'pepita_oro', name: 'Pepita de oro', value: [5000, 6000] },
        { id: 'diamante', name: 'Diamante', value: [5000, 6000] }
      ]
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
    const cicloMs = 900000; // 15 minutos. Un ciclo más largo y relajado. (15 * 60 * 1000)
    const tiempoTotalSueñoPersonalizado = 7000000; // 2 horas. (2 * 60 * 60 * 1000)
    let promotionCheckedThisCycle = false;
    
   
    // --- ¡NUEVO! Motor de juego unificado ---
    let gameEngineInterval = null;

    // --- ¡NUEVO! Función para calcular el peso ideal según la edad ---
    function getIdealWeight(age) {
      if (age <= 10) {
        // Crecimiento rápido en la infancia: de 5kg a 35kg.
        return 5 + (age * 3);
      } else if (age <= 20) {
        // Crecimiento más moderado en la adolescencia: de 35kg a 65kg.
        return 35 + ((age - 10) * 3);
      } else if (age <= 60) {
        // El peso se estabiliza y aumenta muy lentamente: de 65kg a 75kg.
        return 65 + ((age - 20) * 0.25);
      } else {
        // En la vejez, el peso tiende a disminuir ligeramente.
        return 75 - ((age - 60) * 0.2);
      }
    }
    let minijuegoActivo = false, minijuegoScore = 0, obstacleInterval = null, collisionInterval = null, isJumping = false;
    let tamagotchi, estaDurmiendo = false, ciclosDesdeCumple = 0, juegoTerminado = false;
    let flappyEnded = false;
    let currentMuseumPageIndex = 0; // <-- ¡NUEVO! Variable global para la página del museo
    let currentAdminPageIndex = 0; // <-- ¡NUEVO! Variable para la página de objetos del admin
    
    // --- Funciones de actualización y utilidades ---
    function updateSleepProgress() {
      const sleepProgress = JSON.parse(localStorage.getItem("sleepProgress"));
      if (!sleepProgress) return; // Ya no depende de estaDurmiendo global
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
      // --- MODIFICADO: Añadido #museum-overlay a la lista de excepciones ---
      const parentMenu = button.closest("#work-menu, #admin-menu, #food-menu, #clean-menu, #game-menu, #sleep-menu, #store-overlay, #inventory-overlay, #museum-overlay");
      const isExemptId = ["juego-saltar", "juego-reaccion", "juego-ducha", "boton-saltar", "admin-close", "btn-store-comida", "btn-store-objetos"].includes(button.id);
      
      if (parentMenu || isExemptId) {
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


  
  function enableControls() {
    // Reactiva todos los botones
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
        // --- ¡CORRECCIÓN! Comprobar si el menú existe antes de acceder a sus estilos ---
        if (menu && getComputedStyle(menu).display === "block" &&
            !e.target.closest("#" + id) &&
            !e.target.closest("button[id^='btn-']")) {
          menu.style.display = "none";
          enableControls();
        }
      });
    });
    ["food-menu", "clean-menu", "game-menu"].forEach((id) => {
      // --- ¡CORRECCIÓN! Comprobar si el elemento existe antes de añadir el listener ---
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("click", (e) => e.stopPropagation());
      }
    });
    function actualizarProgreso(id, valor) {
      const barra = document.getElementById(id);
      let porcentaje = (valor / 10) * 100;
      barra.style.width = porcentaje + "%" ;
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
                             Puesto: ${tamagotchi.puesto}<br>
                             Edad: ${tamagotchi.edad}<br>
                             Peso: ${tamagotchi.peso.toFixed(1)} kg<br>
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

    // --- ¡NUEVO! Lógica para mostrar/ocultar la insulina ---
    const insulinaItem = document.getElementById("store-item-insulina");
    if (insulinaItem) {
        if (tamagotchi && tamagotchi.esDiabetico) {
            insulinaItem.style.display = 'flex'; // Muestra el item
        } else {
            insulinaItem.style.display = 'none'; // Oculta el item
        }
    }
    }
    
    // --- ¡NUEVO! Función para actualizar la tienda de objetos con tiers ---
    function updateObjectStore() {
      if (!tamagotchi) return;
    
      // Recorre cada tipo de objeto en la tienda
      document.querySelectorAll('#store-objects .store-item').forEach(itemElement => {
        const itemType = itemElement.dataset.itemType;
        if (!itemType || !objectTiers[itemType]) return;
    
        // Encuentra el último tier comprado de este tipo
        const tiersForType = objectTiers[itemType];
        let lastOwnedTierIndex = -1;
        for (let i = tiersForType.length - 1; i >= 0; i--) {
          if (tamagotchi.objectInventory.includes(tiersForType[i].id)) {
            lastOwnedTierIndex = i;
            break;
          }
        }
    
        // Determina el siguiente tier a mostrar
        const nextTierIndex = lastOwnedTierIndex + 1;
        const span = itemElement.querySelector('span');
        const button = itemElement.querySelector('button');
    
        if (nextTierIndex < tiersForType.length) {
          // Muestra el siguiente tier disponible
          const nextTier = tiersForType[nextTierIndex];
          span.textContent = `${nextTier.name} - ${nextTier.cost} monedas`;
          itemElement.style.display = 'flex'; // Asegura que el item sea visible
        } else {
          // Si ya se compró el último tier, oculta el objeto de la tienda
          itemElement.style.display = 'none';
        }
      });
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
      } else if (food === "insulina") { // --- ¡NUEVO! ---
        tamagotchi.tomarInsulina();
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
      const idealWeight = getIdealWeight(tamagotchi.edad);

      if (tamagotchi.hambre >= 8.5) mensajes.push(`${tamagotchi.nombre} tiene hambre.`);
      if (tamagotchi.aburrimiento >= 8.5) mensajes.push(`${tamagotchi.nombre} está aburrido.`);
      // --- ¡NUEVO! Notificación para la insulina ---
      if (tamagotchi.esDiabetico && tamagotchi.necesitaInsulina) {
        mensajes.push(`${tamagotchi.nombre} necesita su dosis de insulina.`);
      }
      // --- ¡NUEVO! Notificación de caca ---
      if (tamagotchi.cagado) {
        mensajes.push(`${tamagotchi.nombre} se ha hecho caca. ¡Necesita una limpieza!`);
      }
      /* --- ELIMINADO: Las notificaciones de peso ahora las da el médico ---
      if (tamagotchi.peso > idealWeight + 18) {
        mensajes.push(`${tamagotchi.nombre} tiene un sobrepeso peligroso.`);
      } else if (tamagotchi.peso < idealWeight - 13) {
        mensajes.push(`${tamagotchi.nombre} tiene un peso peligrosamente bajo.`);
      }
      */

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
      // --- ¡CORRECCIÓN! Evita que la función se ejecute múltiples veces ---
      if (juegoTerminado) return;
      juegoTerminado = true;

      // Detener el motor principal del juego
      clearInterval(gameEngineInterval);

      // Actualizar la interfaz una última vez para mostrar el estado final
      actualizarInterfaz();
      document.body.classList.remove("sleeping");

      // Deshabilitar toda interacción
      document.getElementById("muñeco-container").style.pointerEvents = "none";
      document.querySelectorAll("button").forEach((btn) => btn.disabled = true);

      // Mostrar el personaje y el mensaje de muerte
      actualizarMuñeco();
      const mensaje = `Tu Tamagotchi ha muerto por ${tamagotchi.cause}.<br><br>Información:<br>Nombre: ${tamagotchi.nombre}<br>Puesto: ${tamagotchi.puesto}<br>Edad: ${tamagotchi.edad}`;
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
    tamagotchi.peso = Math.max(1, tamagotchi.peso - 0.15); // AJUSTE: Saltar quema menos calorías
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
        tamagotchi.peso = Math.max(1, tamagotchi.peso - (2 * ((800 - reactionTime) / 600)) * 0.05); // AJUSTE: Reaccionar casi no consume energía
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

    // --- FUNCIÓN MODIFICADA PARA INICIAR EL JUEGO DE DUCHA MODERNO ---
    function startShowerGame() {
      // Aplicar una animación de desvanecimiento al personaje
      const muñecoContainer = document.getElementById("muñeco-container");
      if (muñecoContainer) {
          muñecoContainer.style.animation = "fadeOutAnimation 0.5s forwards";
      }

      // Guardamos los datos actuales para que el otro HTML pueda leerlos
      guardarTamagotchi();

      // Esperar a que la animación termine antes de redirigir
      setTimeout(() => {
        // Redirigimos al usuario a la nueva página del juego
        window.location.href = "ducha.html";
      }, 500); // 500ms, igual que la duración de la animación
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
        this.peso = getIdealWeight(edadInicial); // El peso inicial ahora depende de la edad de inicio
        this.estado = "vivo";
        this.cause = "";
        this.critico = false;
        this.causeCritica = "";
        this.cagado = false;
        this.enfermo = false;
        this.ciclosEnfermo = 0;
        this.pastillaCount = 0;
        this.pastillaDisponible = true;
        // --- ¡NUEVO! Propiedades para la diabetes ---
        this.esDiabetico = false;
        this.vecesEnfermoPorComidaRapida = 0;
        this.necesitaInsulina = false;
        this.ciclosSinInsulina = 0;
        this.edadInternaMaxima = 100;
        this.happyLock = false; // prettier-ignore
        this.statsHistory = { hambre: [], aburrimiento: [], sueno: [], higiene: [] };
        this.coins = 0;
        this.objectInventory = []; // <-- CORRECCIÓN: Inicializar el inventario de objetos
        this.mercadilloInventory = [];
        this.foodInventory = [];
        this.nivel = 0;
        this.puesto = puestos[this.nivel].nombre;
        this.karma = 0; // <-- ¡NUEVO! El karma empieza en neutral.
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
    let pesoChange = 0;
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
    pesoChange = 1.8; // AJUSTE: La comida rápida engorda un poco más
    this.consecutiveHealthyFood = 0;
    if (this.consecutiveFastFood >= 4) {
    this.enfermo = true;
    showPopup("¡Demasiada comida rápida! Tu Tamagotchi se ha enfermado.", 4000);
    // Reiniciamos el contador para evitar múltiples alertas seguidas.
    this.consecutiveFastFood = 0;

    // --- ¡NUEVO! Lógica para desarrollar diabetes ---
    this.vecesEnfermoPorComidaRapida++;
    if (!this.esDiabetico && this.vecesEnfermoPorComidaRapida >= 3) {
        if (Math.random() < 0.40) { // 40% de probabilidad
            this.esDiabetico = true;
            this.edadInternaMaxima = 80;
            showPopup(`¡Malas noticias! ${this.nombre} ha desarrollado diabetes. Su esperanza de vida se ha reducido.`, 6000);
        }
    }
    }
    } else if (healthyFoods.includes(food)) {
    // Se consumió comida sana, se reinicia el contador de comida rápida.
    this.consecutiveHealthyFood = (this.consecutiveHealthyFood || 0) + 1;
    if (food === "zanahoria") {
      pesoChange = 0; // La zanahoria no aumenta el peso.
    } else {
      pesoChange = 0.4; // El resto de comida sana aumenta poco el peso.
    }
    this.consecutiveFastFood = 0;
    if (this.consecutiveHealthyFood >= 6) {
    this.enfermo = true;
    showPopup("¡Demasiada comida sana! Tu Tamagotchi se ha enfermado.", 4000);
    this.consecutiveHealthyFood = 0;
    }
    } else {
    // En caso de que el alimento no esté clasificado, se reinician ambos contadores.
    this.consecutiveFastFood = 0;
    this.consecutiveHealthyFood = 0;
    }

    // Aplicar cambio de peso, con un máximo de 100
    this.peso = Math.min(100, this.peso + pesoChange);
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
    showPopup("¡Te has curado con la jeringuilla!", 4000);
    } else {
    showPopup("No estás enfermo, la jeringuilla no es necesaria.", 4000);
    }
    }

    // --- ¡NUEVO! Método para tomar insulina ---
    tomarInsulina() {
        if (!this.esDiabetico) {
            showPopup("Tu Tamagotchi no es diabético, no necesita insulina.", 4000);
            return;
        }
        if (this.necesitaInsulina) {
            this.necesitaInsulina = false;
            this.ciclosSinInsulina = 0;
            this.aburrimiento = Math.max(0, this.aburrimiento - 1); // Se siente mejor
            showPopup(`${this.nombre} se ha administrado su dosis de insulina y se siente aliviado.`, 4000);
        } else {
            showPopup(`${this.nombre} no necesita insulina en este momento.`, 4000);
        }
    }
    
      intentarEnfermarse() {
        if (this.enfermo) return; // Si ya está enfermo, no hacemos nada.

        // 1. Probabilidad base por edad (combinando lógica antigua y nueva)
        let ageProb = 0;
        if (this.edad < 5) ageProb = 0.4;  // Probabilidad alta en la infancia (recuperado de tmm.js)
        else if (this.edad < 10) ageProb = 0.2; // Probabilidad media en la infancia (recuperado de tmm.js)
        else if (this.edad < 45) ageProb = 0.01;
        else if (this.edad < 60) ageProb = 0.02;
        else if (this.edad < 70) ageProb = 0.04;
        else if (this.edad < 80) ageProb = 0.1;
        else if (this.edad < 90) ageProb = 0.15;
        else if (this.edad < 95) ageProb = 0.5;
        else if (this.edad < 100) ageProb = 0.7;

        // 2. Probabilidad adicional por peso
        let weightProb = 0;
        const idealWeight = getIdealWeight(this.edad);
        const diff = this.peso - idealWeight;
        const safeRange = 12; // +/- 12kg se considera un rango seguro sin riesgo adicional. 
 
        // --- MODIFICACIÓN: El peso solo afecta a la salud a partir de los 13 años ---
        if (this.edad > 12) {
            if (Math.abs(diff) > safeRange) {
                // La probabilidad aumenta linealmente fuera del rango seguro.
                const deviation = Math.abs(diff) - safeRange;
                const maxDeviation = 20; // A los 20kg de desviación sobre el rango seguro, el riesgo es máximo.
                const maxWeightRisk = 0.25; // Un 25% de probabilidad adicional como máximo.
                weightProb = (deviation / maxDeviation) * maxWeightRisk;
            }
        }

        // 3. Probabilidad total
        const totalProb = Math.min(ageProb + weightProb, 0.95); // Sumamos y limitamos al 95%

        if (Math.random() < totalProb) {
          this.enfermo = true;
          this.ciclosEnfermo = 0;
          this.pastillaCount = 0;
          this.pastillaDisponible = true;
          showPopup(`${this.nombre} se ha enfermado.`, 4000);
        }
      }
      actualizarEstado() {
        this.hambre = Math.min(10, this.hambre + 1);
        this.aburrimiento = Math.min(10, this.aburrimiento + 0.3);
        this.sueno = Math.min(10, this.sueno + 0.2);
        this.higiene = Math.min(10, this.higiene + 0.4);

        // --- ¡NUEVO! Metabolismo inteligente basado en la edad ---
        const idealWeight = getIdealWeight(this.edad);
        const diff = this.peso - idealWeight;
        // El metabolismo intenta llevar el peso actual hacia el ideal.
        // Si pesa más de lo ideal, pierde peso. Si pesa menos, gana un poco (crecimiento).
        const metabolicChange = diff * 0.01; // Un factor pequeño para un ajuste gradual
        this.peso = Math.max(5, this.peso - metabolicChange); // El peso mínimo es 5kg

        // --- ¡NUEVO! Lógica de estado para diabéticos ---
        if (this.esDiabetico) {
            if (this.necesitaInsulina) {
                this.ciclosSinInsulina++;
                if (this.ciclosSinInsulina >= 3) {
                    this.estado = "muerto";
                    this.cause = "diabetes no tratada";
                    // La muerte se gestionará en el ciclo principal
                }
            } else {
                // Hay un 30% de probabilidad en cada ciclo de que necesite insulina
                if (Math.random() < 0.30) this.necesitaInsulina = true;
            }
        }

        if (this.enfermo) {
          this.hambre = Math.min(10, this.hambre + 0.3);
          this.sueno = Math.min(10, this.sueno + 0.2);
          this.higiene = Math.min(10, this.higiene + 0.2);
          this.ciclosEnfermo++;
          this.pastillaDisponible = true;
        } else {
          // --- ¡NUEVO! Los umbrales de enfermedad por peso ahora son relativos ---
          if (this.peso > idealWeight + 20 || this.peso < idealWeight - 15) {
              this.enfermo = true;
              showPopup(`${this.nombre} se ha enfermado debido a su peso (${this.peso.toFixed(1)}kg).`, 4000);
          }
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
        // --- ¡NUEVO! Si una stat crítica llega a 10, se pausan todas las actualizaciones. ---
        // Se añade la condición de muerte por enfermedad (5 ciclos enfermo).
        if (this.hambre >= 10 || this.higiene >= 10 || (this.enfermo && this.ciclosEnfermo >= 5)) {
          // El estado se "congela" hasta que el jugador despierte al personaje.
          return;
        }

        this.hambre = Math.min(10, this.hambre + 1);
        this.aburrimiento = Math.min(10, this.aburrimiento + 0.3);
        this.higiene = Math.min(10, this.higiene + 0.4);

        // --- ¡NUEVO! Metabolismo inteligente también al dormir ---
        const idealWeight = getIdealWeight(this.edad);
        const diff = this.peso - idealWeight;
        const metabolicChange = diff * 0.01;
        this.peso = Math.max(5, this.peso - metabolicChange);

        // --- ¡NUEVO! Lógica de diabetes también al dormir ---
        if (this.esDiabetico) {
            if (this.necesitaInsulina) {
                this.ciclosSinInsulina++;
                // La comprobación de muerte se hará al despertar para que el jugador pueda reaccionar.
            } else {
                // Hay un 30% de probabilidad en cada ciclo de que necesite insulina
                if (Math.random() < 0.30) {
                    this.necesitaInsulina = true;
                    // No se muestra popup, el jugador lo verá en las notificaciones al despertar.
                }
            }
        }

        if (this.enfermo) {
          this.hambre = Math.min(10, this.hambre + 0.3);
          this.higiene = Math.min(10, this.higiene + 0.2);
          this.ciclosEnfermo++;
          this.pastillaDisponible = true;
        } else {
          // --- ¡NUEVO! Umbrales relativos también al dormir ---
          if (this.peso > idealWeight + 20 || this.peso < idealWeight - 15) {
              this.enfermo = true;
              // No mostramos popup mientras duerme, lo verá al despertar.
          }
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

        // --- MODIFICACIÓN: Ajustar peso al ideal en la infancia (hasta los 12 años) ---
        if (this.edad <= 12) {
            this.peso = getIdealWeight(this.edad);
            showPopup(`¡Feliz cumpleaños ${this.edad}! Tu peso se ha ajustado al ideal para tu edad.`, 5000);
        }

        const avgAburrimiento = this.statsHistory.aburrimiento.reduce((a, b) => a + b, 0) / this.statsHistory.aburrimiento.length;
        const avgSueno = this.statsHistory.sueno.reduce((a, b) => a + b, 0) / this.statsHistory.sueno.length;
        const avgHigiene = this.statsHistory.higiene.reduce((a, b) => a + b, 0) / this.statsHistory.higiene.length;
        const mediaStats = (avgHambre + avgAburrimiento + avgSueno + avgHigiene) / 4;
        let ajuste = mediaStats >= 2.0 ? 2 : -0.5; // prettier-ignore
        this.edadInterna += 1 + ajuste;
        console.log(`[Año: ${this.edad}] Media acumulativa: ${mediaStats.toFixed(2)} | Ajuste: ${ajuste} | Edad Interna: ${this.edadInterna.toFixed(1)}`);
        if (this.edadInterna >= this.edadInternaMaxima) {
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
  t.peso = data.peso !== undefined ? data.peso : getIdealWeight(data.edad); // Carga el peso o lo calcula según la edad guardada
  t.estado = data.estado;
  t.cause = data.cause || "";
  t.critico = data.critico || false;
  t.causeCritica = data.causeCritica || "";
  t.cagado = data.cagado || false;
  t.enfermo = data.enfermo || false;
  t.ciclosEnfermo = data.ciclosEnfermo || 0;
  t.pastillaCount = data.pastillaCount || 0;
  t.pastillaDisponible = data.pastillaDisponible !== undefined ? data.pastillaDisponible : true;
  // --- ¡NUEVO! Cargar datos de diabetes ---
  t.esDiabetico = data.esDiabetico || false;
  t.vecesEnfermoPorComidaRapida = data.vecesEnfermoPorComidaRapida || 0;
  t.necesitaInsulina = data.necesitaInsulina || false;
  t.ciclosSinInsulina = data.ciclosSinInsulina || 0;
  t.edadInternaMaxima = data.edadInternaMaxima || 100;
  t.happyLock = data.happyLock || false; // prettier-ignore
  t.edadInterna = data.edadInterna || data.edad; // Usa edadInterna guardada o la edad normal si no existe
  t.statsHistory = data.statsHistory || { hambre: [], aburrimiento: [], sueno: [], higiene: [] }; // Historial
  t.coins = data.coins || 0; // Monedas
  t.foodInventory = data.foodInventory || []; // Inventario de comida
  t.mercadilloInventory = data.mercadilloInventory || [];

  // --- ¡LA LÍNEA IMPORTANTE QUE FALTABA! ---
  t.objectInventory = data.objectInventory || []; // CORRECCIÓN: Carga el inventario de objetos o crea uno vacío si no existe

  // --- ¡NUEVO! Cargar el karma ---
  t.karma = data.karma || 0;

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
    
    
    function iniciarSueño() {
      disableControls();
      estaDurmiendo = true;
      stopBackgroundAnimation(true); // Detiene y limpia el fondo
      document.body.classList.add("sleeping");
      localStorage.setItem("lastCycleTimestamp", Date.now()); // Guardamos el momento exacto en que se duerme
      const startTime = Date.now();
      const initialValue = tamagotchi.sueno;
      const duration = 10000;
      localStorage.setItem("sleepProgress", JSON.stringify({ startTime, initialValue, duration }));
      // El gameEngine se encargará del resto
      guardarTamagotchi();
    }
    function despertar() {
      if (!estaDurmiendo) return;

      estaDurmiendo = false;
      localStorage.removeItem("sleepProgress");
      startBackgroundAnimation(); // Reanuda la animación del fondo
      document.body.classList.remove("sleeping");

      // --- ¡CORRECCIÓN! La comprobación de muerte se hace aquí ---
      // Al despertar, se comprueba si alguna necesidad llegó al máximo mientras dormía.
      if (tamagotchi.hambre >= 10 || tamagotchi.higiene >= 10 || (tamagotchi.enfermo && tamagotchi.ciclosEnfermo >= 5) || (tamagotchi.esDiabetico && tamagotchi.ciclosSinInsulina >= 3)) {
          if (tamagotchi.hambre >= 10) {
              tamagotchi.cause = "hambre mientras dormía";
          } else if (tamagotchi.higiene >= 10) {
              tamagotchi.cause = "falta de higiene mientras dormía";
          } else if (tamagotchi.enfermo && tamagotchi.ciclosEnfermo >= 5) {
              tamagotchi.cause = "enfermedad no tratada mientras dormía";
          } else if (tamagotchi.esDiabetico && tamagotchi.ciclosSinInsulina >= 3) { // --- ¡CORRECCIÓN! ---
              // --- ¡NUEVO! Comprobación de muerte por diabetes al despertar ---
              tamagotchi.cause = "diabetes no tratada";
          }
          
          tamagotchi.estado = "muerto";
          mostrarMensajeDeMuerte(); // Muestra el mensaje y finaliza el juego
          return; // Detiene la ejecución para no continuar con el estado "despierto"
        }

        localStorage.setItem("lastCycleTimestamp", Date.now()); // Reseteamos el reloj del ciclo
        enableControls();
        actualizarInterfaz();
        guardarTamagotchi();
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
    
    // --- ¡NUEVO! Función para formatear la hora para los logs ---
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // --- ¡NUEVO! Motor de juego unificado ---
    function gameEngine() {
        if (juegoTerminado) {
            clearInterval(gameEngineInterval);
            return;
        }

        const now = Date.now();
        let lastCycleTimestamp = parseInt(localStorage.getItem("lastCycleTimestamp")) || now;

        const cycleDuration = estaDurmiendo ? tiempoTotalSueñoPersonalizado : cicloMs;
        const elapsed = now - lastCycleTimestamp;

        // --- ¡NUEVO! Log de estado constante en cada tick del motor ---
        // Controlar la animación del fondo
        if (estaDurmiendo || juegoTerminado) stopBackgroundAnimation(true);
        else startBackgroundAnimation();


        const remainingMs = cycleDuration - elapsed;
        const state = estaDurmiendo ? 'Dormido' : 'Despierto';
        console.log(`EngineTick -> cycleStart: ${formatTime(lastCycleTimestamp)}, now: ${formatTime(now)}, elapsed: ${Math.floor(elapsed/1000)}s, next in: ${Math.floor(remainingMs/1000)}s. State: ${state}`);


        if (elapsed >= cycleDuration) {
            const cyclesPassed = Math.floor(elapsed / cycleDuration);

            for (let i = 0; i < cyclesPassed; i++) {
                if (tamagotchi.estado === "muerto") {
                    mostrarMensajeDeMuerte();
                    return;
                }
                // --- ¡NUEVO! Log de tiempo detallado por ciclo ---
                const cycleStartTime = lastCycleTimestamp + i * cycleDuration;
                const cycleEndTime = cycleStartTime + cycleDuration;
                console.log(`Motor: Ciclo completado. Inició: ${formatTime(cycleStartTime)}, Finalizó: ${formatTime(cycleEndTime)}. (Estado: ${estaDurmiendo ? 'Dormido' : 'Despierto'})`);

                // Lógica de actualización de estado
                if (estaDurmiendo) {
                    tamagotchi.actualizarEstadoDormido();
                } else {
                    tamagotchi.actualizarEstado();
                }

                // Comprobación de muerte (solo si está despierto)
                if (!estaDurmiendo && (tamagotchi.hambre >= 10 || tamagotchi.aburrimiento >= 10 || tamagotchi.sueno >= 10 || tamagotchi.higiene >= 10)) {
                    if (tamagotchi.hambre >= 10) tamagotchi.cause = "hambre";
                    else if (tamagotchi.aburrimiento >= 10) tamagotchi.cause = "aburrimiento extremo";
                    else if (tamagotchi.sueno >= 10) tamagotchi.cause = "insomnio";
                    else if (tamagotchi.higiene >= 10) tamagotchi.cause = "falta de higiene";
                    tamagotchi.estado = "muerto";
                    mostrarMensajeDeMuerte();
                    return;
                }

                // Lógica común a ambos estados (salario, cumpleaños, impuestos, etc.)
                pagarSalario();
                contadorCiclosImpuestos++;
                if (contadorCiclosImpuestos >= ciclosParaImpuestos) {
                    const impuestoActual = impuestosPorNivel[tamagotchi.nivel] || 0;
                    tamagotchi.coins -= impuestoActual;
                    showPopup("Se te ha cobrado " + impuestoActual + " monedas por impuestos.", 3000);
                    contadorCiclosImpuestos = 0;
                }

                promotionCheckedThisCycle = false;
                checkPromotion();

                ciclosDesdeCumple++;
                const ciclosParaCumple = estaDurmiendo ? 3 : 4;
                if (ciclosDesdeCumple >= ciclosParaCumple) {
                    tamagotchi.cumpleAnios();
                    ciclosDesdeCumple = 0;
                }
            }

            // Actualizar el timestamp del último ciclo procesado
            localStorage.setItem("lastCycleTimestamp", lastCycleTimestamp + cyclesPassed * cycleDuration);
            actualizarInterfaz();
            guardarTamagotchi();
        }

        // Si está durmiendo, también actualizamos la barra de progreso del sueño
        if (estaDurmiendo) {
            updateSleepProgress();
        }
    }
    
    
    
    
    document.addEventListener("visibilitychange", function () {
        // --- ¡NUEVO! Lógica para sincronizar el juego al volver a la pestaña ---
        if (document.visibilityState === 'visible') {
            console.log("Pestaña visible de nuevo. Forzando actualización del motor.");
            gameEngine(); // Ejecuta el motor para simular el tiempo offline.
            startBackgroundAnimation(); // Reanuda la animación del fondo.
        }
    });
    
    // --- Inicialización del Juego ---

// --- REEMPLAZA TODOS LOS BLOQUES "DOMContentLoaded" EXISTENTES CON ESTE (VERSIÓN COMPLETA CON DEBUG BOTONES TIENDA) ---

// --- ¡NUEVO! Forzar recarga al volver desde la caché (solución para móviles) ---
window.addEventListener('pageshow', function(event) {
    // La propiedad 'persisted' es true si la página se restaura desde la caché (bfcache).
    // Esto es común en móviles al usar el botón "atrás" para volver a index.html.
    if (event.persisted) {
        console.log("Página restaurada desde caché. Forzando recarga para procesar eventos...");
        // Forzamos una recarga completa de la página.
        window.location.reload();
    }
});


document.addEventListener("DOMContentLoaded", () => {
  initBackgroundCanvas('muñeco-container'); // Inicia el canvas con el ID del personaje
  // --- Inicialización de la Interfaz y Carga de Datos ---
  console.log("DOM completamente cargado y parseado.");

  // Ocultar menús y overlays inicialmente
  document.getElementById("work-menu").style.display = "none";
  document.getElementById("clean-menu").style.display = "none";
  document.getElementById("game-menu").style.display = "none";
  document.getElementById("sleep-menu").style.display = "none";
  document.getElementById("food-menu").style.display = "none";
  document.getElementById("minijuego-container").style.display = "none";
  document.getElementById("store-overlay").style.display = "none";
  document.getElementById("inventory-overlay").style.display = "none";
  document.getElementById("store-food").style.display = "none"; // Ocultar sección comida tienda por defecto
  // --- ¡NUEVO! Ocultar museo ---
  document.getElementById("museum-overlay").style.display = "none";


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

      if (estaDurmiendo) {
          document.body.classList.add("sleeping");
          stopBackgroundAnimation(true);
          disableControls();
      }

      // --- ¡NUEVO! El motor de juego se inicia siempre ---
      // Ejecuta una vez inmediatamente para la simulación offline
      gameEngine(); 
      // Y luego se establece el intervalo para las actualizaciones en tiempo real y el fondo
      gameEngineInterval = setInterval(gameEngine, 1000); // Se ejecuta cada segundo

      menuContainer.style.display = "none"; gameContainer.style.display = "flex";
      actualizarInterfaz(); updateStorePrices();
      if (tamagotchi.estado === "muerto") { mostrarMensajeDeMuerte(); }
  } else { 
      console.log("No hay datos guardados, mostrando menú de inicio."); 
      menuContainer.style.display = "block"; 
      gameContainer.style.display = "none"; 
  }

  // --- ¡NUEVO! VERIFICAR RESULTADO DEL JUEGO FLAPPY BIRD AL CARGAR ---
  const flappyResult = localStorage.getItem("flappyGameResult");
  if (flappyResult) {
      const score = parseInt(flappyResult, 10);
      if (!isNaN(score)) {
          // Lógica de recompensa y actualización de estado
          if (score > tamagotchi.flappyHighScore) {
              tamagotchi.flappyHighScore = score;
          }
          tamagotchi.peso = Math.max(1, tamagotchi.peso - score * 0.08); // Adelgaza por trabajar
          showPopup(`Has vuelto del trabajo. Puntuación: ${score}. Récord: ${tamagotchi.flappyHighScore}`, 4000);
      }
      localStorage.removeItem("flappyGameResult"); // Limpiar para no procesar de nuevo
      guardarTamagotchi();
  }
  // --- VERIFICAR RESULTADO DEL MINIJUEGO DE DUCHA AL CARGAR ---
  const showerResult = localStorage.getItem("showerGameResult");
  if (showerResult) {
      if (showerResult === "win") {
          tamagotchi.higiene = 0; 
          tamagotchi.peso = Math.max(1, tamagotchi.peso - 0.2); // AJUSTE: La ducha es un ejercicio ligero
          tamagotchi.cagado = false;
          showPopup("¡Tu Tamagotchi está limpio y feliz!", 3000);
      } else {
          showPopup("La próxima vez será. ¡Intenta limpiar más rápido!", 3000);
      }
      // Limpiamos el resultado para no volver a procesarlo en futuras recargas
      localStorage.removeItem("showerGameResult"); 
      actualizarInterfaz();

      // --- NUEVO: Animación de aparición al volver de la ducha ---
      const muñecoContainer = document.getElementById("muñeco-container");
      if (muñecoContainer) {
          muñecoContainer.style.animation = "fadeInAnimation 1.5s forwards";
      }

      guardarTamagotchi();
  }

  // --- ¡NUEVO! VERIFICAR SI SE ABANDONÓ UN PASEO ---
  if (localStorage.getItem('walkInProgress') === 'true') {
    // Si se detecta un paseo abandonado, se resuelve aquí con una escena.
    localStorage.removeItem('walkInProgress'); // Limpiar la marca

    // Replicamos la lógica de abandono de paseo.html
    if (Math.random() < 0.60) { // 60% de probabilidad de ser atracado
        const muggerChar = '>:(';
        const muggerDialog = "¡Quieto ahí! Al volver solo a casa, te han atracado. Has perdido todo lo del paseo.";
        showEventScene(muggerChar, muggerDialog, 4000, () => {
            // No se suman monedas ni objetos.
            // Limpiamos los items del paseo para no procesarlos después
            localStorage.removeItem('walkCoins');
            localStorage.removeItem('walkMercadilloInventory');
        });
    } else { // 40% de volver a salvo
        const safeChar = '^_^';
        const safeDialog = "¡Qué suerte! Has conseguido volver a casa sano y salvo con todo lo que conseguiste.";
        showEventScene(safeChar, safeDialog, 4000, () => {
            const walkCoins = parseInt(localStorage.getItem('walkCoins'), 10) || 0;
            const walkItems = JSON.parse(localStorage.getItem('walkMercadilloInventory')) || [];
            tamagotchi.coins += walkCoins;
            tamagotchi.mercadilloInventory.push(...walkItems);
        });
    }
  }

  // --- ¡NUEVO! VERIFICAR RESULTADO DEL PASEO AL CARGAR ---
  const walkResult = localStorage.getItem("walkGameResult");
  if (walkResult) {
      if (walkResult === 'finished_offline') {
          const reason = localStorage.getItem('offlineWalkEndReason') || "un evento inesperado";
          showPopup(`Tu Tamagotchi decidió volver a casa por ${reason}.`, 5000);
          tamagotchi.mercadilloInventory.push(...(JSON.parse(localStorage.getItem('walkMercadilloInventory')) || []));
      } else if (walkResult === 'abandoned_mugged') {
          // --- ¡NUEVO! Caso de abandono con atraco ---
          showPopup(`¡Qué mala suerte! Al volver a casa solo, a ${tamagotchi.nombre} le han atracado. Ha perdido todo lo que consiguió en el paseo.`, 6000);
          // No se suman monedas ni objetos.
      } else if (walkResult === 'abandoned_safe') {
          // --- ¡NUEVO! Caso de abandono con vuelta segura ---
          const walkCoins = parseInt(localStorage.getItem('walkCoins'), 10) || 0;
          const walkItems = JSON.parse(localStorage.getItem('walkMercadilloInventory')) || [];
          showPopup(`¡Uf, qué suerte! ${tamagotchi.nombre} ha vuelto a casa sano y salvo con todo lo que consiguió.`, 6000);
          tamagotchi.coins += walkCoins;
          tamagotchi.mercadilloInventory.push(...walkItems);
      }
      // Limpiar para no procesar de nuevo
      localStorage.removeItem("walkGameResult");
      localStorage.removeItem("offlineWalkEndReason");
      localStorage.removeItem('walkInProgress'); // Asegurarse de limpiar esta marca también
      localStorage.removeItem('walkCoins');
      localStorage.removeItem('walkMercadilloInventory');
      guardarTamagotchi();
  }


  // --- Listeners de Botones y Elementos Interactivos ---

  // Botón Iniciar Juego
  if (startBtn) { /* ... listener startBtn sin cambios ... */
      startBtn.addEventListener("click", () => {
          const n = document.getElementById("nombre").value, t = document.getElementById("trabajo").value, e = parseInt(document.getElementById("edad").value, 10) || 0;
          if (!n || !t || isNaN(e)) { alert("Por favor, completa todos los campos correctamente."); return; }
          tamagotchi = new Tamagotchi(n, t, e); ciclosDesdeCumple = 0; estaDurmiendo = false; localStorage.clear(); 
          localStorage.setItem("lastCycleTimestamp", Date.now()); // Inicia el reloj del motor
          actualizarInterfaz(); updateStorePrices(); menuContainer.style.display = "none"; gameContainer.style.display = "flex"; 
          gameEngineInterval = setInterval(gameEngine, 1000); // Inicia el motor de juego
          guardarTamagotchi();
      });
  }

  // Contenedor del Muñeco (Click, Long Press, Multi-Tap)
  const muñecoContainer = document.getElementById("muñeco-container");
  if (muñecoContainer) { /* ... listener muñecoContainer sin cambios ... */
      let longPressTimer;
      let isLongPress = false;
      let adminTapCount = 0;
      let adminTapTimeout;
      // --- ¡NUEVO! Lógica para el truco secreto del mercadillo ---
      let secretCheatTapCount = 0;
      let secretCheatTimeout;

      const startPress = (e) => {
          if (minijuegoActivo) return;
          if (estaDurmiendo) { despertar(); return; }
          if (tamagotchi?.estado === "muerto") return;

          if (e.type === 'touchstart') e.preventDefault();
          isLongPress = false;
          clearTimeout(longPressTimer);

          longPressTimer = setTimeout(() => {
              isLongPress = true;
              showWorkMenu();
          }, 1000); // 1 segundo para considerar pulsación larga
      };

      const endPress = () => {
          clearTimeout(longPressTimer);
          if (!isLongPress && !estaDurmiendo && tamagotchi?.estado !== "muerto") {
              // Acción para pulsación corta: muestra el menú de información
              const iC = document.getElementById("info-container");
              const iV = iC.style.display === "block";
              iC.style.display = iV ? "none" : "block";
              if (!iV) { actualizarInfoContainer(); }

              // --- LÓGICA DEL MENÚ DE ADMINISTRACIÓN INTEGRADA ---
              // Incrementa el contador de toques solo en pulsaciones cortas.
              adminTapCount++;
              if (adminTapCount === 1) {
                  adminTapTimeout = setTimeout(() => { adminTapCount = 0; }, 2000); // Resetea tras 2 seg.
              }
              if (adminTapCount === 10) {
                  clearTimeout(adminTapTimeout);
                  adminTapCount = 0; // Resetea el contador
                  if (tamagotchi && tamagotchi.nombre === "Carlos") {
                      const aO = document.getElementById("admin-overlay");
                      if (aO) { actualizarAdminMenu(); aO.style.display = "block"; disableControls(); }
                  }
              }

              // --- ¡NUEVO! Lógica para el truco secreto del mercadillo ---
              secretCheatTapCount++;
              if (secretCheatTapCount === 1) {
                  secretCheatTimeout = setTimeout(() => { secretCheatTapCount = 0; }, 1500); // 1.5 segundos para la secuencia
              }
              if (secretCheatTapCount === 5) {
                  clearTimeout(secretCheatTimeout);
                  secretCheatTapCount = 0;
                  sessionStorage.setItem('secretMercadilloCheat', 'true');
                  console.log("Truco del mercadillo activado para esta sesión."); // Mensaje secreto en consola
              }
          }
      };

      muñecoContainer.addEventListener("mousedown", startPress);
      muñecoContainer.addEventListener("touchstart", startPress, { passive: false });
      muñecoContainer.addEventListener("mouseup", endPress);
      muñecoContainer.addEventListener("touchend", endPress);
  }

  // Botones de Acción Principal
  document.getElementById("btn-hambre")?.addEventListener("click", (e) => { e.stopPropagation(); if (tamagotchi?.estado !== "muerto" && !estaDurmiendo) { updateFoodMenu(); toggleMenu("food-menu"); } });
  document.getElementById("btn-aburrimiento")?.addEventListener("click", (e) => { e.stopPropagation(); if (tamagotchi?.estado !== "muerto" && !estaDurmiendo) toggleMenu("game-menu"); }); 
  document.getElementById("btn-sueno")?.addEventListener("click", (e) => { e.stopPropagation(); if (tamagotchi?.estado !== "muerto" && !estaDurmiendo) toggleMenu("sleep-menu"); });
  document.getElementById("btn-higiene")?.addEventListener("click", (e) => { e.stopPropagation(); if (tamagotchi?.estado !== "muerto" && !estaDurmiendo) toggleMenu("clean-menu"); });

  // Botones dentro del nuevo menú de sueño
  document.getElementById("btn-dormir-largo")?.addEventListener("click", (e) => { e.stopPropagation(); document.getElementById("sleep-menu").style.display = "none"; if (!estaDurmiendo) { iniciarSueño(); actualizarInterfaz(); } });
  document.getElementById("btn-siesta")?.addEventListener("click", (e) => { 
    e.stopPropagation(); 
    document.getElementById("sleep-menu").style.display = "none";
    if (!estaDurmiendo) {
      iniciarSiesta();
    }
  });

  function iniciarSiesta() {
    if (estaDurmiendo || minijuegoActivo) return;

    disableControls();
    document.body.classList.add("sleeping");
    showPopup("Tu Tamagotchi está echando una siesta...", 14500);

    const duracionSiesta = 15000; // 15 segundos
    const suenoInicial = tamagotchi.sueno;
    const tiempoInicio = Date.now();

    const siestaInterval = setInterval(() => {
        const tiempoTranscurrido = Date.now() - tiempoInicio;
        const progreso = Math.min(tiempoTranscurrido / duracionSiesta, 1);

        tamagotchi.sueno = Math.max(0, suenoInicial * (1 - progreso));
        actualizarInterfaz();

        if (progreso >= 1) {
            clearInterval(siestaInterval);
            document.body.classList.remove("sleeping");
            enableControls();
        }
    }, 50);
  }

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
  // --- ¡NUEVO! Listener para el botón de ir al médico ---
  document.getElementById("btn-medico")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (tamagotchi.coins >= 170) {
          tamagotchi.coins -= 170;
          guardarTamagotchi();
          window.location.href = "medico.html";
      } else {
          showPopup("No tienes suficientes monedas para ir al médico. La consulta cuesta 170 monedas.", 4000);
      }
  });

  // --- ¡NUEVO! Listener para el botón de salir de paseo ---
  document.getElementById("btn-paseo")?.addEventListener("click", (e) => {
      e.stopPropagation();
      // Guardamos el estado actual antes de ir al paseo
      guardarTamagotchi();
      window.location.href = "paseo.html";
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
          if (isVisible) { 
              storeOverlay.style.display = "none"; 
              storeIcon.classList.remove("on-top"); // Quita la clase para bajar el z-index
              if (getComputedStyle(document.getElementById("inventory-overlay")).display === 'none') { 
                  enableControls(); 
              } 
          } else { 
              updateStorePrices(); 
              updateObjectStore(); 
              storeOverlay.style.display = "block"; 
              storeIcon.classList.add("on-top"); // Añade la clase para subir el z-index
              disableControls(); if(getComputedStyle(document.getElementById("store-food")).display === 'none' && getComputedStyle(document.getElementById("store-objects")).display === 'none') { document.getElementById("store-food").style.display = "block"; } } // Asegura que la sección de comida se muestre por defecto
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
               
               // --- NUEVA LÓGICA DE COMPRA CON TIERS ---
               const itemType = item.dataset.itemType;
               const tiersForType = objectTiers[itemType];
               let lastOwnedTierIndex = -1;
               for (let i = tiersForType.length - 1; i >= 0; i--) {
                 if (tamagotchi.objectInventory.includes(tiersForType[i].id)) {
                   lastOwnedTierIndex = i;
                   break;
                 }
               }
               const nextTier = tiersForType[lastOwnedTierIndex + 1];

               if (nextTier && nextTier.cost === costo) {
                 comprarObjeto(nextTier.id, nextTier.cost, nextTier.name);
               } else {
                 alert("Error al procesar la compra. Inténtalo de nuevo.");
               }
           });
       } else { console.warn("No se encontró botón de compra o span en el item de tienda de objetos:", item); }
   });
   console.log("Listeners de objetos asignados.");

  // --- FIN Listeners Botones Compra ---

  // --- Inventario de Objetos (Interruptor / Toggle) ---
  const inventoryIcon = document.getElementById("inventory-icon");
  const inventoryOverlay = document.getElementById("inventory-overlay");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const openMuseumBtn = document.getElementById("open-museum-btn");
  let currentPageIndex = 0;
  const pages = document.querySelectorAll(".inventory-page");

  // --- ¡NUEVO! Variables para el museo ---
  const museumOverlay = document.getElementById("museum-overlay"); // La variable se ha movido al ámbito global

  if (inventoryIcon && inventoryOverlay) {
      inventoryIcon.addEventListener("click", (e) => {
          e.stopPropagation(); if (estaDurmiendo || minijuegoActivo) return;
          
          const isVisible = getComputedStyle(inventoryOverlay).display === "flex";
          
          if (isVisible) {
              inventoryOverlay.style.display = "none"; // Si está visible, lo oculta
              const storeVisible = getComputedStyle(document.getElementById("store-overlay")).display === 'block';
              if (!storeVisible) { enableControls(); }
          } else {
              populateInventoryList(); // Si está oculto, lo rellena
              inventoryOverlay.style.display = "flex"; // y lo muestra
              disableControls(); // Desactiva los controles de fondo
          }
      });
  }

  // --- Listeners para paginación del inventario ---
  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => changePage(-1));
  }
  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => changePage(1));
  }


  function changePage(direction) {
    pages[currentPageIndex].classList.remove("active");
    currentPageIndex = (currentPageIndex + direction + pages.length) % pages.length;
    pages[currentPageIndex].classList.add("active");
  }

  // --- ¡NUEVO! Listeners para el Museo ---
  if (openMuseumBtn) {
    openMuseumBtn.addEventListener("click", () => {
      // 1. Cierra el inventario
      inventoryOverlay.style.display = "none";
      // 2. Rellena y abre el museo
      populateMuseumList();
      museumOverlay.style.display = "flex";
      // 3. Llama a disableControls() para mantener los controles de fondo desactivados,
      // pero ahora los del museo estarán exentos y funcionarán.
      disableControls();
    });
  }

  document.getElementById("close-museum-btn")?.addEventListener("click", () => {
    museumOverlay.style.display = "none";
    // Habilitar controles solo si ningún otro overlay principal está abierto
    if (getComputedStyle(document.getElementById("store-overlay")).display === 'none') {
      enableControls();
    }
  });

  // --- MODIFICADO: Redibujar el museo al cambiar de página ---
  document.getElementById("museum-prev-page")?.addEventListener("click", () => {
    populateMuseumList(); // Forzar recálculo
    changeMuseumPage(-1);
  });
  document.getElementById("museum-next-page")?.addEventListener("click", () => {
    populateMuseumList(); // Forzar recálculo
    changeMuseumPage(1);
  });

  // --- FUNCIÓN CORREGIDA ---
  function changeMuseumPage(direction) {
    const museumPages = document.querySelectorAll(".museum-page");
    if (museumPages.length === 0) return;
  
    museumPages[currentMuseumPageIndex].classList.remove("active");
    currentMuseumPageIndex = (currentMuseumPageIndex + direction + museumPages.length) % museumPages.length;
    museumPages[currentMuseumPageIndex].classList.add("active");
  }




  // --- Menú Admin --- (Sin cambios en su lógica interna)
  document.getElementById("admin-close")?.addEventListener("click", () => { /* ... listener admin-close ... */
      document.getElementById("admin-overlay").style.display = "none"; if (!estaDurmiendo && !minijuegoActivo && getComputedStyle(document.getElementById("store-overlay")).display === 'none' && getComputedStyle(document.getElementById("inventory-overlay")).display === 'none') { enableControls(); }
  });
  // --- ¡NUEVO! Listener para el botón de resetear personaje ---
  document.getElementById("admin-reset-character")?.addEventListener("click", () => {
      const confirmation = confirm("¿Estás seguro de que quieres borrar el personaje actual? Esta acción es irreversible y te llevará a la pantalla de creación.");
      if (confirmation) {
          localStorage.clear(); // Borra todos los datos guardados
          window.location.reload(); // Recarga la página
      }
  });

  document.getElementById("reset-stats")?.addEventListener("click", () => { /* ... */ });
  document.getElementById("admin-work-position")?.addEventListener("change", (e) => { /* ... */ });
  document.getElementById("admin-edad-aceptar")?.addEventListener("click", (e) => { /* ... */ });


  // --- Cerrar Menús/Overlays al hacer clic fuera (MODIFICADO para no cerrar work-menu) ---
  document.addEventListener("click", function (e) {
      const menusToCloseOnClickOutside = ["food-menu", "clean-menu", "game-menu", "sleep-menu"];
      let clickedInsideInteractiveElement = false;
      const interactiveAreas = ["#food-menu", "#clean-menu", "#game-menu", "#sleep-menu", "#work-menu", "#store-overlay", "#inventory-overlay", "#admin-overlay", "#store-icon", "#inventory-icon", ".buttons-container", "#muñeco-container"];
      for (const area of interactiveAreas) { if (e.target.closest(area)) { clickedInsideInteractiveElement = true; break; } }

      if (!clickedInsideInteractiveElement) {
          let somethingClosed = false; // ... (resto de la lógica sin cambios)
          menusToCloseOnClickOutside.forEach(id => { const m = document.getElementById(id); if (m && getComputedStyle(m).display === "block") { m.style.display = "none"; somethingClosed = true; } });
           const sO = document.getElementById("store-overlay"); if (sO && getComputedStyle(sO).display === 'block') { sO.style.display = 'none'; somethingClosed = true; }
           const iO = document.getElementById("inventory-overlay"); if (iO && getComputedStyle(iO).display === 'block') { iO.style.display = 'none'; somethingClosed = true; }
           if (somethingClosed && !estaDurmiendo && !minijuegoActivo && getComputedStyle(document.getElementById("store-overlay")).display === 'none' && getComputedStyle(document.getElementById("inventory-overlay")).display === 'none' && getComputedStyle(document.getElementById("admin-overlay")).display === 'none' && getComputedStyle(document.getElementById("work-menu")).display === 'none') { enableControls(); }
      }
  });

   // Evitar que clics dentro de los menús/overlays los cierren (propagación)
   ["food-menu", "clean-menu", "game-menu", "sleep-menu", "work-menu", "store-overlay", "inventory-overlay", "admin-overlay", "museum-overlay"].forEach((id) => {
       document.getElementById(id)?.addEventListener("click", (e) => e.stopPropagation());
   });

   // --- ¡NUEVO! Listeners para paginación del menú de admin ---
   document.getElementById("admin-prev-page")?.addEventListener("click", () => {
     changeAdminItemPage(-1);
   });
   document.getElementById("admin-next-page")?.addEventListener("click", () => {
     changeAdminItemPage(1);
   });

   function changeAdminItemPage(direction) {
     const pages = document.querySelectorAll(".admin-item-page");
     if (pages.length === 0) return;
     pages[currentAdminPageIndex].classList.remove("active");
     currentAdminPageIndex = (currentAdminPageIndex + direction + pages.length) % pages.length;
     pages[currentAdminPageIndex].classList.add("active");
   }

  console.log("Listeners de DOMContentLoaded asignados.");

}); // --- FIN DEL BLOQUE DOMContentLoaded ---
    
    // --- ¡NUEVO! Funciones para mostrar la escena de evento de abandono ---
    function typeWriter(element, text, onComplete) {
        let i = 0;
        element.innerHTML = ''; // Limpiar el contenido anterior
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 80); // Velocidad de escritura
            } else {
                // Ocultar el cursor parpadeante al final
                if (element.id === 'event-dialog') {
                    element.style.borderRight = 'none';
                    const existingStyle = document.getElementById('event-dialog-style');
                    if(existingStyle) existingStyle.remove();
                }
                if (onComplete) onComplete();
            }
        }
        // Añadir estilo para el cursor parpadeante
        const style = document.createElement('style');
        style.id = 'event-dialog-style';
        style.innerHTML = `#event-dialog::after { content: '▋'; animation: blink 1s step-end infinite; } @keyframes blink { 50% { opacity: 0; } }`;
        document.head.appendChild(style);
        type();
    }

    function showEventScene(character, dialog, duration, onEnd) {
        const overlay = document.getElementById('event-overlay');
        const charDisplay = document.getElementById('event-character');
        const dialogDisplay = document.getElementById('event-dialog');

        if (!overlay || !charDisplay || !dialogDisplay) return;

        // Ocultar el juego principal y mostrar la escena
        document.querySelector('.tamagochi-container').style.display = 'none';
        overlay.style.display = 'flex';
        charDisplay.innerHTML = `<pre>${character}</pre>`;

        typeWriter(dialogDisplay, dialog, () => {
            setTimeout(() => {
                overlay.style.display = 'none';
                document.querySelector('.tamagochi-container').style.display = 'flex';
                if (onEnd) onEnd();
            }, duration);
        });
    }
    function showWorkMenu() {
        disableControls();
        document.getElementById("work-menu").style.display = "block";
      }
    
    // --- Funciones para el juego Flappy Bird ---
    function startFlappyGame() {
        // Guardamos los datos actuales para que el otro HTML pueda leerlos
        guardarTamagotchi();
    
        // Esperar un instante para asegurar que localStorage se ha escrito
        setTimeout(() => {
            // Redirigimos al usuario a la nueva página del juego
            window.location.href = "FlappyBird.html";
        }, 100); // Un pequeño retardo es suficiente
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
  if (span && tamagotchi) span.textContent = tamagotchi.edadInterna.toFixed(1);
}

function actualizarAdminMenu() {
  if (!tamagotchi) return;
  actualizarAdminVidaInterna(); // Mantiene la actualización de la edad interna
  populateAdminObjectList(); // ¡NUEVO! Rellena la lista de objetos
  const inputPeso = document.getElementById("admin-peso");
  if (inputPeso) inputPeso.value = tamagotchi.peso.toFixed(1); // Rellena el input con el peso actual
}

document.getElementById("admin-edad-aceptar").addEventListener("click", (e) => {
  e.stopPropagation();
  const inputEdad = document.getElementById("admin-edad-interna");
  const inputDinero = document.getElementById("admin-dinero");
  const inputFlappy = document.getElementById("admin-flappy");
  const inputPeso = document.getElementById("admin-peso");
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
  
  // Actualización independiente del peso
  if (inputPeso.value.trim() !== "") {
    const newPeso = parseFloat(inputPeso.value);
    if (!isNaN(newPeso) && newPeso > 0) {
      tamagotchi.peso = newPeso;
      message += "Peso actualizado a " + newPeso.toFixed(1) + " kg. ";
    } else {
      alert("Por favor, ingresa un número válido para el peso.");
      return;
    }
  }

  if (message === "") {
    alert("No se ingresó ningún cambio.");
    return;
  }
  
  actualizarInterfaz();
  guardarTamagotchi();
  actualizarAdminMenu(); // Actualiza todos los campos del menú admin
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

// --- ¡NUEVO! Función para poblar la lista de objetos en el menú de admin ---
function populateAdminObjectList() {
  const commonList = document.getElementById("admin-common-list");
  const uncommonList = document.getElementById("admin-uncommon-list");
  const rareList = document.getElementById("admin-rare-list");
  const pages = document.querySelectorAll(".admin-item-page");

  if (!commonList || !uncommonList || !rareList) return;

  // Limpiar listas
  [commonList, uncommonList, rareList].forEach(list => list.innerHTML = "");

  const createItemEntry = (item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "admin-item";

    const textSpan = document.createElement("span");
    textSpan.textContent = item.name;
    itemDiv.appendChild(textSpan);

    const addBtn = document.createElement("button");
    addBtn.className = "admin-add-btn";
    addBtn.textContent = "Añadir";
    addBtn.onclick = (e) => {
      e.stopPropagation();
      if (tamagotchi) {
        tamagotchi.mercadilloInventory.push({ ...item }); // Añade una copia
        guardarTamagotchi();
        populateInventoryList(); // Actualiza el inventario visual si está abierto
        showPopup(`Objeto añadido: ${item.name}`, 2000);
      }
    };
    itemDiv.appendChild(addBtn);
    return itemDiv;
  };

  mercadilloObjects.common.forEach(item => commonList.appendChild(createItemEntry(item)));
  mercadilloObjects.uncommon.forEach(item => uncommonList.appendChild(createItemEntry(item)));
  mercadilloObjects.rare.forEach(item => rareList.appendChild(createItemEntry(item)));

  // Resetear y mostrar la primera página
  pages.forEach(page => page.classList.remove("active"));
  currentAdminPageIndex = 0;
  if (pages.length > 0) {
    pages[0].classList.add("active");
  }
}


// Función para manejar la compra de un objeto
// --- Asegúrate de que esta función exista (o añádela) en tm.js ---
function comprarObjeto(itemId, costo, itemName) {
  if (!tamagotchi) return; // Verificación de seguridad

  if (tamagotchi.coins >= costo) {
      tamagotchi.coins -= costo;

      if (!tamagotchi.objectInventory) {
          tamagotchi.objectInventory = [];
      }
      tamagotchi.objectInventory.push(itemId);

      actualizarInterfaz(); // Actualizar monedas mostradas, etc.
      guardarTamagotchi(); // Guardar el estado
      showPopup(`Has comprado ${itemName} por ${costo} monedas.`);
      
      // ¡Importante! Actualizar la tienda para mostrar el siguiente tier
      updateObjectStore();

  } else {
      showPopup(`No tienes suficientes monedas para comprar ${itemName}.`);
  }
}

// --- FUNCIÓN MODIFICADA para que el museo sea un catálogo de todos los objetos ---
function populateInventoryList() {
  const storeList = document.getElementById("inventory-store-list");
  const commonList = document.getElementById("inventory-common-list");
  const uncommonList = document.getElementById("inventory-uncommon-list");
  const rareList = document.getElementById("inventory-rare-list");
  const pages = document.querySelectorAll(".inventory-page");
  
  // Limpiar todas las listas
  [storeList, commonList, uncommonList, rareList].forEach(list => list.innerHTML = "");

  // 1. Poblar propiedades de la tienda (TODOS los tiers)
  for (const category in objectTiers) {
    const tiersForCategory = objectTiers[category];
    tiersForCategory.forEach(tier => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "inventory-item";

      if (tamagotchi.objectInventory.includes(tier.id)) {
        itemDiv.textContent = tier.name;
        itemDiv.classList.add("owned");
      } else {
        itemDiv.textContent = "???";
        itemDiv.classList.add("locked");
      }
      storeList.appendChild(itemDiv);
    });
  }

  // 2. Poblar objetos del mercadillo (TODOS los objetos posibles)
  const populateTreasurePage = (listElement, allPossibleItems) => {
    allPossibleItems.forEach(possibleItem => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "inventory-item";

      // Comprobar si el jugador tiene este objeto en su inventario
      const ownedItem = tamagotchi.mercadilloInventory.find(invItem => invItem.id === possibleItem.id);

      if (ownedItem) {
        // Contar cuántos de este objeto se poseen
        itemDiv.textContent = ownedItem.name;
        itemDiv.classList.add("owned");

      } else {
        itemDiv.textContent = "???";
        itemDiv.classList.add("locked");
      }

      listElement.appendChild(itemDiv);
    });
  };

  // Llamar a la función para cada categoría de tesoro
  populateTreasurePage(commonList, mercadilloObjects.common);
  populateTreasurePage(uncommonList, mercadilloObjects.uncommon);
  populateTreasurePage(rareList, mercadilloObjects.rare);

  // 3. Resetear y mostrar la primera página
  pages.forEach(page => page.classList.remove("active"));
  currentPageIndex = 0;
  if (pages.length > 0) {
    pages[0].classList.add("active");
  }

}

// --- ¡NUEVA FUNCIÓN! Para poblar el museo solo con objetos poseídos ---
function populateMuseumList(forceShowIds = null) {
  const commonList = document.getElementById("museum-common-list");
  const uncommonList = document.getElementById("museum-uncommon-list");
  const rareList = document.getElementById("museum-rare-list");
  const museumPages = document.querySelectorAll(".museum-page");

  [commonList, uncommonList, rareList].forEach(list => list.innerHTML = "");

  const populateMuseumPage = (listElement, rarity) => {
    // Agrupar objetos por ID para contar duplicados
    const ownedItems = tamagotchi.mercadilloInventory.filter(item => 
      mercadilloObjects[rarity].some(proto => proto.id === item.id)
    );

    // 1. Contar cuántos de cada objeto hay.
    const itemCounts = ownedItems.reduce((acc, item) => {
      acc[item.id] = (acc[item.id] || 0) + 1;
      return acc;
    }, {});

    // 2. Determinar qué IDs mostrar. Usar la lista forzada si existe, si no, calcularla.
    const idsToShow = forceShowIds 
      ? forceShowIds 
      : Object.keys(itemCounts).filter(id => itemCounts[id] > 1);

    // 3. Para cada tipo de objeto que está duplicado, mostrar todas las unidades EXCEPTO la primera.
    idsToShow.forEach(id => {
      const itemsOfThisType = ownedItems.filter(i => i.id === id);
      // Empezamos desde el segundo item (índice 1)
      for (let i = 1; i < itemsOfThisType.length; i++) {
        const item = itemsOfThisType[i];
        const itemDiv = document.createElement("div");
        itemDiv.className = "inventory-item owned";

        const textSpan = document.createElement("span");
        textSpan.textContent = item.name;
        itemDiv.appendChild(textSpan);

        const itemToSell = { ...item };
        const sellBtn = document.createElement("button");
        sellBtn.className = "museum-sell-btn";
        sellBtn.textContent = "Vender";
        sellBtn.onclick = (e) => { e.stopPropagation(); sellDuplicateObject(itemToSell, idsToShow); };
        itemDiv.appendChild(sellBtn);

        listElement.appendChild(itemDiv);
      }
    });
  };

  populateMuseumPage(commonList, 'common');
  populateMuseumPage(uncommonList, 'uncommon');
  populateMuseumPage(rareList, 'rare');

  // Asegurarse de que solo la página actual esté activa, sin resetearla a la primera.
  museumPages.forEach(page => page.classList.remove("active"));
  if (museumPages.length > 0) {
    // Vuelve a activar la página que ya estaba seleccionada.
    museumPages[currentMuseumPageIndex].classList.add("active");
  }
}

  // --- ¡NUEVA FUNCIÓN! Para vender un objeto duplicado desde el museo ---
  function sellDuplicateObject(item, currentDuplicateIds) {
    if (!tamagotchi) return;

    // Encontrar el índice del primer objeto que coincida para eliminarlo
    const index = tamagotchi.mercadilloInventory.findIndex(i => i.id === item.id);
    if (index > -1) {
      const soldItem = tamagotchi.mercadilloInventory.splice(index, 1)[0];
      const sellPrice = Math.floor(Math.random() * (soldItem.value[1] - soldItem.value[0] + 1)) + soldItem.value[0];
      tamagotchi.coins += sellPrice;
      guardarTamagotchi();
      actualizarInterfaz(); // Actualiza el contador de monedas
      // Volvemos a poblar el museo, forzando la vista con los IDs que estaban duplicados ANTES de la venta.
      populateMuseumList(currentDuplicateIds);
      populateInventoryList(); // Actualiza también el inventario principal
      showPopup(`Has vendido 1x ${soldItem.name} por ${sellPrice} monedas.`);
    }
  }

  //skyJUM`P
  