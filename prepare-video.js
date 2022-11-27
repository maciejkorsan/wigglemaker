const { execSync } = require("child_process");
const fs = require("fs");


fs.readdirSync('images/raw-video').forEach(file => {
    console.log(file);
    const path = `images/raw-video/${file}`;

    const output = `images/source-video/${file.split('.')[0]}`;

    execSync(`ffmpeg -y -i ${path}  -filter_complex "[0]crop=iw/3:ih:0:0[left];[0]crop=iw/3:ih:1280:0[middle];[0]crop=iw/3:ih:2560:0[right]" -map "[left]" ${output}-left.mp4 -map "[middle]" ${output}-middle.mp4 -map "[right]" ${output}-right.mp4`);
});

console.log('Done 🎉');