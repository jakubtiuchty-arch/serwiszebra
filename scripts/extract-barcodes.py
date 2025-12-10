#!/usr/bin/env python3
"""
Skrypt do wyciągania kodów kreskowych z Zebra PRG (Product Reference Guide)
"""

import fitz  # PyMuPDF
import os
import sys

def extract_barcodes_from_pdf(pdf_path, output_dir, pages_to_check=None):
    """
    Wyciąga obrazy z PDF i zapisuje je jako pliki PNG.
    
    Args:
        pdf_path: Ścieżka do pliku PDF
        output_dir: Katalog wyjściowy dla obrazów
        pages_to_check: Lista stron do sprawdzenia (None = wszystkie)
    """
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    doc = fitz.open(pdf_path)
    print(f"Otwarto PDF: {pdf_path}")
    print(f"Liczba stron: {len(doc)}")
    
    image_count = 0
    
    for page_num in range(len(doc)):
        if pages_to_check and page_num not in pages_to_check:
            continue
            
        page = doc[page_num]
        image_list = page.get_images()
        
        for img_index, img in enumerate(image_list):
            xref = img[0]
            
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Zapisz obraz
                image_filename = f"page{page_num+1}_img{img_index+1}.{image_ext}"
                image_path = os.path.join(output_dir, image_filename)
                
                with open(image_path, "wb") as f:
                    f.write(image_bytes)
                
                image_count += 1
                print(f"Zapisano: {image_filename} (strona {page_num+1})")
                
            except Exception as e:
                print(f"Błąd przy obrazie {img_index} na stronie {page_num+1}: {e}")
    
    print(f"\nWyciągnięto {image_count} obrazów do {output_dir}")
    return image_count

def find_barcode_pages(pdf_path, search_terms):
    """
    Znajduje strony zawierające określone frazy (np. "Set Defaults", "Suffix")
    """
    doc = fitz.open(pdf_path)
    found_pages = {}
    
    for term in search_terms:
        found_pages[term] = []
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            
            if term.lower() in text.lower():
                found_pages[term].append(page_num)
    
    return found_pages

if __name__ == "__main__":
    # Ścieżka do PRG DS2208
    prg_path = "/Users/jakubtiuchty/Desktop/Manuale /Skanery/ds2208-prg-en.pdf"
    output_dir = "/Users/jakubtiuchty/Desktop/serwiszebra/public/blog/barcodes-extracted"
    
    # Frazy do wyszukania
    search_terms = [
        "Set Defaults",
        "Carriage Return",
        "Add CR Suffix",
        "Add Tab Suffix", 
        "Poland",
        "Country Code",
        "USB HID",
        "USB COM",
        "QR Code",
        "Data Matrix",
        "Enable 2D"
    ]
    
    print("=" * 50)
    print("Szukam stron z kodami konfiguracyjnymi...")
    print("=" * 50)
    
    if os.path.exists(prg_path):
        found = find_barcode_pages(prg_path, search_terms)
        
        for term, pages in found.items():
            if pages:
                print(f"'{term}' znaleziono na stronach: {[p+1 for p in pages]}")
        
        # Zbierz wszystkie znalezione strony
        all_pages = set()
        for pages in found.values():
            all_pages.update(pages)
        
        print(f"\nWyciągam obrazy ze stron: {sorted([p+1 for p in all_pages])}")
        
        extract_barcodes_from_pdf(prg_path, output_dir, list(all_pages))
    else:
        print(f"Nie znaleziono pliku: {prg_path}")
        print("Dostępne pliki PDF w folderze Skanery:")
        scanner_dir = "/Users/jakubtiuchty/Desktop/Manuale /Skanery/"
        if os.path.exists(scanner_dir):
            for f in os.listdir(scanner_dir):
                if f.endswith('.pdf'):
                    print(f"  - {f}")

