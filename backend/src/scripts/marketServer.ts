import { server } from "../server";

const port = Number(process.env.PORT_APP || 4000);

server.listen(port, () => {
    console.log(`Market API on http://localhost:${port}`);
});
