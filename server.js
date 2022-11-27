const express = require("express");
const { execSync } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/", (req, res) => {
  console.log(req);
  console.log("Got body:", req.body);

  const { images, name, scale } = req.body;

  const outputBasicLoop = path.join(__dirname, "images/tmp", `${name}.mp4`);
  const outputLoop = path.join(__dirname, "images/videos", `${name}.mp4`);

  images.forEach((image, i) => {
    const file = path.join(__dirname, "images/source", image.file);
    const output = path.join(
      __dirname,
      "images/tmp",
      `${name}-${i.toString().padStart(2, "0")}.jpg`
    );
    const outputCropped = path.join(
      __dirname,
      "images/tmp",
      `cropped-${name}-${i.toString().padStart(2, "0")}.jpg`
    );
    const outputCroppedFinal = path.join(
      __dirname,
      "images/tmp",
      `cropped-${name}-03.jpg`
    );
    console.log(file, output);
    execSync(`convert ${file} -resize ${scale * 100}% ${output}`);
    execSync(
      `convert ${output} -crop 720x1280+${-1 * image.left}+${
        -1 * image.top
      } ${outputCropped}`
    );
    if (i == 1) {
      execSync("cp " + outputCropped + " " + outputCroppedFinal);
    }
  });

  execSync(
    `ffmpeg -y -r 7 -i images/tmp/cropped-${name}-%02d.jpg  -c:v libx264 -r 30 -pix_fmt yuv420p ${outputBasicLoop}`
  );
  execSync(
    `ffmpeg -y -stream_loop 20 -i ${outputBasicLoop} -c copy ${outputLoop}`
  );

  res.json({ data: "ok" });
});



app.post("/video", (req, res) => {
  console.log(req);
  console.log("Got body:", req.body);

  const { images, name, scale } = req.body;

  const outputBasicLoop = path.join(__dirname, "images/tmp", `${name}.mp4`);
  const outputLoop = path.join(__dirname, "images/videos", `${name}.mp4`);

  images.forEach((image, i) => {
    const file = path.join(__dirname, "images/source-video", image.file);
    console.log(file);
    const output = path.join(
      __dirname,
      "images/tmp",
      `${name}-${i.toString().padStart(2, "0")}.mp4`
    );
    const outputCropped = path.join(
      __dirname,
      "images/tmp",
      `cropped-${name}-${i.toString().padStart(2, "0")}.mp4`
    );
    const outputCroppedFinal = path.join(
      __dirname,
      "images/tmp",
      `cropped-${name}-03.mp4`
    );
    console.log(file, output);
    execSync(`ffmpeg -y -i ${file} -vf "scale=ceil((iw*${scale})/2)*2:ceil((ih*${scale})/2)*2" ${output}`);
    execSync(`ffmpeg -y -i ${output} -filter:v "crop=720:1280:-${image.left}:-${image.top}" ${outputCropped}`)
    // execSync(
    //   `convert ${output} -crop 720x1280+${-1 * image.left}+${
    //     -1 * image.top
    //   } ${outputCropped}`
    // );
    if (i == 1) {
      execSync("cp " + outputCropped + " " + outputCroppedFinal);
    }
  });

  // execSync(
  //   `ffmpeg -y -r 6 -i images/tmp/cropped-${name}-%02d.jpg  -c:v libx264 -r 30 -pix_fmt yuv420p ${outputBasicLoop}`
  // );
  // execSync(
  //   `ffmpeg -y -stream_loop 20 -i ${outputBasicLoop} -c copy ${outputLoop}`
  // );

  res.json({ data: "ok" });
});


app.listen(process.env.PORT || 8080);
