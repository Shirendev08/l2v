import { useState } from 'react';

function App() {
  const [base, setBase] = useState('')
  const [lang, setLang] = useState('mon')
  const [txt, setTxt] = useState([])

  const uploadImage = async () => {
    const file = document.querySelector("#img").files[0]
    const base64 = await convertBase64(file)
    setBase(base64.slice(base64.indexOf(',')+1,))

  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      
      fileReader.onload = (() => {
        resolve(fileReader.result)
      })

      fileReader.onerror = ((err) => {
        reject(err)
      })
    })
  }

  const selectLanguage = () => {
    const language = document.querySelector("#lang").value
    setLang(language)
  }
  
  
  const img2txt = async () => {
    await fetch("http://utils.mandakh.org:8000/utils/", {
      method: "POST",
      body: JSON.stringify({
        "action": "img2txt",
        "lang": lang,
        "img": base,
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then( async (data) =>  {
        setTxt(data.data.txt)
    })
    .catch((err) => {
      console.log(err.message)
    })
  }
  console.log(txt)
  
  return (
    <div className="App">
      <div className="top">
        <input type="file" id='img' className='fileInput' onChange={() => uploadImage()}/>
        <select name="Хэлээ сонго" id="lang" className="lang" onChange={() => selectLanguage()}>
          <option value="mon" className='selLang'>Монгол</option>
          <option value="eng" className='selLang'>Англи</option>
        </select>
        <button onClick={() => img2txt()} className="btn">Хөрвүүлэх</button>
      </div>
      <div className="textWrapper">
        <p className = "showTxt">{txt}</p>
      </div>
    </div>
  );
}

export default App;