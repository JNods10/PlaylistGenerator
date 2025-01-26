import styles from './App.module.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { Home } from './components/Home/Home'
import { MusicDetails } from './components/MusicDetails/MusicDetails'
import { About } from './components/About/About'

/* Bootstrap imports */
import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap styles
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Bootstrap JavaScript (optional)

function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Navbar /> {/* Navbar is shown on every page */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/musicDetails' element={<MusicDetails />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
