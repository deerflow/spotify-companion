process.on('uncaughtException', (err, origin) => {
    console.error(err, origin);
});
