from gtts import gTTS
import os

# Texts to convert and filenames
files = {
    "correct.mp3": "Correct",
    "incorrect.mp3": "Incorrect",
    "circle_name.mp3": "Circle",
    "square_name.mp3": "Square",
    "triangle_name.mp3": "Triangle"
}

# Destination folder
folder = r"C:\Users\Hp\Desktop\project\shape-sorter-adventure\assets\sounds"
os.makedirs(folder, exist_ok=True)

# Generate and save MP3s
for filename, text in files.items():
    tts = gTTS(text=text)
    save_path = os.path.join(folder, filename)
    tts.save(save_path)
    print(f"Generated: {save_path}")
