const path = require('path')
const spawn = require('child_process').spawn

export function enhance(filename) {
  const dir = path.resolve(path.dirname(filename))
  return execute('docker', [
    'run',
    '--rm',
    '-v',
    `${dir}:/ne/input`,
    'alexjc/neural-enhance',
    `/ne/input/${path.basename(filename)}`
  ])
}

function execute(cmd, args) {
  return new Promise((resolve, reject) => {
    console.log(`${cmd} ${args.join(' ')}`)
    const proc = spawn(cmd, args)

    proc.stdout.on('data', data => {
      console.log(data.toString())
    })

    proc.on('error', reject)
    proc.on('exit', (code, signal) => {
      if (!code) return resolve(signal)
      reject(new Error(`Exited with code ${code} (${signal})`))
    })
  })
}
