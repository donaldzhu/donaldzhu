const fs = require('fs/promises')
const { SKIP_IMG, SKIP_VIDEO } = require('./resizeImages/config')

const forEachFile = async (path, callback) => {
  const files = await fs.readdir(path)
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i]
    const fileData = await fs.readFile(`${path}/${fileName}`, 'utf8')
    callback(fileName, fileData, files)
  }
}

const mapObject = async (object, callback) => {
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = object[key]
    await callback(key, value, i)
  }
  return object
}

const emptyDir = async folderPath => {
  if (SKIP_IMG && SKIP_VIDEO) return
  try {
    await fs.rm(folderPath, { recursive: true })
  } catch (err) {
    if (err.code !== 'ENOENT')
      throw err
  }
  await fs.mkdir(folderPath)
}

exports.forEachFile = forEachFile
exports.mapObject = mapObject
exports.emptyDir = emptyDir
