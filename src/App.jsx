import NavBar from "#components/NavBar"
import Welcome from "#components/welcome"
import Dock from "#components/Dock"
import gsap from "gsap";
import { Draggable } from "gsap/Draggable"
import { Terminal } from "#windows";
gsap.registerPlugin(Draggable)

const App = () => {
  return (
    <main>
      <NavBar />
      <Welcome />
      <Dock />

      <Terminal />
    </main>
  )
}

export default App