#!/usr/bin/env node

import Express from "express";

const app = Express();
const port = 3000;

app.use(Express.static("client"));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
