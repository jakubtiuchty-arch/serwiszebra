const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const manuals = [
  '/Users/jakubtiuchty/Desktop/Manuale /Skanery/ds2208-prg-en.pdf',
  '/Users/jakubtiuchty/Desktop/Manuale /Skanery/ds4608-prg-en.pdf',
  '/Users/jakubtiuchty/Desktop/Manuale /Skanery/ds8108-prg-en.pdf',
  '/Users/jakubtiuchty/Desktop/Manuale /Skanery/ds36x8-prg-en.pdf',
  '/Users/jakubtiuchty/Desktop/Manuale /Skanery/li2208-prg-en.pdf',
  '/Users/jakubtiuchty/Desktop/Manuale /Skanery/li4278-prg-en.pdf',
  '/Users/jakubtiuchty/Desktop/Manuale /Skanery/ls2208-product-reference-guide-en-us.pdf',
  '/Users/jakubtiuchty/Desktop/Manuale /Skanery/ds2278-prg-en.pdf',
  '/Users/jakubtiuchty/Desktop/Manuale /Skanery/ds8178-prg-en.pdf',
  '/Users/jakubtiuchty/Desktop/Manuale /Skanery/ds9908-prg-en.pdf',
];

async function searchManual(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    const text = result.pages.map(p => p.text).join('\n');
    
    const fileName = filePath.split('/').pop();
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📖 ${fileName}`);
    console.log(`${'='.repeat(70)}`);
    
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLower = line.toLowerCase();
      
      // Search for specifications
      if ((lineLower.includes('technical specification') ||
          lineLower.includes('drop specification') ||
          lineLower.includes('tumble') ||
          lineLower.includes('ip rating') ||
          lineLower.includes('sealing') ||
          lineLower.includes('weight') ||
          lineLower.includes('dimension') ||
          lineLower.includes('warranty') ||
          lineLower.includes('operating temperature') ||
          lineLower.includes('decode capability') ||
          lineLower.includes('symbolog') ||
          lineLower.includes('scan rate') ||
          lineLower.includes('scan speed') ||
          lineLower.includes('motion tolerance') ||
          lineLower.includes('minimum element') ||
          lineLower.includes('field of view') ||
          lineLower.includes('illumination') ||
          lineLower.includes('operating range') ||
          lineLower.includes('battery') ||
          lineLower.includes('radio range') ||
          lineLower.includes('bluetooth')) &&
          line.trim().length > 10) {
        
        const start = Math.max(0, i - 1);
        const end = Math.min(lines.length, i + 3);
        
        for (let j = start; j < end; j++) {
          if (lines[j].trim().length > 5) {
            console.log(lines[j].trim());
          }
        }
        console.log('---');
      }
    }
    
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
}

async function main() {
  for (const manual of manuals) {
    await searchManual(manual);
  }
}

main();









