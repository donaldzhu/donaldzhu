import chalk from 'chalk'
import randomString from 'randomstring'

console.log(chalk.cyan(randomString.generate({
  capitalization: 'lowercase',
  length: 5
})))