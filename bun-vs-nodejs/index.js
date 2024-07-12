const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server running on port ${port}`) });

app.use((req, res, next) => {
    res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Test Server</title></head><body>Test</body></html>');
})