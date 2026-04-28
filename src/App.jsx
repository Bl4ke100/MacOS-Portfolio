import NavBar from "#components/NavBar"
import Welcome from "#components/welcome"
import Dock from "#components/Dock"
import gsap from "gsap";
import { Draggable } from "gsap/Draggable"
import Terminal from "#windows/Terminal";
import Safari from "#windows/Safari";
import Resume from "#windows/Resume";
import Finder from "#windows/Finder";
import Text from "#windows/Text";
import Img from "#windows/Img";
import Contact from "#windows/Contact";
import Home from "#components/Home";
import Photos from "#windows/Photos";
gsap.registerPlugin(Draggable)

const App = () => {
  return (
    <main>
      <NavBar />
      <Welcome />
      <Dock />

      <Terminal />
      <Safari />
      <Contact />
      <Resume />
      <Finder />
      <Text />
      <Img />
      <Home />

      <Photos />
    </main>
  )
}

export default App