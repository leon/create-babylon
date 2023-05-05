#!/usr/bin/env node

import path from 'path'
import chalkAnimation from 'chalk-animation'
import inquirer from 'inquirer'
import meow from 'meow'

import { createApp } from './index.js'

const help = `
  Usage:
    $ npm init babylon [flags...] [<dir>]

  If <dir> is not provided up front you will be prompted for it.

  Flags:
    --help, -h          Show this help message
    --version, -v       Show the version of this script
`

run().then(
  () => {
    process.exit(0)
  },
  (error) => {
    console.error(error)
    process.exit(1)
  },
)

async function run() {
  let { input, flags, showHelp, showVersion } = meow(help, {
    importMeta: import.meta,
    flags: {
      help: { type: 'boolean', default: false, shortFlag: 'h' },
      version: { type: 'boolean', default: false, shortFlag: 'v' },
    },
  })

  if (flags.help) showHelp()
  if (flags.version) showVersion()

  let anim = chalkAnimation.rainbow(`\nBabylon\n`)
  await new Promise((res) => setTimeout(res, 1500))
  anim.stop()

  console.log("Welcome to Babylon! Let's get you set up with a new project.")
  console.log()

  // Figure out the app directory
  let projectDir = path.resolve(
    process.cwd(),
    input.length > 0
      ? input[0]
      : (
          await inquirer.prompt<{ dir: string }>([
            {
              type: 'input',
              name: 'dir',
              message: 'Where would you like to create your app?',
              default: './my-babylon-app',
            },
          ])
        ).dir,
  )

  let answers = await inquirer.prompt<{
    lang: 'ts' | 'js'
    install: boolean
  }>([
    // {
    //   name: 'lang',
    //   type: 'list',
    //   message: 'TypeScript or JavaScript?',
    //   choices: [
    //     { name: 'TypeScript', value: 'ts' },
    //     { name: 'JavaScript', value: 'js' },
    //   ],
    // },
    {
      name: 'install',
      type: 'confirm',
      message: 'Do you want me to run `npm install`?',
      default: true,
    },
  ])

  await createApp({
    projectDir,
    lang: answers.lang || 'ts',
    install: answers.install,
  })
}
