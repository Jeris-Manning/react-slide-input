// C:\Users\WickedGoose\Desktop\rolled-slider\node_modules\react-scripts\config\webpack.config.js
// image base64 limits settings are here

import React, { useState } from "react";
import "./App.css";
import Slider from "./Slider";
import Skull from "./shrunkenSkull.png";

function App() {
  const [val, setVal] = useState(44);

  const changeVal = (v) => {
    setVal(v);
  };

  return (
    <div className="App">
      <Slider
        startVal={val}
        maxVal={100}
        onChange={changeVal}
        gripImage={Skull}
      />
      <h1>{val.toFixed(0)}</h1>
    </div>
  );
}

export default App;
