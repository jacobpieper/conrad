import './style.css'

import Conrad from './src/submodules/3d/conrad'
import Detector from './src/submodules/3d/objects/detector'


const conrad = new Conrad()
const testSimulation = conrad.addSimulation('3d')

const detector = new Detector(testSimulation)
console.log(conrad)