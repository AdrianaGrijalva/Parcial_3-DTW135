/* JavaScript para Escape Room: La Cámara de los Cinco Desafíos */

const state = {
    cameraStream: null,
    n4Processed: false,
    n5Processed: false,
};

const selectors = {
    n1: {
        btnUbicar: document.getElementById('btn-n1-ubicar'),
        alertError: document.getElementById('alert-n1-error'),
        wrapperDatos: document.getElementById('wrapper-n1-datos'),
        latitud: document.getElementById('n1-latitud'),
        longitud: document.getElementById('n1-longitud'),
        btnAvanzar: document.getElementById('btn-n1-avanzar'),
        section: document.getElementById('seccion-nivel1'),
    },
    n2: {
        btnDibujar: document.getElementById('btn-n2-dibujar'),
        canvasMapa: document.getElementById('canvas-n2-mapa'),
        btnAvanzar: document.getElementById('btn-n2-avanzar'),
        section: document.getElementById('seccion-nivel2'),
    },
    n3: {
        btnCamara: document.getElementById('btn-n3-camara'),
        alertError: document.getElementById('alert-n3-error'),
        video: document.getElementById('video-n3'),
        btnCapturar: document.getElementById('btn-n3-capturar'),
        canvas: document.getElementById('canvas-n3-foto'),
        tituloPreview: document.getElementById('titulo-n3-preview'),
        imgGuardada: document.getElementById('img-n3-guardada'),
        btnAvanzar: document.getElementById('btn-n3-avanzar'),
        section: document.getElementById('seccion-nivel3'),
    },
    n4: {
        btnProcesar: document.getElementById('btn-n4-procesar'),
        wrapperProgreso: document.getElementById('wrapper-n4-progreso'),
        barra: document.getElementById('barra-n4'),
        cardResultados: document.getElementById('card-n4-resultados'),
        pTemp: document.getElementById('n4-p-temp'),
        maxTemp: document.getElementById('n4-max-temp'),
        minTemp: document.getElementById('n4-min-temp'),
        pHum: document.getElementById('n4-p-hum'),
        maxHum: document.getElementById('n4-max-hum'),
        minHum: document.getElementById('n4-min-hum'),
        btnAvanzar: document.getElementById('btn-n4-avanzar'),
        section: document.getElementById('seccion-nivel4'),
    },
    n5: {
        btnSimular: document.getElementById('btn-5-simular'),
        wrapperProgreso: document.getElementById('wrapper-n5-progreso'),
        barra: document.getElementById('barra-n5'),
        cardResultados: document.getElementById('card-n5-resultados'),
        validos: document.getElementById('n5-validos'),
        promedio: document.getElementById('n5-promedio'),
        listaTemp: document.getElementById('lista-n5-temp'),
        listaPres: document.getElementById('lista-n5-pres'),
        btnExportar: document.getElementById('btn-n5-exportar'),
        alertExito: document.getElementById('alert-n5-exito'),
        section: document.getElementById('seccion-nivel5'),
    },
};

function showElement(element) {
    element.classList.remove('d-none');
}

function hideElement(element) {
    element.classList.add('d-none');
}

function unlockSection(section) {
    section.classList.remove('nivel-bloqueado');
}

