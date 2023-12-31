const fs = require('fs')
const path = require('path')

const paletteFileName = 'createPalette.d.ts'

/* 
  USAGE
  node generate-palette.js --inputPath *your path* --outputPath *your path*
  node generate-palette.js -i *your path* -o *your path*
*/

const defaultThemeFilePath = path.join(
  path.resolve(__dirname),
  '..',
  'src',
  'theme.ts',
)

const defaultOutputPath = path.join(
  path.resolve(__dirname),
  '..',
  'src',
  paletteFileName,
)

function parseArguments() {
  const args = process.argv.slice(2)
  const parsedArgs = {
    inputPath: defaultThemeFilePath,
    outputPath: defaultOutputPath,
  }

  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i]
    const value = args[i + 1]

    if (flag === '-i' || flag === '--inputPath') {
      parsedArgs.inputPath = value
    } else if (flag === '-o' || flag === '--outputPath') {
      parsedArgs.outputPath = path.join(path.resolve(value), paletteFileName)
    }
  }

  return parsedArgs
}

function getPaletteOptions(inputPath) {
  const fileContent = fs.readFileSync(inputPath, 'utf8')

  const paletteOptionsMatch = fileContent.match(
    /const paletteOptions = {\n([\s\S]*?)\n}/,
  )

  if (!paletteOptionsMatch) {
    throw new Error('Error: Unable to find paletteOptions object in the file.')
  }

  const paletteOptionsContent = paletteOptionsMatch[1]

  const paletteOptions = eval(`({\n${paletteOptionsContent}\n})`)

  return paletteOptions
}

const interfacesToDeclare = [
  'Button',
  'TextField',
  'InputBase',
  'FormLabel',
  'SvgIcon',
  'IconButton',
  'Checkbox',
  'CircularProgress',
  'Radio',
  'Chip',
  'ButtonGroup',
  'FormControl',
]

function getPaletteDeclaration(paletteOptions) {
  return `import {
  PaletteColor,
  PaletteColorOptions,
} from '@mui/material/styles/createPalette'

/* AUTOGENERATED. YOUR CHANGES MAY BE OVERWRITTEN */

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    ${Object.keys(paletteOptions)
    .map(key => `'${key}'?: PaletteColorOptions`)
    .join('\n    ')}
  }

  interface Palette {
    ${Object.keys(paletteOptions)
    .map(key => `'${key}': PaletteColor`)
    .join('\n    ')}
  }
}

declare module '@mui/material' {
  ${interfacesToDeclare.map(interface => (
    `interface ${interface}PropsColorOverrides {
    ${Object.keys(paletteOptions)
    .map(key => `'${key}': true`)
    .join('\n    ')}
  }` 
  )).join('\n\n  ')}
}`
}

function saveFile(content, outputPath) {
  fs.writeFileSync(outputPath, content + '\n')

  console.log(`Palette declaration generated and saved to: ${outputPath}`)
}

function main() {
  try {
    const { inputPath, outputPath } = parseArguments()

    const paletteOptions = getPaletteOptions(inputPath)

    const paletteDeclaration = getPaletteDeclaration(paletteOptions)

    saveFile(paletteDeclaration, outputPath)
  } catch (error) {
    console.error(error.message)
  }
}

main()
