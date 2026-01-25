import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const writeJson = (path, data) => {
  fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

const packagePath = fileURLToPath(new URL('../package.json', import.meta.url))
const pkg = readJson(packagePath)
const version = pkg.version

const match = typeof version === 'string' ? version.match(/^(\d+)\.(\d+)\.(\d+)$/) : null
if (!match) {
  console.error(`Unsupported version format: ${version}. Expected x.y.z`)
  process.exit(1)
}

const major = Number(match[1])
const minor = Number(match[2]) + 1
const newVersion = `${major}.${minor}.0`

pkg.version = newVersion
writeJson(packagePath, pkg)

const lockPath = fileURLToPath(new URL('../package-lock.json', import.meta.url))
if (fs.existsSync(lockPath)) {
  const lock = readJson(lockPath)
  lock.version = newVersion
  if (lock.packages && lock.packages['']) {
    lock.packages[''].version = newVersion
  }
  writeJson(lockPath, lock)
}

console.log(`Bumped package version to ${newVersion}`)
