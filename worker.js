self.onmessage = function(e) {
    const { tipo, datos } = e.data;

    if (tipo === 'nivel4') {
        let totalTemp = 0;
        let totalHum = 0;
        let maxTemp = -Infinity;
        let minTemp = Infinity;
        let maxHum = -Infinity;
        let minHum = Infinity;
        const totalRegistros = datos.length;

        for (let i = 0; i < totalRegistros; i++) {
            const registro = datos[i];
            totalTemp += registro.temperatura;
            totalHum += registro.humedad;

            if (registro.temperatura > maxTemp) maxTemp = registro.temperatura;
            if (registro.temperatura < minTemp) minTemp = registro.temperatura;
            if (registro.humedad > maxHum) maxHum = registro.humedad;
            if (registro.humedad < minHum) minHum = registro.humedad;
        }

        self.postMessage({
            tipo: 'resultadoNivel4',
            stats: {
                promedioTemperatura: totalTemp / totalRegistros,
                promedioHumedad: totalHum / totalRegistros,
                maximaTemperatura: maxTemp,
                minimaTemperatura: minTemp,
                maximaHumedad: maxHum,
                minimaHumedad: minHum
            }
        });
    } 
    
    if (tipo === 'nivel5') {
        const validos = [];
        let totalTemp = 0;

        for (let i = 0; i < datos.length; i++) {
            const r = datos[i];
            if (r.temperatura >= 0 && r.humedad >= 0 && r.presion >= 0) {
                validos.push(r);
                totalTemp += r.temperatura;
            }
        }

        const cantidadValidos = validos.length;
        const promedioGeneral = cantidadValidos > 0 ? totalTemp / cantidadValidos : 0;

        const tempOrdenada = [...validos].sort((a, b) => b.temperatura - a.temperatura);
        const top10Temp = tempOrdenada.slice(0, 10);

        const presOrdenada = [...validos].sort((a, b) => b.presion - a.presion);
        const top10Pres = presOrdenada.slice(0, 10);

        self.postMessage({
            tipo: 'resultadoNivel5',
            stats: {
                cantidadValidos: cantidadValidos,
                promedioGeneral: promedioGeneral,
                top10Temperaturas: top10Temp,
                top10Presiones: top10Pres
            }
        });
    }
};
