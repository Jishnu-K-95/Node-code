import winston from "winston";

const logging = winston.createLogger({
   transports: [
      new winston.transports.File({
         level: "info",
         filename: "projects.log",
         handleExceptions: true,
         json: true,
         maxsize: 10124 * 200,
         maxFiles: 5,
         colorize: true,
         format: winston.format.combine(
            winston.format.timestamp({
               format: "YYYY-MM-DD hh:mm:ss A ZZ",
            }),
            winston.format.simple()
         ),
         timestamp: true,
      }),
      new winston.transports.Console({
         level: "debug",
         handleExceptions: true,
         json: false,
         colorize: true,
      }),
   ],
   // do not exit on handled exceptions
   exitOnError: false,
});

// create a stream object with a 'write' function that will be used by `morgan`
logging.stream = {
   write: (message, encoding) => {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      logging.info(message);
   },
};

export default logging;
