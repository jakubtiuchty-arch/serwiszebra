import { NextRequest, NextResponse } from 'next/server'

// Mapowanie slug -> URL do pliku w Supabase
const downloads: Record<string, { url: string; filename: string }> = {
  // Sterowniki
  'zdesigner-v10': {
    url: 'https://fivrcnshzylqdquuhkeu.supabase.co/storage/v1/object/public/downloads/zddriver-v1062628275-certified.zip',
    filename: 'ZDesigner-Driver-v10.zip'
  },
  'zdesigner-v5': {
    url: 'https://fivrcnshzylqdquuhkeu.supabase.co/storage/v1/object/public/downloads/zd51177415-certified.exe',
    filename: 'ZDesigner-Driver-v5.exe'
  },
  
  // Firmware
  'linkos-74': {
    url: 'https://fivrcnshzylqdquuhkeu.supabase.co/storage/v1/object/public/downloads/V93.21.39Z.zip',
    filename: 'LinkOS-V93.21.39Z.zip'
  },
  
  // Programy użytkowe - Drukarki
  'zebra-setup-utilities': {
    url: 'https://fivrcnshzylqdquuhkeu.supabase.co/storage/v1/object/public/downloads/zsu-1191327.zip',
    filename: 'Zebra-Setup-Utilities.zip'
  },
  'zebradesigner-3': {
    url: 'https://fivrcnshzylqdquuhkeu.supabase.co/storage/v1/object/public/downloads/zebradesigner3-33089.zip',
    filename: 'ZebraDesigner-3.zip'
  },
  'zdownloader': {
    url: 'https://fivrcnshzylqdquuhkeu.supabase.co/storage/v1/object/public/downloads/FirmwareDownloader-v5-0-0-10%20(1).exe',
    filename: 'ZDownloader.exe'
  },
  
  // Programy użytkowe - Skanery
  '123scan-32bit': {
    url: 'https://fivrcnshzylqdquuhkeu.supabase.co/storage/v1/object/public/downloads/Zebra_123Scan_(32bit)_v6.00.0036.zip',
    filename: '123Scan-32bit.zip'
  },
  '123scan-64bit': {
    url: 'https://fivrcnshzylqdquuhkeu.supabase.co/storage/v1/object/public/downloads/Zebra_123Scan_(64bit)_v6.00.0036.zip',
    filename: '123Scan-64bit.zip'
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug
  
  const download = downloads[slug]
  
  if (!download) {
    return NextResponse.json(
      { error: 'Plik nie znaleziony' },
      { status: 404 }
    )
  }
  
  // Przekierowanie na właściwy plik
  return NextResponse.redirect(download.url, {
    status: 302,
    headers: {
      'Cache-Control': 'public, max-age=3600',
    }
  })
}

