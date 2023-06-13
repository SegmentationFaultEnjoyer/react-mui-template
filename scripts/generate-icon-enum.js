const fs = require('fs')
const path = require('path')

const enumName = 'icon-names.enum.ts'

const defaultIconFolderPath = path.join(
  path.resolve(__dirname),
  '..',
  'src',
  'assets',
  'icons',
)

const defaultOutputPath = path.join(
  path.resolve(__dirname),
  '..',
  'src',
  'enums',
  enumName,
)

function parseArguments() {
  const args = process.argv.slice(2)
  const parsedArgs = {
    inputPath: defaultIconFolderPath,
    outputPath: defaultOutputPath,
  }

  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i]
    const value = args[i + 1]

    if (flag === '-i' || flag === '--inputPath') {
      parsedArgs.inputPath = value
    } else if (flag === '-o' || flag === '--outputPath') {
      parsedArgs.outputPath = path.join(path.resolve(value), enumName)
    }
  }

  return parsedArgs
}

function generateEnumName(fileName) {
  if (!fileName.includes('icon')) {
    throw new Error(
      `Invalid icon name: ${fileName}. Icon names must include 'icon'.`,
    )
  }
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/-icon/g, '')
    .replace(/-([a-z])/g, (_, match) => match.toUpperCase())
    .replace(/-/g, '')
}

function generateEnumValue(fileName) {
  return fileName.replace(/\.[^.]+$/, '').replace(/-icon/g, '')
}

function generateIconsEnum(folderPath) {
  const files = fs.readdirSync(folderPath)
  const enumValues = files
    .filter(file => file.endsWith('.svg'))
    .reduce((enumObj, file) => {
      const enumName = generateEnumName(file)
      const enumValue = generateEnumValue(file)
      enumObj[enumName] = enumValue
      return enumObj
    }, {})

  const enumDeclaration = `export enum ICON_NAMES {\n${Object.entries(
    enumValues,
  )
    .map(([enumName, enumValue]) => `  ${enumName} = '${enumValue}',`)
    .join('\n')}\n}`

  return enumDeclaration
}

function saveFile(enumCode, outputPath) {
  fs.writeFileSync(outputPath, enumCode + '\n')

  console.log(`Icon names enum generated and saved to: ${outputPath}`)
}

function main() {
  try {
    const { inputPath, outputPath } = parseArguments()
    const enumCode = generateIconsEnum(inputPath)

    saveFile(enumCode, outputPath)
  } catch (error) {
    console.error(error.message)
  }
}

main()
