#!/usr/bin/env python3
"""
Kadruję konkretne kody kreskowe ze stron PRG.
Współrzędne ustalone na podstawie analizy stron.
"""

from PIL import Image
import os

def crop_barcode(input_path, output_path, crop_box, description=""):
    """
    Kadruje obraz według podanych współrzędnych.
    crop_box: (left, top, right, bottom)
    """
    img = Image.open(input_path)
    cropped = img.crop(crop_box)
    
    # Dodaj białe marginesy
    margin = 20
    new_width = cropped.width + 2 * margin
    new_height = cropped.height + 2 * margin
    new_img = Image.new('RGB', (new_width, new_height), 'white')
    new_img.paste(cropped, (margin, margin))
    
    new_img.save(output_path, 'PNG')
    print(f"✓ Zapisano: {os.path.basename(output_path)} - {description}")

if __name__ == "__main__":
    prg_dir = "/Users/jakubtiuchty/Desktop/serwiszebra/public/blog/prg-pages"
    output_dir = "/Users/jakubtiuchty/Desktop/serwiszebra/public/blog"
    
    # Współrzędne dla obrazów 1700x2200 px (200 DPI)
    # Kadrowanie: (left, top, right, bottom)
    
    barcodes = [
        # Strony 1700x2200 px
        # Współrzędne ustalone na podstawie debug sekcji
        
        # Set Factory Defaults - strona 49 (y1200-1500, prawa strona)
        {
            "input": f"{prg_dir}/Set_Factory_Defaults_page_49.png",
            "output": f"{output_dir}/barcode-set-defaults.png",
            "crop": (1050, 1220, 1380, 1360),  
            "desc": "Set Factory Defaults"
        },
        # Restore Defaults - strona 49 (y900-1200, lewa strona)
        {
            "input": f"{prg_dir}/Set_Factory_Defaults_page_49.png",
            "output": f"{output_dir}/barcode-restore-defaults.png",
            "crop": (260, 1000, 590, 1140),  
            "desc": "Restore Defaults"
        },
        # Add Enter Key - strona 73 (y600-730)
        {
            "input": f"{prg_dir}/Add_Enter_page_73.png",
            "output": f"{output_dir}/barcode-suffix-enter.png",
            "crop": (470, 600, 1090, 750),  
            "desc": "Add Enter Key (Carriage Return)"
        },
        # Tab Key - strona 73 (y1000-1130)
        {
            "input": f"{prg_dir}/Add_Enter_page_73.png",
            "output": f"{output_dir}/barcode-suffix-tab.png",
            "crop": (470, 1000, 1090, 1150),  
            "desc": "Tab Key"
        },
        # Enable QR Code - strona 259 (y1500-1600)
        {
            "input": f"{prg_dir}/Enable_QR_Code_page_259.png",
            "output": f"{output_dir}/barcode-enable-qr.png",
            "crop": (275, 1500, 575, 1640),  
            "desc": "Enable QR Code"
        },
        # Enable Data Matrix - strona 256 (y600-700)
        {
            "input": f"{prg_dir}/Enable_Data_Matrix_page_256.png",
            "output": f"{output_dir}/barcode-enable-datamatrix.png",
            "crop": (275, 600, 575, 740),  
            "desc": "Enable Data Matrix"
        },
    ]
    
    print("Kadruję kody kreskowe z PRG DS2208...")
    print("-" * 50)
    
    for bc in barcodes:
        if os.path.exists(bc["input"]):
            try:
                crop_barcode(bc["input"], bc["output"], bc["crop"], bc["desc"])
            except Exception as e:
                print(f"✗ Błąd przy {bc['desc']}: {e}")
        else:
            print(f"✗ Brak pliku: {bc['input']}")
    
    print("-" * 50)
    print("Gotowe! Sprawdź obrazy w:", output_dir)

