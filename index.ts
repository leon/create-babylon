import path from 'path'
import { execSync } from 'child_process'
import fse from 'fs-extra'

export type Lang = 'ts' | 'js'

interface CreateAppArgs {
  projectDir: string
  lang: Lang
  install: boolean
}

async function createApp({ projectDir, lang, install }: CreateAppArgs) {
  // Create the app directory
  let relativeProjectDir = path.relative(process.cwd(), projectDir)
  let projectDirIsCurrentDir = relativeProjectDir === ''
  if (!projectDirIsCurrentDir) {
    if (fse.existsSync(projectDir)) {
      console.log(
        `️🚨 Oops, "${relativeProjectDir}" already exists. Please try again with a different directory.`,
      )
      process.exit(1)
    } else {
      await fse.mkdir(projectDir)
    }
  }

  // copy the template
  let template = path.resolve(__dirname, '../templates', lang)
  await fse.copy(template, projectDir)

  if (install) {
    console.log('📦 Installing dependencies...')
    execSync('npm install', { stdio: 'inherit', cwd: projectDir })
  }

  if (projectDirIsCurrentDir) {
    console.log(`That's it! Check the README for development and deploy instructions!`)
  } else {
    console.log(
      `That's it! \`cd\` into "${path.relative(
        process.cwd(),
        projectDir,
      )}" and check the README for development and deploy instructions!`,
    )
  }
}

export { createApp }
