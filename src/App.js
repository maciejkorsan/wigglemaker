import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [images, setImages] = useState([]);
  const [scale, setScale] = useState(0.36);
  const [current, setCurrent] = useState(0);
  const [name, setName] = useState(Date.now());
  const switchBlendMode = () => {
    const update = [...images];
    update[current].mixBlendMode =
      update[current].mixBlendMode === "normal" ? "difference" : "normal";
    setImages(update);
  };

  const updateVisibility = (id) => {
    const update = [...images];
    update[id].visible = !update[id].visible;
    setImages(update);
  };

  const updateX = (value) => {
    const update = [...images];
    update[current].left = value;
    setImages(update);
  };

  const updateY = (value) => {
    const update = [...images];
    update[current].top = value;
    setImages(update);
  };

  const updateGlobalX = (value) => {
    const update = [...images];
    update.forEach(image => {
      image.left = image.left+value;
    })
    setImages(update);
  }

  const updateGlobalY = (value) => {
    const update = [...images];
    update.forEach(image => {
      image.top = image.top+value;
    })
    setImages(update);
  }

  const handleFiles = (e) => {
    const images = [];
    console.log(e.target.files);
    for (let i = 0; i < e.target.files.length; i++) {
      images.push({
        key: i,
        file: e.target.files[i].name,
        url: URL.createObjectURL(e.target.files[i]),
        mixBlendMode: "normal",
        visible: true,
        top: 0,
        left: 0,
      });
    }
    setImages(images);
  };

const generateVideo = () => {
  fetch('http://localhost:8080/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      images: images,
      name: name,
      scale: scale
    })
  }).then(res => res.json()).then(data => {
    console.log(data)
  }).catch(err => console.log(err))
}


  return (
    <div className="grid grid-cols-[200px,1fr] gap-4 min-h-screen">
      <style>
        {`
          @keyframes image1 {
            0% {opacity: 0}
            25% {opacity: 1}
            50% {opacity: 0}
            75% {opacity: 1}
          }

          @keyframes image2 {
            0% {opacity: 0}
            25% {opacity: 0}
            50% {opacity: 1}
            75% {opacity: 0}
          }


          .image-0 {
            animation: image2 1s steps(1, end) infinite;
          }

          .image-1 {
            animation: image1 1s steps(1, end) infinite;
          }

        `}
      </style>
      <div className=" p-4 ">
        <div className="sticky top-4 ">
          {images.length == 0 && (
            <div className="overflow-hidden">
            <input type="file" id="file" multiple onChange={handleFiles} />
            </div>
          )}

          {images.length > 0 && (
            <div>
              <label>
                ResultName
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                scale ({scale})
                <input
                type="range"
                min="0.05"
                max="1"
                step="0.005"
                  onChange={(e) => setScale(e.target.value)}
                  value={scale}
                />
              </label>

<div><button onClick={() => updateGlobalX(-10)}>Global X: -10</button><br/>
                <button onClick={() => updateGlobalX(-1)}>Global X: -1</button><br/>
                <button onClick={() => updateGlobalX(1)}>Global X: +1</button><br/>
                <button onClick={() => updateGlobalX(10)}>Global X: +10</button><br/>
                <button onClick={() => updateGlobalY(-10)}>Global Y: -10</button><br/>
                <button onClick={() => updateGlobalY(-1)}>Global Y: -1</button><br/>
                <button onClick={() => updateGlobalY(1)}>Global Y: +1</button><br/>
                <button onClick={() => updateGlobalY(10)}>Global Y: +10</button><br/><br/>
  </div>


              <div className="mt-8">
                <button
                  className={`block ${current === 0 && "bg-green-300"}`}
                  onClick={() => setCurrent(0)}
                >
                  First
                </button>
                <button
                  className={`block ${current === 1 && "bg-green-300"}`}
                  onClick={() => setCurrent(1)}
                >
                  Second
                </button>
                <button
                  className={`block ${current === 2 && "bg-green-300"}`}
                  onClick={() => setCurrent(2)}
                >
                  Third
                </button>
              </div>

              <div className="mt-8">
                
                <label>
                  X {images[current].left}<br />
                  <input
                    type="range"
                    min="0"
                    max="400"
                    step=".5"
                    value={images[current].left +400}
                    onChange={(e) => updateX(e.target.value - 400)}
                  />
                </label>
                <br />
                <label>
                  Y {images[current].top}<br />
                  <input
                    type="range"
                    min="0"
                    max="600"
                    step=".5"
                    value={images[current].top +600}
                    onChange={(e) => updateY(e.target.value-600)}
                  />
                </label>

                <button className={`block`} onClick={switchBlendMode}>
                  Switch blend mode
                </button>
              </div>

              <div className="mt-8">
                visibility
                <button
                  className={`block ${images[0].visible && "bg-green-300"}`}
                  onClick={() => updateVisibility(0)}
                >
                  First
                </button>
                <button
                  className={`block ${images[1].visible && "bg-green-300"}`}
                  onClick={() => updateVisibility(1)}
                >
                  Second
                </button>
                <button
                  className={`block ${images[2].visible && "bg-green-300"}`}
                  onClick={() => updateVisibility(2)}
                >
                  Third
                </button>
              </div>
              <div className="mt-8">
                <button onClick={generateVideo}>generate!</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-hidden w-full h-full p-4">
        <div className="border-green-600 border-4 w-[720px] h-[1280px] relative overflow-hidden ">
          {images?.map((image) => (
            <img
              key={image.key}
              style={{
                transform: `scale(${scale})`,
                left: image.left,
                top: image.top,
                mixBlendMode: image.mixBlendMode,
                zIndex: 10 - image.key,
                display: image.visible ? "block" : "none",
              }}
              className="origin-top-left max-w-none absolute top-0 left-0"
              src={image.url}
            />
          ))}
        </div>
      </div>

      <div className="z-50 fixed scale-[.2] border-4 w-[720px] h-[1280px] bottom-0 right-0 origin-bottom-right overflow-hidden ">
          {images?.map((image) => (
            <img
              key={image.key}
              style={{
                transform: `scale(${scale})`,
                left: image.left,
                top: image.top,
                zIndex: 10 - image.key,
              }}
              className={`origin-top-left max-w-none absolute top-0 left-0  image-${image.key}`}
              src={image.url}
            />
          ))}
        </div>
    </div>
  );
}

export default App;
