# Parcial #3 - DTW135

# Escape Room JavaScript: ¨La Cámara de los Cinco Desafios¨

Proyecto desarrollado para el Examen Parcial #3 de la asignatura Desarrollo y Técnicas de Aplicaciones Web - DTW135.

La aplicación consiste en un escape room web donde el usuario debe completar cinco niveles consecutivos para recuperar el acceso a una base de datos que contiene información
crítica para el funcionamiento de una ciudad inteligente. 

## Tecnologías utilizadas
- HTML5
- CSS3
- Bootstrap
- JavaScript
- Canvas
- Geolocation API
- MediaDevices API
- LocalStorage
- Web Workers

## Niveles implementados
### Nivel 1: El Guardian de la Ubicación

Obtiene la ubicación actual del usuario y muestra latitud y longitud.

### Nivel 2: El Cartografo Perdido

Dibuja un mapa simplificado, figuras básicas y marca la posición del usuario.

### Nivel 3: La Evidencia del Explorador

Permite acceder a la cámara, mostrar video en tiempo real, capturar una foto y guardarla en LocalStorage.

### Nivel 4: Nucleo de Procesamiento

Genera 20,000 datos simulados de temperatura y humedad, los procesa en un Web Worker y muestra estadísticas.

### Nivel 5: El Portal Cuantico

Genera 250,000 registros simulados, filtra valores negativos, calcula estadísticas y permite exportar los resultados en un archivo JSON.

## Cómo ejecutar el proyecto
1. Clonar o descargar el repositorio.
2. Abrir la carpeta en Visual Studio Code.
3. Ejecutar index.html con Live Server.
4. Completar los niveles en orden.

### Nota
Para que la ubicación y la cámara funcionen correctamente, se recomienda ejecutar el proyecto en localhost usando Live Server o en un entorno HTTPS.

### Integrantes
- Yaquelin Adriana Cruz Grijalva CG19057
- Moises Jonathan Martinez Saravia MS23056
- Eli Antonio Muñoz Vasquez MV22023
- Oscar Armando Santos Bonilla SB14009
