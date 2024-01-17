import fs from 'fs/promises'
import { forEachFile } from '../utils'
import chalk from 'chalk'

const workDataPath = 'src/data/work'
const results: Record<string, string> = {}
let stringifiedResults: string

const run = async () => {
  await forEachFile(workDataPath + '/descriptions', (fileName, fileData) => {
    results[fileName.replace('.html', '')] = fileData
  })

  stringifiedResults = JSON.stringify(results)
  await fs.writeFile(workDataPath + '/workDescriptions.json', stringifiedResults)
  console.log(chalk.cyan('[parseDescription] Descriptions parsed!'))
}

run()