const fs = require('fs/promises')
const { forEachFile } = require('./utils.js')
const chalk = require('chalk')

const workDataPath = 'src/data/work'
let results = {}

const run = async () => {
  await forEachFile(workDataPath + '/descriptions', (fileName, fileData) => {
    results[fileName.replace('.html', '')] = fileData
  })

  results = JSON.stringify(results)
  await fs.writeFile(workDataPath + '/workDescriptions.json', results)
  console.log(chalk.cyan('[parseDescription] Descriptions parsed!'))
}

run()