import {JsonEditor} from './jsonEditor'
import './App.css'
import {JsonEditorV2} from "./jsonEditorV2";

function App() {

  return (
    <>
    <JsonEditorV2 value={{
        arr: new Array(12).fill(0),
        object: {
            x: 1,
            y: 'sadasd',
            z: true
        }
    } } onValueChange={console.log} />
    </>
  )
}

export default App
