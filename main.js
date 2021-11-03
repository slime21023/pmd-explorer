import {
    Scene,
    WebGLRenderer,
    OrthographicCamera,
    AmbientLight,
    DirectionalLight
} from './build/three.module.js'
import { GUI } from './jsm/libs/dat.gui.module.js'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { OutlineEffect } from './jsm/effects/OutlineEffect.js'
import { MMDLoader } from './jsm/loaders/MMDLoader.js'

const scale = 30
const scene = new Scene()
const renderer = new WebGLRenderer({ antialias: true })
renderer.autoClear = false
const effect = new OutlineEffect(renderer)
const camera = new OrthographicCamera(
    window.innerWidth / scale / - 2,
    window.innerWidth / scale / 2,
    window.innerHeight / scale / 2,
    window.innerHeight / scale / - 2,
    0.1,
    1000
)
camera.position.z = 25
camera.lookAt(0, 0, 0)

const cameraControls = new OrbitControls(camera, renderer.domElement)
cameraControls.minDistance = 10
cameraControls.maxDistance = 100
cameraControls.enableRotate = false

Ammo().then(AmmoLib => {
    Ammo = AmmoLib
    init()
    animate()
})

const animate = () => {
    requestAnimationFrame(animate)
    effect.render(scene, camera)
}

const init = () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    camera.position.z = 30

    const ambient = new AmbientLight(0x666666)
    scene.add(ambient)

    const directionalLight = new DirectionalLight(0x887766)
    directionalLight.position.set(- 1, 1, 1).normalize()
    scene.add(directionalLight)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)


    // model
    const onProgress = xhr => {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100
            console.log(`${Math.round(percentComplete, 2)}% downloaded`)
        }
    }

    // GUI
    const gui = new GUI()
    const skeleton = gui.addFolder('skeleton')

    const modelFile = 'models/mmd/kizunaai/kizunaai.pmx'
    const loader = new MMDLoader()

    loader.load(modelFile, object => {
        object.position.y = -10
        window.mesh = object
        console.log(object.skeleton.bones)
        mesh.skeleton.bones.forEach((item, index) => {
            skeleton.add({ name: `${item.name}-${index}` }, 'name')
        })
        skeleton.open()
        scene.add(object)
    }, onProgress, null)
}

window.addEventListener('resize', () => {
    camera.left = window.innerWidth / scale / - 2
    camera.right = window.innerWidth / scale / 2
    camera.top = window.innerHeight / scale / 2
    camera.bottom = window.innerHeight / scale / - 2
    camera.updateProjectionMatrix()

    effect.setSize(window.innerWidth, window.innerHeight)
})