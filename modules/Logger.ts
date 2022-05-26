import fs from 'fs';
import { resolve } from 'path';

process.on('uncaughtException', (err, origin) => {
    console.error(err);
    fs.writeFileSync(
        resolve(__dirname, `../logs/error-${new Date().toISOString()}.log`),
        `Error : ${err}\nOrigin : ${origin}`
    );
});
