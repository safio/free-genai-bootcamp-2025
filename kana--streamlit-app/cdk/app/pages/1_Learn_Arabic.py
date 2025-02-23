import streamlit as st
import os
from PIL import Image

st.set_page_config(
    page_title="Kana Learning App",
    page_icon="📝",
    layout="centered",
)

st.title("📝 Welcome to the Arabic Learning App!")
st.subheader("Use this page to learn Arabic!")
st.divider()

# Remove the study mode selection since we only have Arabic
st.session_state.study_mode = "Arabic"

# Display the Arabic Chart
image_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "img", "arbicCaracters.png")
try:
    # Open and verify the image using PIL first
    image = Image.open(image_path)
    st.image(image,
             caption="Arabic Chart. "
                     "Source: https://www.lebanesearabicinstitute.com/arabic-alphabet/")
except FileNotFoundError:
    st.error(
        f"Could not load the Arabic chart image. "
        f"Please check the file path: {image_path}")
except Exception as e:
    st.error(f"Error loading image: {str(e)}. Please ensure the image file is in the correct format.")

# Footer
st.divider()
st.markdown(
    """
    🎯 **Practice Makes Perfect!**  
    👉 Visit the **Romaji to Arabic** and **Arabic to romaji** pages to test your knowledge.  
    🌟 Keep practicing and track your progress regularly!
    """,
)
