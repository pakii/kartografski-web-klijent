const fs = require('fs');
const { version } = require('../package.json');

const manifest = {
    short_name: "Kartografski klijent",
    name: `Kartografski klijent ${version}`,
    icons: [
        {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon"
        },
        {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192"
        },
        {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512"
        }
    ],
    start_url: ".",
    display: "standalone",
    theme_color: "#000000",
    background_color: "#ffffff"
}

fs.writeFileSync('./public/manifest.json', JSON.stringify(manifest, null, 4));
