const express = require('express');
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const leftpad = require("leftpad");


const app = express();
app.use(express.json())



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/', (req, res) => {
    console.log(req)
    console.log('Got body:', req.body);

    const { images, name, scale} = req.body;


    const outputBasicLoop = path.join(__dirname, 'images/tmp', `${name}.mp4`);
    const outputLoop = path.join(__dirname, 'images/videos', `${name}.mp4`);

    images.map((image, i) => {
        const file = path.join(__dirname, 'images/source', image.file);
        const output = path.join(__dirname, 'images/tmp', `${name}-${leftpad(i, 2)}.jpg`);
        const outputCropped = path.join(__dirname, 'images/tmp', `cropped-${name}-${leftpad(i, 2)}.jpg`);
        const outputCroppedFinal = path.join(__dirname, 'images/tmp', `cropped-${name}-03.jpg`);
        console.log(file, output);
        execSync(`convert ${file} -resize ${scale*100}% ${output}`);
        execSync(`convert ${output} -crop 720x1280+${-1*image.left}+${-1*image.top} ${outputCropped}`);
        if (i==1) {
            execSync('cp ' + outputCropped + ' ' + outputCroppedFinal);
        }

    })
    
    execSync(`ffmpeg -y -r 6 -i images/tmp/cropped-${name}-%02d.jpg  -c:v libx264 -r 30 -pix_fmt yuv420p ${outputBasicLoop}`);
    execSync(`ffmpeg -y -stream_loop 20 -i ${outputBasicLoop} -c copy ${outputLoop}`)
    // convert a02.jpg -crop 720x1280+17+204 o04.jpg
    // ffmpeg -stream_loop 20 -i EinsteinSlideShow.mp4 -c copy output.mp4     
    // ffmpeg -r 6 -i o%02d.jpg -c:v libx264 -r 30 -pix_fmt yuv420p EinsteinSlideShow.mp4
    // execSync(
    //     `convert ${escaped.join(" ")} -layers flatten results/png/${fileName}.png`,
    //     { stdio: ["ignore", "ignore", "ignore"] },
    //     (error, stdout, stderr) => {
    //       const ok = stdout;
    //       if (error) {
    //         console.log(escaped);
    //         console.log(`error: ${error.message}`);
    //         return;
    //       }
    //       if (stderr) {
    //         console.log(escaped);
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //       }
    //     }
    //   );

    res.json({data: 'ok'})
});


app.listen(process.env.PORT || 8080);

