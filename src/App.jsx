import { useState } from "react";
import "./App.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Generator from './pages/Generator';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="w-full h-full">
        <div className="mx-auto w-full max-w-5xl">
          <Router>
            <Routes>
              <Route path="/generator" element={<Generator />}
              />
            </Routes>
          </Router>
        </div>
      </div>
    </>
  )
}

export default App