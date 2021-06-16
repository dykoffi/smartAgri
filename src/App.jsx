import React, { useEffect, useState } from "react"
import { humiditeAir, humiditeSol, niveau, luminosite, socket, temperature } from "./functions/graph"
import logoS from "./logo.jpg"
import { ask } from './functions/comm'
import html2canvas from 'html2canvas';


const App = () => {
  const [listen, setListen] = useState(false)
  const [camera, setCamera] = useState(false)
  const [arrosage, setArrosage] = useState(false)
  const [transcript, settranscript] = useState(false)
  const [recon, setrecon] = useState(new (window.webkitSpeechRecognition)())
  const [speaker, setspeaker] = useState(window.speechSynthesis)
  const [utterThis, setutterThis] = useState(new SpeechSynthesisUtterance())
  // const [data, setData] = useState({})

  useEffect(() => {
    socket.emit("begin")
    socket.on("e", d => {
      niveau(d);
      // setData({ ...data, e: d })
    })
    socket.on("h", d => {
      humiditeAir(d);
      // setData({ ...data, h: d })
    })
    socket.on("s", d => {
      humiditeSol(d);
      // setData({ ...data, s: d })
    })
    socket.on("t", d => {
      temperature(d);
      // setData({ ...data, t: d })
    })
    socket.on("l", d => {
      luminosite(d);
      // setData({ ...data, l: d })
    })

  })
  useEffect(() => {
    utterThis.lang = "fr-FR"
    utterThis.text = "ok ok je suis la"
  })

  useEffect(() => {
    recon.lang = 'fr-FR';
    recon.onstart = () => { setListen(true) }
    recon.onend = () => { setListen(false) }
    recon.onresult = (event) => {
      let tt = event.results[0][0].transcript;

      settranscript(tt)

      let camon = /(lance|allume) (la)? caméra/
      let camoff = /(arrête|éteins) (la)? caméra/
      let arron = /(active|lance) (l\')?arrosage/
      let arroff = /(désactive|arrête) (l\')?arrosage/

      if (camon.test(tt)) {
        socket.emit("CAP002_ON")
        setCamera(true)
        utterThis.text = camera ? "La caméra est déja alumée" : "caméra alumée. vous pouvez observer la plante"
        speaker.speak(utterThis)
      } else if (camoff.test(tt)) {
        socket.emit("CAP002_OFF")
        setCamera(false)
        utterThis.text = "caméra éteinte"
        speaker.speak(utterThis)
      } else if (arroff.test(tt)) {
        socket.emit("CAP001_OFF")
        setArrosage(false)
        utterThis.text = "arrosage arrêté"
        speaker.speak(utterThis)
      } else if (arron.test(tt)) {
        socket.emit("CAP001_ON")
        setArrosage(true)
        utterThis.text = "arrosage activé."
        speaker.speak(utterThis)
        console.log("okokok");
      } else {
        utterThis.text = ask(tt)
        ask(tt) !== null && speaker.speak(utterThis)
      }
      recon.stop()
    }
  })


  function screenShot() {
    const iframe = document.getElementsByTagName('iframe');
    const screen = iframe[0]?.contentDocument?.body;

    html2canvas(screen)
      .then((canvas) => {
        const base64image = canvas.toDataURL('image/png');

        //  Enregistrement de l'image
        //  Appel à l'API 
        //  Fonction à exécuter à la recption de la réponse 


      });
  }



  function goListen() {
    if (listen) {
      recon.stop();
    } else {
      settranscript("")
      recon.start();
    }
  }

  return (
    <div className="App flex h-screen">
      <div className=" h-screen p-4 grid gap-4 grid-cols-3" style={{ flex: 3 }} id="data">
        <svg width="300" height="350" id="niveau" className="shadow-2xl">
          <g id="g"></g>
          <text fill="white" x="100" y="30" style={{ fontWeight: "bold", fontSize: "15px" }} >Niveau d'eau</text>
          <g>
            <text style={{ fontWeight: 'bold', fontSize: "90px", opacity: "0.85" }} fill="white" x="20" y="120" id="text" ></text>
            <text fill="yellow " style={{ fontSize: "20px" }} transform="translate(125, 70)">%</text>
          </g>
          <g id="gbar" transform="translate(270,330) rotate(180)">
            {/* <rect id="bar" y="0" height="0" width="40" opacity="0.6" ></rect> */}
          </g>
          <g id="details" transform="translate(20,160)">
            <text x="0" y="0" fill="white" style={{ fontSize: "12px" }}>
              <tspan x="0" dy="1.2em">Le niveau d'eau permet de </tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
            </text>
            <text transform="translate(0, 50)" x="0" y="0" fill="yellow" style={{ fontSize: "12px" }}>
              <tspan x="0" dy="1.2em">Le niveau d'eau permet de </tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
            </text>
            <g transform="translate(0,130)"  >
              <rect height="15" width="15" fill="yellow" opacity="0.5"></rect>
              <text transform="translate(20,15)" fill="white">Bon</text>
            </g>
          </g>
        </svg>
        <svg width="300" height="350" id="humiditeSol" >
          <g id="g"></g>
          <text fill="white" x="100" y="30" style={{ fontWeight: "bold", fontSize: "15px" }} >Humidite du  sol</text>
          <g>
            <text style={{ fontWeight: 'bold', fontSize: "90px", opacity: "0.85" }} fill="white" x="20" y="120" id="text" ></text>
            <text fill="yellow " style={{ fontSize: "20px" }} transform="translate(125, 70)">%</text>
          </g>
          <g transform="translate(270,330) rotate(180)">
            <rect id="bar" y="0" height="0" width="40" opacity="0.7" ></rect>
          </g>
          <g id="details" transform="translate(20,150)">
            <text x="0" y="0" fill="white" style={{ fontSize: "12px" }}>
              <tspan x="0" dy="1.2em">Le niveau d'eau permet de </tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
            </text>
            <text transform="translate(0, 50)" x="0" y="0" fill="yellow" style={{ fontSize: "12px" }}>
              <tspan x="0" dy="1.2em">Le niveau d'eau permet de </tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
            </text>
            <g transform="translate(0,130)"  >
              <rect height="15" width="15" fill="yellow" opacity="0.5"></rect>
              <text transform="translate(20,15)" fill="white">Bon</text>
            </g>
          </g>
        </svg>
        <svg width="300" height="350" id="humiditeAir" className="shadow-2xl">
          <g id="g"></g>
          <text fill="white" x="100" y="30" style={{ fontWeight: "bold", fontSize: "15px" }} >Humidite de l'air</text>
          <g>
            <text style={{ fontWeight: 'bold', fontSize: "90px", opacity: "0.85" }} fill="white" x="20" y="120" id="text" ></text>
            <text fill="yellow " style={{ fontSize: "20px" }} transform="translate(125, 70)">%</text>
          </g>
          <g transform="translate(10,280)">
            <rect id="bar" y="0" height="40" width="0" opacity="0.7" ></rect>
          </g>
          <g id="details" transform="translate(20,150)">
            <text x="0" y="0" fill="white" style={{ fontSize: "12px" }}>
              <tspan x="0" dy="1.2em">Le niveau d'eau permet de </tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
            </text>
            <text transform="translate(0, 50)" x="0" y="0" fill="yellow" style={{ fontSize: "12px" }}>
              <tspan x="0" dy="1.2em">Le niveau d'eau permet de </tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
            </text>
            <g transform="translate(0,100)"  >
              <rect height="15" width="15" fill="yellow" opacity="0.5"></rect>
              <text transform="translate(20,15)" fill="white">Bon</text>
            </g>
          </g>
        </svg>
        <svg width="300" height="350" className="" id="temperature">
          <g id="g"></g>
          <text fill="white" x="100" y="30" style={{ fontWeight: "bold", fontSize: "15px" }} >Temperature</text>
          <g>
            <text style={{ fontWeight: 'bold', fontSize: "90px", opacity: "0.85" }} fill="white" x="20" y="120" id="text" ></text>
            <text fill="yellow" style={{ fontSize: "20px" }} transform="translate(125, 70)">°</text>
          </g>
          <g id="gbar" transform="translate(10,280)">
            {/* <rect id="bar" y="0" height="40" width="0" opacity="0.7" ></rect> */}
          </g>
          <g id="details" transform="translate(20,150)">
            <text x="0" y="0" fill="white" style={{ fontSize: "12px" }}>
              <tspan x="0" dy="1.2em">Le niveau d'eau permet de </tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
            </text>
            <text transform="translate(0, 50)" x="0" y="0" fill="yellow" style={{ fontSize: "12px" }}>
              <tspan x="0" dy="1.2em">Le niveau d'eau permet de </tspan>
              <tspan x="0" dy="1.2em">favoriser l'arrosage de la terre.</tspan>
            </text>
            <g transform="translate(0,100)"  >
              <rect height="15" width="15" fill="yellow" opacity="0.5"></rect>
              <text transform="translate(20,15)" fill="white">Bon</text>
            </g>
          </g>
        </svg>
        <svg width="300" height="350" className="shadow-2xl" id="luminosite">
          <g id="g"></g>
          <text fill="white" x="100" y="30" style={{ fontWeight: "bold", fontSize: "15px" }} >Luminosite</text>
          <g>
            <text style={{ fontWeight: 'bold', fontSize: "90px", opacity: "0.85" }} fill="white" x="20" y="120" id="text" ></text>
            <text fill="yellow " style={{ fontSize: "20px" }} transform="translate(125, 70)">Lux</text>
          </g>
          <g id="details" transform="translate(20,150)">
            <g transform="translate(120, 30)">
              <circle id="soleil" cx="110" cy="30" r="120" fill="yellow" opacity="0" />
            </g>
            <g transform="translate(0,130)"  >
              <rect height="15" width="15" fill="yellow" opacity="0.5" ></rect>
              <text transform="translate(20,15)" fill="white">Bon</text>
            </g>
          </g>
        </svg>
        {
          camera &&
          <iframe src="http://192.168.43.231:8081" height="350" width="300"></iframe>
        }

      </div>
      <div>
        <button onClick={screenShot()}>Capture</button>
      </div>
      <div className="h-screen p-4 grid grid-cols-1 gap-10" style={{ flex: 1 }} id="action">
        {/* <img src={logoS} alt="" className="h-20 w-20" /> */}
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-red-400 flex items-center justify-center">
            <div onClick={goListen} className={`cursor-pointer h-12 w-12 rounded-full bg-white ${listen && 'animate-pulse'}`}></div>
          </div>
          <h3 className="text-white text-sm mt-4">{listen ? "Dites quelques chose" : "Appuyer pour parler"}</h3>
          <h1 className={`text-xl font-bold text-center 
          ${/(désactive|arrête|active|lance|éteins|allume) (la|l\')?\s*(caméra|arrosage)/.test(transcript) ? "text-white" : "text-yellow-300"}`}>
            {transcript}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default App;
