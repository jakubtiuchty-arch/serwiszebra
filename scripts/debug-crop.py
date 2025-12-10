#!/usr/bin/env python3
"""Debug - wytnij różne sekcje strony żeby znaleźć barcode"""

from PIL import Image
import os

def save_section(img_path, output_dir, name, y_start, y_end):
    """Wycina całą szerokość strony od y_start do y_end"""
    img = Image.open(img_path)
    cropped = img.crop((0, y_start, img.width, y_end))
    out_path = os.path.join(output_dir, f"debug_{name}_y{y_start}-{y_end}.png")
    cropped.save(out_path)
    print(f"Zapisano: {os.path.basename(out_path)}")

if __name__ == "__main__":
    prg_dir = "/Users/jakubtiuchty/Desktop/serwiszebra/public/blog/prg-pages"
    output_dir = "/Users/jakubtiuchty/Desktop/serwiszebra/public/blog/debug"
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Page 49 - Set Factory Defaults
    page49 = f"{prg_dir}/Set_Factory_Defaults_page_49.png"
    
    # Podziel stronę na sekcje co 300px
    for y in range(0, 2200, 300):
        save_section(page49, output_dir, "page49", y, min(y+300, 2200))
    
    print("\nSprawdź obrazy w:", output_dir)

