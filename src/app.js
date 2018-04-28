import './stylesheets/main.css'

import './helpers/context_menu.js'
import './helpers/external_links.js'

import { ipcRenderer, remote } from 'electron'
import env from 'env'

const app = remote.app
let imageFilename

main()

function main() {
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

  setupDragDrop()
}

function setupDragDrop() {
  const holder = document.getElementById('app')

  holder.ondragover = () => false
  holder.ondragleave = () => false
  holder.ondragend = () => false

  holder.ondrop = async e => {
    e.preventDefault()
    if (!e.dataTransfer.files.length) return false

    const f = e.dataTransfer.files[0]
    imageFilename = f.path
    document.getElementById('image').src = imageFilename

    return false
  }
}
