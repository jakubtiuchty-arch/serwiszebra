#!/usr/bin/env python3
"""
Szukam stron z konkretnymi kodami konfiguracyjnymi
"""

import fitz
import os

def search_and_render(pdf_path, output_dir, search_term, context_pages=1, dpi=200):
    """Szuka frazy i renderuje strony z kontekstem"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    doc = fitz.open(pdf_path)
    zoom = dpi / 72
    mat = fitz.Matrix(zoom, zoom)
    
    found_pages = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        
        if search_term.lower() in text.lower():
            found_pages.append(page_num)
    
    print(f"'{search_term}' znaleziono na stronach: {[p+1 for p in found_pages]}")
    
    # Renderuj pierwsze 3 znalezione strony
    for page_num in found_pages[:3]:
        page = doc[page_num]
        pix = page.get_pixmap(matrix=mat)
        
        safe_term = search_term.replace(" ", "_").replace("/", "_")[:20]
        output_path = os.path.join(output_dir, f"{safe_term}_page_{page_num+1}.png")
        pix.save(output_path)
        print(f"  Zapisano: {os.path.basename(output_path)}")
    
    doc.close()
    return found_pages

if __name__ == "__main__":
    prg_path = "/Users/jakubtiuchty/Desktop/Manuale /Skanery/ds2208-prg-en.pdf"
    output_dir = "/Users/jakubtiuchty/Desktop/serwiszebra/public/blog/prg-pages"
    
    # Szukamy konkretnych fraz
    searches = [
        "Set All Defaults",
        "Restore Defaults", 
        "Set Factory Defaults",
        "<DATA><SUFFIX 1>",
        "Suffix 1",
        "Suffix 2",
        "Add Enter",
        "Add Tab",
        "Carriage Return",
        "Horizontal Tab",
        "Poland",
        "Enable QR Code",
        "Enable Data Matrix",
        "USB Keyboard",
        "USB Serial",
    ]
    
    for term in searches:
        search_and_render(prg_path, output_dir, term)
        print()

