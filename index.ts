import * as path from 'path'
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

  // copy the shared template
  // let sharedTemplate = path.resolve(__dirname, "templates", `_shared_${lang}`);
  // await fse.copy(sharedTemplate, projectDir);

  // copy the template
  let template = path.resolve(__dirname, 'templates', lang)
  if (fse.existsSync(template)) {
    await fse.copy(template, projectDir, { overwrite: true })
  }

  // rename dotfiles
  await fse.move(path.join(projectDir, 'gitignore'), path.join(projectDir, '.gitignore'))

  // add current versions of remix deps
  // ["dependencies", "devDependencies"].forEach(pkgKey => {
  //   for (let key in appPkg[pkgKey]) {
  //     if (appPkg[pkgKey][key] === "*") {
  //       // Templates created from experimental, alpha, beta releases should pin
  //       // to a specific version
  //       appPkg[pkgKey][key] = String(cliPkgJson.version).includes("-")
  //         ? cliPkgJson.version
  //         : "^" + cliPkgJson.version;
  //     }
  //   }
  // });

  // write package.json
  // await fse.writeFile(
  //   path.join(projectDir, "package.json"),
  //   JSON.stringify(appPkg, null, 2)
  // );

  if (install) {
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
