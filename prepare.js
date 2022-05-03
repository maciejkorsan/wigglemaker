const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const leftpad = require("leftpad");


fs.readdirSync('images/raw').forEach(file => {
    console.log(file);
    const path = `images/raw/${file}`;

    const output = `images/source/${file}`;

    execSync(`convert -crop 33.33%x100% ${path} ${output}`);
});

console.log('Done 🎉');