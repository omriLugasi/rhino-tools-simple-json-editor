import {JsonEditor} from './jsonEditor'
import './App.css'

function App() {

  return (
    <>
      <JsonEditor
        value={{
          string: 'value',
          string2: 'value',
          number: 0,
          boolean: true,
          null: null,
          arr: ['asdasd', false, [false]],
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
