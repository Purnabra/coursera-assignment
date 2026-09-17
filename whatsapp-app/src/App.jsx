import React from 'react'
import "./assets/global.css";
import LeftSideBar from "./components/LeftSideBar";
import Content from "./components/Content";
import AppContext from "./context/AppContext";



const App = () => {
  const [isToggle, setToggle] = React.useState(false);
  const changeContent = () => {
    //console.log('hello world');

    setToggle(!isToggle);
    // console.log(isToggle)

  }
  return (
    <AppContext value={changeContent} >


      <div className="container">
        <div className="whatsapp">
          {!isToggle && <LeftSideBar />}

          {isToggle && <Content />}

        </div>
      </div>



    </AppContext>


  )
}

export default App