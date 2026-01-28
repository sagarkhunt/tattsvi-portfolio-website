from PIL import Image, ImageChops
import os

def trim(im):
    # Use alpha channel for trimming
    bbox = im.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        # Adding a tiny bit of padding
        return im.crop((max(0, left-2), max(0, top-2), min(im.size[0], right+2), min(im.size[1], bottom+2)))
    return im

def crop_diamond(img, box, name):
    diamond = img.crop(box)
    diamond = diamond.convert("RGBA")
    
    datas = diamond.getdata()
    newData = []
    for item in datas:
        # Aggressive removal of white and cream backgrounds
        # Source cream is approx (250, 248, 240)
        # Any pixel where all R,G,B are > 230 is likely background
        if item[0] > 230 and item[1] > 230 and item[2] > 220:
            newData.append((255, 255, 255, 0)) # Pure transparent
        else:
            newData.append(item)
    diamond.putdata(newData)
    
    # Trim to content
    diamond = trim(diamond)
    
    output_path = f"/Users/sagarkhunt/WorkSpace/Tattsvi/tattsvi-html/assets/images/diamonds/diamond_{name}.png"
    diamond.save(output_path, "PNG")
    print(f"Saved {name} at {output_path} with size {diamond.size}")

source_path = "/Users/sagarkhunt/WorkSpace/Tattsvi/tattsvi-html/assets/images/diamonds/debug_source_full.png"
if not os.path.exists(source_path):
    # Fallback to the uploaded source if debug_source doesn't exist for some reason
    source_path = "/Users/sagarkhunt/.gemini/antigravity/brain/6af50d82-75f2-4cf8-a622-80f961e0ac47/uploaded_media_0_1769497207669.png"

img = Image.open(source_path)

# (left, top, right, bottom)
crops = {
    "round": (30, 50, 210, 320),
    "oval": (230, 50, 400, 320),
    "princess": (420, 50, 580, 320),
    "emerald": (600, 50, 750, 320),
    "heart": (780, 50, 960, 320),
    "cushion": (230, 330, 410, 650),
    "pear": (430, 330, 570, 650),
    "marquise": (600, 330, 750, 650),
    "asscher": (780, 330, 970, 650)
}

for name, box in crops.items():
    crop_diamond(img, box, name)
