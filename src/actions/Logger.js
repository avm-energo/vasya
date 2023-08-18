import VueLogger from 'vuejs3-logger'
import { createApp } from 'vue'
const isProduction = process.env.NODE_ENV === 'production';
// logLevels :  ['debug', 'info', 'warn', 'error', 'fatal']
const vlOptions = {
    isEnabled: true,
    logLevel : isProduction ? 'error' : 'debug',
    stringifyArguments : false,
    showLogLevel : true,
    showMethodName : true,
    separator: '|',
    showConsoleColors: true
};
// let config = await fetch('defaults.json')
// const a = JSON.parse(await config.text())
// vlOptions.logLevel = a.logLevel
// // create a dummy app that can be used as logger in other js modules
const app = createApp({})
app.use(VueLogger, vlOptions);
const logger = app.config.globalProperties.$log;

export {VueLogger, vlOptions, logger};

// export async function writeLog(typeLog, log){
//     console.log(typeLog + ' ' + log)

//     var FileSaver = require('file-saver');
//     var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
//     FileSaver.saveAs(blob, "hello world.txt");
// }


