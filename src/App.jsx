import React, { useEffect, useState } from "react"
import { humiditeAir, humiditeSol, niveau, luminosite, socket, temperature } from "./functions/graph"
import { Data } from "./functions/stat"
import logoS from "./logo.jpg"
import { ask } from './functions/comm'
import Webcam from "react-webcam"
import { DatePicker, DayOfWeek, Dropdown } from "@fluentui/react"
import moment from "moment"
const App = () => {
  const [listen, setListen] = useState(false)
  const [camera, setCamera] = useState(false)
  const [transcript, settranscript] = useState(false)
  const [recon, setrecon] = useState(new (window.webkitSpeechRecognition)())
  const [speaker, setspeaker] = useState(window.speechSynthesis)
  const [utterThis, setutterThis] = useState(new SpeechSynthesisUtterance())
  const [data, setData] = useState({})
  const videoConstraints = {
    width: 1050,
    height: 1500,
    facingMode: "user"
  };

  const [inputs, setinputs] = useState({
    dateDebut: new Date(),
    dateFin: new Date(),
    type: "light"
  })


  useEffect(() => {
    socket.emit("begin")
    socket.on("e", d => {
      niveau(d);
    })
    socket.on("h", d => {
      humiditeAir(d);
    })
    socket.on("s", d => {
      humiditeSol(d);
    })
    socket.on("t", d => {
      temperature(d);
    })
    socket.on("l", d => {
      luminosite(d);
    })

  })
  useEffect(() => {
    utterThis.lang = "fr-FR"
    utterThis.text = "ok ok je suis la"
    socket.on("res", (data) => {
      Data(data)

    })
  })

  const getData = () => {
    socket.emit("data", inputs)
  }

  useEffect(() => {
    recon.lang = 'fr-FR';
    recon.onstart = () => { setListen(true) }
    recon.onend = () => { setListen(false) }
    recon.onresult = (event) => {
      let tt = event.results[0][0].transcript;

      settranscript(tt)

      let camon = /^(lance|allume|lancer|allumer|active|activer) (la)? caméra/
      let camoff = /^(désactiver|désactive|arrête|arrêter|éteins) (la)? caméra/
      let arron = /^(active|activer|lance|lancer) (l\')?arrosage/
      let arroff = /^(désactiver|désactive|arrête|arrêter) (l\')?arrosage/

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
        utterThis.text = "arrosage arrêté"
        speaker.speak(utterThis)
      } else if (arron.test(tt)) {
        socket.emit("CAP001_ON")
        utterThis.text = "arrosage activé."
        speaker.speak(utterThis)
      } else {
        utterThis.text = ask(tt)
        ask(tt) !== null && speaker.speak(utterThis)
      }
      recon.stop()
    }
  })




  function goListen() {
    if (listen) {
      recon.stop();
    } else {
      settranscript("")
      recon.start();
    }
  }

  return (
    <>
      <text>
        <h1 >TABLEAU DE BORD</h1>
      </text>
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
                <tspan x="0" dy="1.2em">L'eau est une ressource qui</tspan>
                <tspan x="0" dy="1.2em">permet de rafraichir l'espace.</tspan>
                <tspan x="0" dy="1.2em">de la plante</tspan>
              </text>
              <text transform="translate(0, 50)" x="0" y="0" fill="yellow" style={{ fontSize: "12px" }}>
                <tspan x="0" dy="1.2em">Inferieur à 20% = Mauvais</tspan>
                <tspan x="0" dy="1.2em">Entre 20 et 80% = Moyen</tspan>
                <tspan x="0" dy="1.2em">Superieure à 80% = Bon</tspan>
              </text>
              {/* <g transform="translate(0,130)">
              <rect height="15" width="15" fill="yellow" opacity="0.5"></rect>
              <text transform="translate(20,15)" fill="white">Bon</text>
            </g> */}
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
                <tspan x="0" dy="1.2em">L'humidité du sol est un facteur</tspan>
                <tspan x="0" dy="1.2em">de croissance de la plante</tspan>
              </text>
              <text transform="translate(0, 50)" x="0" y="0" fill="yellow" style={{ fontSize: "12px" }}>
                <tspan x="0" dy="1.2em">Inferieur à 20% = Mauvais</tspan>
                <tspan x="0" dy="1.2em">Entre 40% et 60% = Moyen</tspan>
                <tspan x="0" dy="1.2em">Entre 60% et 80% = Bon</tspan>
                <tspan x="0" dy="1.2em">Superieure à 80% = Excessive</tspan>
              </text>
              {/* <g transform="translate(0,130)"  >
              <rect height="15" width="15" fill="yellow" opacity="0.5"></rect>
              <text transform="translate(20,15)" fill="white">Bon</text>
            </g> */}
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
              <text transform="translate(0, 50)" x="0" y="0" fill="yellow" style={{ fontSize: "12px" }}>
                <tspan x="0" dy="1.2em">Inferieur à 20% = Mauvais</tspan>
                <tspan x="0" dy="1.2em">Entre 40% et 70% = Moyen</tspan>
                <tspan x="0" dy="1.2em">Entre 70% et 80% = Bon</tspan>
                <tspan x="0" dy="1.2em">Superieure à 80% = Excessive</tspan>
              </text>
              {/* <g transform="translate(220,100)"  >
              <rect height="15" width="15" fill="yellow" opacity="0.5"></rect>
              <text transform="translate(20,15)" fill="white">Bon</text>
            </g> */}
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
              <text transform="translate(0, 50)" x="0" y="0" fill="yellow" style={{ fontSize: "12px" }}>
                <tspan x="0" dy="1.2em">Inferieur à 15% = Mauvais</tspan>
                <tspan x="0" dy="1.2em">Entre 15% et 18% = Moyen</tspan>
                <tspan x="0" dy="1.2em">Entre 18% et 27% = Bon</tspan>
                <tspan x="0" dy="1.2em">Superieur à 30% = Excessive</tspan>
              </text>
              {/* <g transform="translate(220,100)">
              <rect height="15" width="15" fill="yellow" opacity="0.5"></rect>
              <text transform="translate(20,15)" fill="white">Bon</text>
            </g> */}
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
              {/* <g transform="translate(0,130)"  >
              <rect height="15" width="15" fill="yellow" opacity="0.5" ></rect>
              <text transform="translate(20,15)" fill="white">Bon</text>
            </g> */}
            </g>
          </svg>
          {
            camera &&
            <Webcam
              audio={false}
              height={350}
              screenshotFormat="image/jpeg"
              width={300}
              videoConstraints={videoConstraints}
            />
          }

        </div>
        <div>
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
      <div className=" App flex flex-col h-screen p-10 items-center justify-center" id="my_dataviz">
        <div className="flex">
          <div className="px-1 col-2" style={{ flex: 1 }}>
            <Dropdown
              placeholder="Type de donnees"
              onChange={(fe, { key }) => {
                setinputs({ ...inputs, type: key })
                getData({ ...inputs, type: key })
              }}
              options={[
                { key: "light", text: "Lumière" },
                { key: "moisureA", text: "Humidité de l'air" },
                { key: "moisureS", text: "Humidité du Sol" },
                { key: "temperature", text: "Température" },
              ]}
            />
          </div>
          <DatePicker value={new Date(inputs.dateDebut)} onSelectDate={(date) => {
            setinputs({ ...inputs, dateDebut: moment(date).format('YYYY-MM-DD') })
            getData({ ...inputs, dateDebut: moment(date).format('YYYY-MM-DD') })
          }} maxDate={new Date()} className='ml-2' firstDayOfWeek={DayOfWeek.Monday} placeholder="Date de debut" ariaLabel="Date de debut" /><span className='ml-2'>-</span>
          <DatePicker value={new Date(inputs.dateFin)} onSelectDate={(date) => {
            setinputs({ ...inputs, dateFin: moment(date).format('YYYY-MM-DD') })
            getData({ ...inputs, dateFin: moment(date).format('YYYY-MM-DD') })
          }} maxDate={new Date()} className='ml-2' firstDayOfWeek={DayOfWeek.Monday} placeholder="Date de fin" ariaLabel="Date de fin" />
        </div>
        <svg id="history" width="1200" height="600">
          <g id="g"></g>
        </svg>
      </div>
    </>
  );


}

export default App;
