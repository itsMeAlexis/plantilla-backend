export const BITACORA = () => {
	
const bitacora = {
		success:      null,
		status:       0,
		process:      '',
        messageUSR:   '',
        messageDEV:   '',
		countData:    0,
        countDataReq: 0,
        countDataRes: 0,
		countMsgUSR:  0,
		countMsgDEV:  0,
		data:         [],
        loggedUser:   ''
	}
	return bitacora;
};

export const DATA = () => {
	
	const data = {
			success:      false,
			status:       0,
			process:      '',
			principal:    false,
            secuencia:    0,
            countDataReq: 0,
            countDataRes: 0,
            countFile:    0,
			messageUSR:   '',
			messageDEV:   '',
            method:       '',
            api:          '',
			dataReq:	  [],
			dataRes:      [],
			file:		  []
		}

	return data;
};

import * as fs from 'fs';
import * as path  from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, '..', 'logs');

// console.log(logDirectory);

// Asegúrate de que el directorio de logs exista
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

export const AddMSG = (bitacora, data, tipo, status=500, principal=false) => {
    if (tipo === 'OK'){
      data.success    = data.success   || true;
      bitacora.success = data.success   || true;
    } else {
      data.success    = data.success   || false;
      bitacora.success = data.success   || false;
    }
  
    data.status     = data.status     || status;
    data.process    = data.process    || 'No se especifico Proceso';
    data.principal  = data.principal  || principal;
    data.method     = data.method     || 'No se especifico Metodo';
    data.api        = data.api        || 'No se especifico API';
    data.secuencia++;
  
    if(data.messageDEV) {
      bitacora.messageDEV = data.messageDEV;
      bitacora.countMsgDEV++;
    }
  
    if(data.messageUSR) {
      bitacora.messageUSR = data.messageUSR;
      bitacora.countMsgUSR++;
    }
  
    if(data.dataReq) {
      data.countDataReq++;
      bitacora.countDataReq++;
    }
  
    if(data.dataRes) {
      data.countDataRes++;
      bitacora.countDataRes++;
    }
  
    if(data.file) {
      data.countFile++;
    }
  
    bitacora.status = data.status;
    bitacora.data.push(data);
    bitacora.countData++;
  
    // Crear el nombre del archivo basado en la fecha actual
    /*
    const date = new Date();
    const logFileName = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.txt`;
    const logFilePath = path.join(logDirectory, logFileName);
  
    //Obtener el método de la última petición
    //Esto es porque normalmente la primera petición es un GET para obtener la el id hospital del token del usuario logeado
    let dataCount = bitacora.countData - 1;
    //Quitar espacios en blanco y obtener solo el método
    let method = bitacora.data[dataCount].method.split(' ')[0];
    const logDate = new Date().toLocaleString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Mexico_City' });
    // Formatear el mensaje de log
    if (method !== 'GET' && method !== 'No') {//"No" es por si no se especifica el método y GET es para no imprimir las peticiones GET
      //console.log("method: ", method);
      const logMessage = `********************************************************************************\n${logDate} - Hora México\n${JSON.stringify(bitacora.data[dataCount], null, 2)}\n********************************************************************************\n`;
      
      // Escribir el mensaje de log en el archivo
      fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
          console.error('Error al escribir en el archivo de log:', err);
        }
      });
    }*/
    // console.log("bitacora", bitacora);
    return bitacora;
  };


  export const OK = (bitacora) => {
   return {
		success:     bitacora.success 	   || true,
		status:      bitacora.status 	   || 500,
		process:     bitacora.process      || 'No se especifico Proceso Principal',
        messageUSR:  bitacora.messageUSR   || 'No se especifico Mensaje Final de Usuario', 
        messageDEV:  bitacora.messageDEV   || 'No se especifico Mensaje Final Tecnico', 
		countData:   bitacora.countData    || 0,
        countDataReq:bitacora.countDataReq || 0,
        countDataRes:bitacora.countDataRes || 0,
		countMsgUSR: bitacora.countMsgUSR  || 0,
		countMsgDEV: bitacora.countMsgDEV  || 0,
		data:        bitacora.data         || [],
        session:     bitacora.session      || 'No se especifico Session de BD',
        loggedUser:  bitacora.loggedUser   || 'No se especificio el Usuario Logueado',
        date:        new Date()
	}
};

export const FAIL = (bitacora) => {
    return {
		success:     bitacora.success 	   || false,
		status:      bitacora.status 	   || 500,
		process:     bitacora.process      || 'No se especifico Proceso Principal',
        messageUSR:  bitacora.messageUSR   || 'No se especifico Mensaje Final de Usuario', 
        messageDEV:  bitacora.messageDEV   || 'No se especifico Mensaje Final Tecnico',  
		countData:   bitacora.countData    || 0,
        countDataReq:bitacora.countDataReq || 0,
        countDataRes:bitacora.countDataRes || 0,
		countMsgUSR: bitacora.countMsgUSR  || 0,
		countMsgDEV: bitacora.countMsgDEV  || 0,
		data:        bitacora.data         || [],
        session:     bitacora.session      || 'No se especifico Session de BD',
        loggedUser:  bitacora.loggedUser   || 'No se especificio el Usuario Logueado',
        respuesta: 0
	}
};


export const TRANSOPTIONS = () => {

    const transactionOptions = {
        readPreference: 'primary',
        //readPreference: 'secondary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
        maxCommitTimeMS: 1000
    }; 

    return transactionOptions;
};

//module.exports = { DATA, BITACORA, AddMSG, OK, FAIL, TRANSOPTIONS };

