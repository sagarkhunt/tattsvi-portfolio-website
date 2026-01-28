from PIL import Image
import os

def remove_background(image_path, output_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    newData = []
    for item in datas:
        # Check if the pixel is near-white or very light
        # The user's image has a clean white background
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0)) # Pure transparent
        else:
            newData.append(item)
    
    img.putdata(newData)
    
    # Optional: Trim empty space
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Processed image saved to {output_path}")

target_path = "/Users/sagarkhunt/WorkSpace/Tattsvi/tattsvi-html/assets/images/diamonds/diamond_heart.png"
remove_background(target_path, target_path)
