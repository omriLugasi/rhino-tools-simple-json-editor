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
        nullValue: null
    } } onValueChange={console.log} />
        <hr />
      <JsonEditor
        value={{
          string: 'value',
          string2: 'value',
          number: 0,
          boolean: true,
          null: null,
          arr: ['asdasd', false, [false]],
          object: {
              a: 5
          },
          test: {
            string: 'string',
            number: 1,
            boolean: false,
            arr: [
              {
                string: 'this is a string',
                boolean: true,
              },
            ],
          },
        }}
      />
    </>
  )
}

export default App
