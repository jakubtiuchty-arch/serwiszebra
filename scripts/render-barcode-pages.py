#!/usr/bin/env python3
"""
Renderuje konkretne strony PRG jako obrazy PNG w wysokiej rozdzielczości.
Strony zawierające kody konfiguracyjne Set Defaults, Suffix, Country Codes itp.
"""

import fitz  # PyMuPDF
import os

def render_pages(pdf_path, output_dir, pages, dpi=300):
    """
    Renderuje wybrane strony PDF jako obrazy PNG.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    doc = fitz.open(pdf_path)
    zoom = dpi / 72  # 72 to domyślne DPI PDF
    mat = fitz.Matrix(zoom, zoom)
    
    for page_num in pages:
        if page_num < 0 or page_num >= len(doc):
            print(f"Strona {page_num+1} poza zakresem")
            continue
            
        page = doc[page_num]
        pix = page.get_pixmap(matrix=mat)
        
        output_path = os.path.join(output_dir, f"prg_page_{page_num+1}.png")
        pix.save(output_path)
        print(f"Zapisano: prg_page_{page_num+1}.png ({pix.width}x{pix.height})")
    
    doc.close()

if __name__ == "__main__":
    prg_path = "/Users/jakubtiuchty/Desktop/Manuale /Skanery/ds2208-prg-en.pdf"
    output_dir = "/Users/jakubtiuchty/Desktop/serwiszebra/public/blog/prg-pages"
    
    # Kluczowe strony z kodami konfiguracyjnymi (numery stron z PRG DS2208)
    # Strona 50 - Set Defaults
    # Strona 73 - Carriage Return suffix
    # Strona 78-96 - USB Interface settings
    # Strona 135-139 - Default settings
    # Strona 294-322 - Country Codes
    # Strona 256-262 - QR Code, Data Matrix settings
    
    important_pages = [
        49,   # Set Defaults (page 50)
        72,   # Carriage Return (page 73)
        77,   # USB HID (page 78)
        92,   # USB settings (page 93)
        95,   # USB COM (page 96)
        134,  # Default parameters (page 135)
        138,  # More defaults (page 139)
        255,  # Data Matrix enable (page 256)
        258,  # QR Code (page 259)
        260,  # QR settings (page 261)
        293,  # Country codes start (page 294)
        306,  # Poland should be around here (page 307)
        307,  # or here (page 308)
        308,  # (page 309)
    ]
    
    print(f"Renderuję strony z PRG: {prg_path}")
    print(f"Strony: {[p+1 for p in important_pages]}")
    print("-" * 50)
    
    render_pages(prg_path, output_dir, important_pages, dpi=200)
    
    print(f"\nObrazy zapisano w: {output_dir}")
    print("Przejrzyj je i znajdź właściwe kody kreskowe do wykadrowania.")

