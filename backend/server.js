import app from "./src/app.js";

const PORT = parseInt(process.env.PORT) || 8080;

app.listen(PORT, () => console.log(`Started listening on port ${PORT}`));
