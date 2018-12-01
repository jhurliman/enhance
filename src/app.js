import './stylesheets/main.css'

import './helpers/context_menu.js'
import './helpers/external_links.js'

import { ipcRenderer, webFrame, remote } from 'electron'
import env from 'env'

const app = remote.app
let imageFilename

main()

function main() {
  // webFrame.setZoomLevelLimits(1, 1)
  webFrame.setVisualZoomLevelLimits(1, 1)
  webFrame.setLayoutZoomLevelLimits(0, 0)

  document.getElementById('zoom-out').onclick = () => {
    if (!imageFilename) return
    console.log(`zoomout(${imageFilename})`)
    ipcRenderer.send('zoomout', imageFilename)
  }

  document.getElementById('zoom-in').onclick = () => {
    if (!imageFilename) return
    console.log(`zoomin(${imageFilename})`)
    ipcRenderer.send('zoomin', imageFilename)
  }

  ipcRenderer.on('error', (ev, err, filename) => {
    console.error(err)
  })

  ipcRenderer.on('done', (ev, filename, newFilename) => {
    console.log(`done(${filename}, ${newFilename})`)
    imageFilename = newFilename
    document.getElementById('image').src = imageFilename
  })

  setupGestures()
  setupDragDrop()
}

function setupGestures() {
  const $canvas = document.getElementById('surface')

  $canvas.addEventListener('wheel', e => {
    if (!e.ctrlKey) return

    const delta = Math.max(-1, Math.min(1, e.wheelDelta))
    console.log(e.x, e.y, delta)
  })
}

function setupDragDrop() {
  const $canvas = document.getElementById('surface')
  const $holder = document.getElementById('app')

  $holder.ondragover = () => false
  $holder.ondragleave = () => false
  $holder.ondragend = () => false

  $holder.ondrop = async e => {
    e.preventDefault()
    if (!e.dataTransfer.files.length) return false

    const f = e.dataTransfer.files[0]
    imageFilename = f.path

    loadImage(imageFilename).then(img => {
      console.log(`Loaded ${img.width}x${img.height} image`)
      console.log(`Canvas is ${$canvas.width}x${$canvas.height}`)

      const ctx = $canvas.getContext('2d')
      $canvas.width = img.width
      $canvas.height = img.height
      // ctx.width = img.width
      // ctx.height = img.height
      // ctx.drawImage(img, 10, 20, 100, 100)
      ctx.drawImage(img, 0, 0)
    }).catch(err => {
      alert(err)
    })

    return false
  }
}

function loadImage(filename) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = filename
  })
}
