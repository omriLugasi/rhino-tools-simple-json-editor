import {JsonEditor} from './jsonEditor'
import './App.css'
import {JsonEditorV2} from "./jsonEditorV2";

function App() {

  return (
    <>
    <JsonEditorV2 value={{
        string: 'string',
        number: 0,
        boolean: false,
        nullValue: null,
        arr: [
            'x',
            'y',
            {
                a: [
                    {
                        a: '123213'
                    }
                ]
            }
        ],
        obj: {
            number: 1,
            b: '2',
            c: false,
            nestedObj: {
                g1: 'asdsa',
                g2: 3
            }
        }
    } } onValueChange={console.log} />
    </>
  )
}

export default App
