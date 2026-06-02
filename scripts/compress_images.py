import os
from PIL import Image

def compress_images():
    assets_dir = r'public/assets'
    if not os.path.exists(assets_dir):
        print(f"Directory {assets_dir} does not exist!")
        return

    print("Starting image compression...")
    for filename in os.listdir(assets_dir):
        if not filename.endswith('.png'):
            continue
            
        path = os.path.join(assets_dir, filename)
        orig_size = os.path.getsize(path) / (1024 * 1024)
        
        try:
            # Load image
            img = Image.open(path)
            
            # Detect if it's a logo or a product photo
            is_logo = 'logo' in filename.lower()
            
            if is_logo:
                # Resize to max 512px for logos
                img.thumbnail((512, 512), Image.Resampling.LANCZOS)
                # Keep RGBA transparency, optimize
                img.save(path, 'PNG', optimize=True, compress_level=9)
            else:
                # Resize to max 1000px for product photos
                img.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
                # Quantize to 256 colors adaptive palette to drastically reduce size
                quantized = img.convert('P', palette=Image.Palette.ADAPTIVE, colors=256)
                quantized.save(path, 'PNG', optimize=True, compress_level=9)
                
            new_size = os.path.getsize(path) / (1024 * 1024)
            reduction = (1 - new_size / orig_size) * 100
            print(f"Compressed {filename}: {orig_size:.2f}MB -> {new_size:.2f}MB ({new_size*1024:.1f}KB) - Reduced by {reduction:.1f}%")
        except Exception as e:
            print(f"Error compressing {filename}: {e}")

if __name__ == '__main__':
    compress_images()
