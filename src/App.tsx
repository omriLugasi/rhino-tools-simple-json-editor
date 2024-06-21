import {JsonEditor} from './jsonEditor'
import './App.css'
import {JsonEditorV2} from "./jsonEditorV2";

function App() {

  return (
    <>
    <JsonEditorV2 value={{
        object: {
            x: 1,
            y: 'sadasd',
            z: true,
            time: new Date(),
            nObj: {}
        },
        arr: new Array(12).fill(0)
    } } onValueChange={console.log} />
    </>
  )
}

export default App