function scrollToSection(section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setButtonDisabled(button, disabled) {
    button.disabled = disabled;
    if (disabled) {
        button.classList.add('disabled');
    } else {
        button.classList.remove('disabled');
    }
}

function showError(element, message) {
    element.textContent = message;
    showElement(element);
}

function clearError(element) {
    element.textContent = '';
    hideElement(element);
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function actualizarProgreso(barra, porcentaje) {
    barra.style.width = `${porcentaje}%`;
    barra.textContent = `${porcentaje}%`;
}

function dibujarMapaInteractivo() {
    const canvas = selectors.n2.canvasMapa;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#4b5984';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#3e8cff';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y <= height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.strokeStyle = '#72d6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 240);
    ctx.lineTo(140, 200);
    ctx.lineTo(230, 100);
    ctx.lineTo(340, 160);
    ctx.lineTo(420, 90);
    ctx.stroke();

    const marker = { x: 420, y: 90 };
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(marker.x, marker.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Tú', marker.x - 18, marker.y - 16);
}

async function inicializarCamara() {
    clearError(selectors.n3.alertError);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showError(selectors.n3.alertError, 'Tu navegador no soporta la cámara.');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        state.cameraStream = stream;
        selectors.n3.video.srcObject = stream;
        showElement(selectors.n3.video);
        showElement(selectors.n3.btnCapturar);
    } catch (error) {
        showError(selectors.n3.alertError, 'No se pudo acceder a la cámara. Verifica permisos.');
    }
}

function capturarFotograma() {
    const video = selectors.n3.video;
    const canvas = selectors.n3.canvas;
    const contexto = canvas.getContext('2d');

    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    const datosUrl = canvas.toDataURL('image/png');
    selectors.n3.imgGuardada.src = datosUrl;
    showElement(selectors.n3.imgGuardada);
    showElement(selectors.n3.tituloPreview);
    showElement(selectors.n3.btnAvanzar);
}

function detenerCamara() {
    if (state.cameraStream) {
        state.cameraStream.getTracks().forEach((track) => track.stop());
        state.cameraStream = null;
    }
}

function procesarMatrizSensores() {
    if (state.n4Processed) {
        return;
    }

    const totalLecturas = 20000;
    const bloque = 500;
    let procesadas = 0;
    let sumaTemp = 0;
    let sumaHum = 0;
    let maxTemp = -Infinity;
    let minTemp = Infinity;
    let maxHum = -Infinity;
    let minHum = Infinity;

    showElement(selectors.n4.wrapperProgreso);
    setButtonDisabled(selectors.n4.btnProcesar, true);

    function procesarBloque() {
        const fin = Math.min(procesadas + bloque, totalLecturas);

        for (; procesadas < fin; procesadas += 1) {
            const temp = randomBetween(12, 35);
            const hum = randomBetween(18, 88);

            sumaTemp += temp;
            sumaHum += hum;
            maxTemp = Math.max(maxTemp, temp);
            minTemp = Math.min(minTemp, temp);
            maxHum = Math.max(maxHum, hum);
            minHum = Math.min(minHum, hum);
        }

        const porcentaje = Math.floor((procesadas / totalLecturas) * 100);
        actualizarProgreso(selectors.n4.barra, porcentaje);

        if (procesadas < totalLecturas) {
            window.setTimeout(procesarBloque, 10);
            return;
        }

        selectors.n4.pTemp.textContent = (sumaTemp / totalLecturas).toFixed(1);
        selectors.n4.maxTemp.textContent = maxTemp.toFixed(1);
        selectors.n4.minTemp.textContent = minTemp.toFixed(1);
        selectors.n4.pHum.textContent = (sumaHum / totalLecturas).toFixed(1);
        selectors.n4.maxHum.textContent = maxHum.toFixed(1);
        selectors.n4.minHum.textContent = minHum.toFixed(1);

        showElement(selectors.n4.cardResultados);
        showElement(selectors.n4.btnAvanzar);
        state.n4Processed = true;
        scrollToSection(selectors.n4.section);
    }

    procesarBloque();
}

function procesarRegistrosCuanticos() {
    if (state.n5Processed) {
        return;
    }

    const totalRegistros = 250000;
    const bloque = 5000;
    let procesados = 0;
    let validos = 0;
    let sumaTemp = 0;
    const mejoresTemp = [];
    const mejoresPres = [];

    showElement(selectors.n5.wrapperProgreso);
    setButtonDisabled(selectors.n5.btnSimular, true);

    function procesarBloque() {
        const fin = Math.min(procesados + bloque, totalRegistros);

        for (; procesados < fin; procesados += 1) {
            const temperatura = randomBetween(-40, 65);
            const presion = randomBetween(-20, 130);

            if (temperatura < 0 || presion < 0) {
                continue;
            }

            validos += 1;
            sumaTemp += temperatura;

            if (mejoresTemp.length < 10 || temperatura > mejoresTemp[mejoresTemp.length - 1]) {
                mejoresTemp.push(temperatura);
                mejoresTemp.sort((a, b) => b - a);
                if (mejoresTemp.length > 10) mejoresTemp.pop();
            }

            if (mejoresPres.length < 10 || presion > mejoresPres[mejoresPres.length - 1]) {
                mejoresPres.push(presion);
                mejoresPres.sort((a, b) => b - a);
                if (mejoresPres.length > 10) mejoresPres.pop();
            }
        }

        const porcentaje = Math.floor((procesados / totalRegistros) * 100);
        actualizarProgreso(selectors.n5.barra, porcentaje);

        if (procesados < totalRegistros) {
            window.setTimeout(procesarBloque, 10);
            return;
        }

        selectors.n5.validos.textContent = validos.toLocaleString();
        selectors.n5.promedio.textContent = validos === 0 ? '0.0' : (sumaTemp / validos).toFixed(1);
        selectors.n5.listaTemp.innerHTML = mejoresTemp.map((val) => `<li>${val.toFixed(1)} °C</li>`).join('');
        selectors.n5.listaPres.innerHTML = mejoresPres.map((val) => `<li>${val.toFixed(1)} hPa</li>`).join('');

        showElement(selectors.n5.cardResultados);
        showElement(selectors.n5.btnExportar);
        showElement(selectors.n5.alertExito);
        state.n5Processed = true;
        scrollToSection(selectors.n5.section);

        selectors.n5.btnExportar.addEventListener('click', () => {
            descargarJson({
                validos,
                temperaturaPromedio: validos === 0 ? 0 : Number((sumaTemp / validos).toFixed(1)),
                top10Temperaturas: mejoresTemp.map((valor) => Number(valor.toFixed(1))),
                top10Presiones: mejoresPres.map((valor) => Number(valor.toFixed(1))),
            }, 'registros_cuanticos.json');
        }, { once: true });
    }

    procesarBloque();
}

function descargarJson(data, nombreArchivo) {
    const contenido = JSON.stringify(data, null, 2);
    const blob = new Blob([contenido], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
}

function inicializarEventos() {
    selectors.n1.btnUbicar.addEventListener('click', () => {
        clearError(selectors.n1.alertError);
        setButtonDisabled(selectors.n1.btnUbicar, true);

        if (!navigator.geolocation) {
            showError(selectors.n1.alertError, 'Geolocalización no es compatible en este navegador.');
            setButtonDisabled(selectors.n1.btnUbicar, false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                selectors.n1.latitud.textContent = latitude.toFixed(6);
                selectors.n1.longitud.textContent = longitude.toFixed(6);
                showElement(selectors.n1.wrapperDatos);
                showElement(selectors.n1.btnAvanzar);
                setButtonDisabled(selectors.n1.btnUbicar, false);
            },
            (err) => {
                showError(selectors.n1.alertError, 'No se pudo obtener tu ubicación. Asegúrate de permitir el acceso.');
                setButtonDisabled(selectors.n1.btnUbicar, false);
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
    });

    selectors.n1.btnAvanzar.addEventListener('click', () => {
        unlockSection(selectors.n2.section);
        showElement(selectors.n2.btnDibujar);
        scrollToSection(selectors.n2.section);
    });

    selectors.n2.btnDibujar.addEventListener('click', () => {
        dibujarMapaInteractivo();
        showElement(selectors.n2.canvasMapa);
        showElement(selectors.n2.btnAvanzar);
    });

    selectors.n2.btnAvanzar.addEventListener('click', () => {
        unlockSection(selectors.n3.section);
        showElement(selectors.n3.btnCamara);
        scrollToSection(selectors.n3.section);
    });

    selectors.n3.btnCamara.addEventListener('click', () => {
        inicializarCamara();
    });

    selectors.n3.btnCapturar.addEventListener('click', () => {
        capturarFotograma();
    });

    selectors.n3.btnAvanzar.addEventListener('click', () => {
        detenerCamara();
        unlockSection(selectors.n4.section);
        showElement(selectors.n4.btnProcesar);
        scrollToSection(selectors.n4.section);
    });

    selectors.n4.btnProcesar.addEventListener('click', () => {
        procesarMatrizSensores();
    });

    selectors.n4.btnAvanzar.addEventListener('click', () => {
        unlockSection(selectors.n5.section);
        showElement(selectors.n5.btnSimular);
        scrollToSection(selectors.n5.section);
    });

    selectors.n5.btnSimular.addEventListener('click', () => {
        procesarRegistrosCuanticos();
    });
}

document.addEventListener('DOMContentLoaded', inicializarEventos);
