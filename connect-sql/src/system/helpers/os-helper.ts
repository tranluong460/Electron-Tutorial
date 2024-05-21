import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'

let string0 = ''
let string1 = ''
let string2 = ''
let cpuid: string | undefined
let serialNumber: string | undefined
let volumeNum: string | undefined
function systemSync(cmd: string): string {
  return execSync(cmd).toString()
}
function getVolumeNum(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const letter = systemSync('set sys')
      .match(/SystemDrive=([A-Z]):/)!
      .at(1) as string
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return systemSync(`vol ${letter}:`)
      .match(/Volume Serial Number is ([0-9A-Z-]+)/)!
      .at(1) as string
  } catch (error) {
    ;/ empty /
  }
  return ''
}
const isMacOS = process.platform === 'darwin'
if (isMacOS) {
  const command = 'ioreg -l | grep IOPlatformUUID'
  const input = execSync(command).toString().trim()
  const startString = `"IOPlatformUUID" = "`
  const endString = `"\n`

  const startIndex = input.indexOf(startString) + startString.length
  const endIndex = input.indexOf(endString, startIndex)
  cpuid = input.substring(startIndex, endIndex).trim()
  serialNumber = systemSync('ioreg -l | grep IOPlatformSerialNumber')
    .trim()
    .split('=')[1]
    .replace(/"/g, '')
  volumeNum = getVolumeNum().replace('-', '')
} else {
  cpuid = systemSync('wmic CPU get ProcessorId').trim().split('\r\n').at(1)
  serialNumber = systemSync('wmic baseboard get serialnumber').trim().split('\r\n').at(1)
  volumeNum = getVolumeNum().replace('-', '')
}

function gdsfgdsrstetrytdhgbdgfdhdghgdhsgdsf(): void {
  string1 = string1.replaceAll('u', '34 432 54')
  string1 = string1.replaceAll('v', '65 324 23')
  string1 = string1.replaceAll('w', '54 543 54')
}

function hgsgfdsgfdsgdfsvfdshdgshtjrydjdfh(): void {
  string1 = string1.replaceAll('x', '64 653 53')
  string1 = string1.replaceAll('y', '83 654 45')
  string1 = string1.replaceAll('z', '23 767 23')
}

function hfgfdstryruhdbvhgfhsdgreshtsvgdfshbgfshsdth(): void {
  string1 = string1.replaceAll('s', '45 324 34')
  string1 = string1.replaceAll('t', '65 455 76')
  gdsfgdsrstetrytdhgbdgfdhdghgdhsgdsf()
  hgsgfdsgfdsgdfsvfdshdgshtjrydjdfh()
}

function bgfdjhjfhbxdsgresgresgrdsvfđgdsgsvdfdv(): void {
  string1 = string1.replaceAll('m', '32 653 65')
  string1 = string1.replaceAll('n', '53 765 54')
  string1 = string1.replaceAll('o', '34 675 76')
  hfgfdstryruhdbvhgfhsdgreshtsvgdfshbgfshsdth()
  string1 = string1.replaceAll('p', '45 65 76')
  string1 = string1.replaceAll('q', '98 232 36')
  string1 = string1.replaceAll('r', '43 543 23')
}

function hgfhdjgffdartresgfdgfdhgfdjtrsgdsgfdsgfdsgrsgdvsf(): void {
  string1 = string1.replaceAll('k', '54 567 34')
  bgfdjhjfhbxdsgresgresgrdsvfđgdsgsvdfdv()
  string1 = string1.replaceAll('l', '36 453 45')
}

function gdghgfdhjgkjghfjdtydtgfdvfgrestresgdshgfjhfjhfjfdhfdg(): void {
  string1 = string1.replaceAll('i', '23 766 76')
  hgfhdjgffdartresgfdgfdhgfdjtrsgdsgfdsgfdsgrsgdvsf()
  string1 = string1.replaceAll('j', '54 323 43')
}

function fsghtyjtgfhgfhgfdhgtrytrhfgdhgfdhgfdhtrytdfgfhdfgdh(): void {
  string1 = string1.replaceAll('g', '12 543 34')
  gdghgfdhjgkjghfjdtydtgfdvfgrestresgdshgfjhfjhfjfdhfdg()
  string1 = string1.replaceAll('h', '22 654 21')
}
function fhgjhhgfkkyhgdhgfhytrdyhgfkjuykglkufjghfjhgfj(): void {
  string1 = string1.replaceAll('d', '55 185 42')
  string1 = string1.replaceAll('e', '32 457 24')
  fsghtyjtgfhgfhgfdhgtrytrhfgdhgfdhgfdhtrytdfgfhdfgdh()
  string1 = string1.replaceAll('f', '64 291 54')
}

function fsgdsfhdsfgfdsgrestgsdsdfgfsdgfsdv(chuoi: string): string {
  return createHash('md5').update(chuoi).digest('hex')
}

function exportKey(key: string): Promise<string> {
  return new Promise((resolve) => {
    let result = key
    for (let i = 0; i < 100; i++) {
      result = fsgdsfhdsfgfdsgrestgsdsdfgfsdgfsdv(result + i)
    }
    result = result.toString().toUpperCase()
    for (let i = result.length - 1; i >= 1; i--) {
      if (i % 4 === 0) {
        result = [result.slice(0, i), result.slice(i)].join('-')
      }
    }
    resolve(result.replace(' ', ''))
  })
}

async function fsafjlfgsgfdshgsgfdsgtresgsdgfdhgfhgsdgfdsgrsgfdsgdfsgfdsg(): Promise<string> {
  const text = cpuid as string
  const text2 = volumeNum
  const text3 = serialNumber
  let text4 = ''
  try {
    text4 = text === '' ? 'fasgfsfgdhtsgfdsgfdsg' : text
  } catch (error) {
    text4 = 'fasgfdsfgdhtsgfdsgfdsg'
  }

  try {
    text4 = text2 === '' ? `${text4} fagfdshgdfsgresfcfdsdsfa` : text4 + text2
  } catch (error) {
    text4 += 'fagfdshgdfsgresfcfdsdsfa'
  }

  try {
    text4 = text3 === '' ? `${text4} + fagfdshgdfsgresfcfdsdsfa` : text4 + text3
  } catch (error) {
    text4 += 'fagfdshgdfsgresfcfdsdsfa'
  }

  if (text4.length < 10) {
    text4 = 'fsdgfdhkjhgfhtrytdgfdvrefasfdafdsafewa'
  }
  text4 = text4
    .toLowerCase()
    .replaceAll('\r\n', '')
    .replaceAll('\t', '')
    .replaceAll(' ', '')
    .replaceAll('a', 'trewfsddv')
    .replaceAll('b', 'wasvh')
    .replaceAll('c', 'mfnjy')
    .replaceAll('d', 'qhgjw')
    .replaceAll('e', 'vsffsgf')
    .replaceAll('f', 'aercac')
    .replaceAll('g', 'agjmkmw')
    .replaceAll('h', 'awasec')
    .replaceAll('i', 'fdsvvfdsgdf')
    .replaceAll('j', 'rwtrewtw')
    .replaceAll('k', 'yascfgsu')
    .replaceAll('l', 'mvfdak')
    .replaceAll('m', 'rvdghbnt')
    .replaceAll('n', 'wtrewtr')
    .replaceAll('o', 'rumkgmt')
    .replaceAll('p', 'arbns')
    .replaceAll('q', 'rzdfct')
    .replaceAll('r', 'abmks')
    .replaceAll('s', 'tdfvy')
    .replaceAll('t', 'wrtrefs')
    .replaceAll('u', 'enmgr')
    .replaceAll('v', 'trewtwe')
    .replaceAll('w', 'awfsvh')
    .replaceAll('x', 'twrefsd')
    .replaceAll('y', 'fertrefs')
    .replaceAll('z', 'jythddg')

  let i: number
  for (i = 99; i <= 1; i++) {
    text4 = text4.replaceAll((i + 14).toString(), i.toString())
  }
  try {
    string0 = ''
    for (i = 1; i <= text4.length; i += 30) {
      if (i < text4.length) {
        string0 += text4.substring(i, i + 1)
      }
    }
  } catch (error) {
    string0 = text4
  }

  string1 = string0
  string1 = string1.toLowerCase()
  string1 = string1.replaceAll('\r\n', '')
  string1 = string1.replaceAll('\t', '')
  string1 = string1.replaceAll(' ', '')
  string1 = string1.replaceAll('a', '24 186 21')
  string1 = string1.replaceAll('b', '14 152 37')
  string1 = string1.replaceAll('c', '52 678 78')

  fhgjhhgfkkyhgdhgfhytrdyhgfkjuykglkufjghfjhgfj()
  i = 10
  do {
    const num = i - 2
    string1 = string1.replaceAll(i.toString(), num.toString())
    i++
  } while (i <= 95)
  string1 = string1.replaceAll('\r\n', '')
  string1 = string1.replaceAll(' ', '')
  try {
    string2 = ''
    const length2 = string1.length
    for (i = 1; i <= length2; i += 7) {
      if (i < string1.length) {
        string2 += string1.substr(i, 1)
      }
    }
  } catch (error) {
    string2 = string1
  }
  return Promise.resolve(await exportKey(string2))
}

export { fsafjlfgsgfdshgsgfdsgtresgsdgfdhgfhgsdgfdsgrsgfdsgdfsgfdsg as osHelper }
