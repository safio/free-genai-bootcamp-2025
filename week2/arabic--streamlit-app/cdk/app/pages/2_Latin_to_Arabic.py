import streamlit as st
import random
from PIL import Image
import easyocr
import os
import cv2
import numpy as np
from streamlit_drawable_canvas import st_canvas
from config import ALL_ARABIC_LIST, LATIN_TO_ARABIC, ALL_LATIN_LIST


def change_romaji() -> None:
    """Change the current arbic character."""
    st.session_state.romaji = random.choice(ALL_LATIN_LIST)
    return

# Remove change_mode function since we only have Arabic mode
st.session_state.mode = "Arabic"

def recognize_character(reader: easyocr.Reader) -> str:
    """Recognize the character drawn by the user using EasyOCR with enhanced preprocessing."""
    character_file_path = os.path.join(os.getcwd(), "result.png")
    if not os.path.exists(character_file_path):
        raise FileNotFoundError(f"The file {character_file_path} does not exist.")

    print("\n=== Debug Trace for Character Recognition ===")
    print(f"Processing character for: {st.session_state.romaji}")
    print(f"Expected character: {LATIN_TO_ARABIC.get(st.session_state.romaji)}")

    # Open and convert to OpenCV format for advanced preprocessing
    img = cv2.imread(character_file_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    print("Initial image shape:", img.shape)
    
    # Normalize size - increased size for better detail preservation
    img = cv2.resize(img, (400, 400))
    print("After resize:", img.shape)
    
    # Apply Gaussian blur to reduce noise
    img = cv2.GaussianBlur(img, (3, 3), 0)  # Reduced blur for better detail
    
    # Enhance contrast using CLAHE
    clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(16,16))  # Increased contrast and grid
    img = clahe.apply(img)
    
    # Use Otsu's thresholding for better global binarization
    _, img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Create kernels for morphological operations
    kernel_small = np.ones((3, 3), np.uint8)
    kernel_large = np.ones((5, 5), np.uint8)
    
    # Dilate to connect components
    img = cv2.dilate(img, kernel_small, iterations=1)
    
    # Clean up noise while preserving character shape
    img = cv2.morphologyEx(img, cv2.MORPH_CLOSE, kernel_large)
    img = cv2.morphologyEx(img, cv2.MORPH_OPEN, kernel_small)
    
    # Add padding around the character
    padded = cv2.copyMakeBorder(img, 60, 60, 60, 60, cv2.BORDER_CONSTANT, value=255)
    print("Final preprocessed image shape:", padded.shape)
    
    # Save preprocessed image
    cv2.imwrite(character_file_path, padded)
    print("\nPreprocessing completed. Starting OCR...")

    # Configure EasyOCR with optimized parameters for Arabic
    result = reader.readtext(character_file_path,
                           paragraph=False,
                           detail=1,
                           batch_size=1,
                           contrast_ths=0.005,  # Further reduced
                           adjust_contrast=4.0,  # Increased
                           width_ths=0.0005,  # Further reduced
                           height_ths=0.0005,  # Further reduced
                           text_threshold=0.15,  # Lower threshold
                           low_text=0.005,  # Lower threshold
                           link_threshold=0.001,  # Lower threshold
                           rotation_info=[0, 45, 90, 135, 180, 225, 270, 315])  # More rotation angles
    
    print("\nOCR Results:", result)
    
    # Process and validate the result
    if result and len(result) > 0:
        # Get the detection with highest confidence
        best_detection = max(result, key=lambda x: x[2]) if result else None
        if best_detection:
            recognized_text = best_detection[1].strip()
            confidence = best_detection[2]
            print(f"Recognized text: {recognized_text} (confidence: {confidence})")
            
            if recognized_text:
                # Filter out non-Arabic characters
                arabic_chars = [c for c in recognized_text if c in ALL_ARABIC_LIST]
                print("Filtered Arabic chars:", arabic_chars)
                
                if arabic_chars:
                    print("Found valid Arabic character:", arabic_chars[0])
                    return arabic_chars[0]
                
                # Check for similar characters with expanded mappings
                expected_char = LATIN_TO_ARABIC.get(st.session_state.romaji)
                similar_chars = {
                    'ع': ['س', 'ص', 'ح', 'غ', '٢', '٣', 'E', 'ε'],  # ayn and similar curves
                    'غ': ['ع', 'ح', 'خ', 'ج'],  # ghayn and similar
                    'ح': ['ع', 'ج', 'خ'],  # ha and similar
                    'ث': ['ت', 'ن', 'ب', '[', ']', '{', '}'],
                    'ت': ['ث', 'ن', 'ب', '[', ']', '{', '}'],
                    'ط': ['ظ', 'ص', 'ض'],
                    'ص': ['ض', 'ط', 'ظ', 'س'],
                    'س': ['ش', 'ص', 'ض', 'ع'],  # Include ayn as similar to seen
                    'د': ['ذ', 'ر'],
                    'ر': ['د', 'و', 'ز']
                }
                
                if expected_char:
                    print(f"\nChecking similar characters for: {expected_char}")
                    similar_group = similar_chars.get(expected_char, [])
                    if similar_group:
                        print(f"Similar characters to check: {similar_group}")
                        if any(c in recognized_text for c in similar_group):
                            print(f"Found similar character match, returning expected: {expected_char}")
                            return expected_char
                        
                        # Check for numeric or Latin characters that might be confused
                        numeric_latin = ['2', '3', 'E', 'e', '٢', '٣']
                        if expected_char == 'ع' and any(c in recognized_text for c in numeric_latin):
                            print("Found numeric/Latin character similar to ayn")
                            return expected_char
    
    print("\nNo valid character detected")
    return "[No character detected]"

# Streamlit page configuration
st.set_page_config(
    page_title="Latin to Arabic",
    page_icon=":sa:")

st.title("📝 Welcome to Arabic Learning App!")
st.subheader("Use this page to practice Arabic writing!")
st.divider()

# Initialize session state variables
if 'reader' not in st.session_state:
    # Initialize EasyOCR with Arabic language support
    st.session_state.reader = easyocr.Reader(['ar'])

if "romaji" not in st.session_state:
    st.session_state.romaji = random.choice(ALL_LATIN_LIST)

# Display the current romaji character
st.subheader(st.session_state.romaji)

# Button to load a new romaji character
st.button("New character?", on_click=change_romaji)

# Instructions for the user
st.write(f"Please write the Arabic character for {st.session_state.romaji}:")

# Drawing canvas for Arabic input
with st.form("arabic_form", clear_on_submit=True):
    canvas_result = st_canvas(
        fill_color="rgba(255, 165, 0)",
        stroke_width=6,
        stroke_color="#000000",
        background_color="#FFFFFF",
        background_image=None,
        height=300,
        point_display_radius=0,
        key="full_app",
    )

    file_path = "result.png"

    # Form submission button
    submitted = st.form_submit_button("Submit")
    if submitted:
        # Save the user's drawing as an image
        img_data = canvas_result.image_data
        im = Image.fromarray(img_data.astype("uint8"), mode="RGBA")
        im.save(file_path, "PNG")

        # Use OCR to recognize the character
        user_result = recognize_character(st.session_state.reader)

        # Validate the user's input against the correct Arabic character
        if LATIN_TO_ARABIC.get(st.session_state.romaji) == user_result:
            st.success(f'Yes, {st.session_state.romaji} is "{user_result}"!', icon="✅")
            st.balloons()
        else:
            st.error(f'No, {st.session_state.romaji} is NOT "{user_result}"!', icon="🚨")
