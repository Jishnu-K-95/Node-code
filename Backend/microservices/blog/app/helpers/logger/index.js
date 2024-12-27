import moment from "moment/moment.js";
import logging from "../winston/index.js";

class Logger {
   logger;

   constructor() {
      this.logger = logging;
   }

   info(message) {
      this.logger.info(moment().format("YYYY-MM-DD HH:mm:ss ") + message);
   }

   error(message) {
      this.logger.error(moment().format("YYYY-MM-DD HH:mm:ss ") + message);
   }
}

export default Logger;
