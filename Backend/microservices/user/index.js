import http from "http";

import app from "./app/index.js";

const server = http.createServer(app);

const port = 5300 || process.env.PORT;

server.listen(port, () => {
   console.log(`Server listening on http://localhost:${port}`);
});
