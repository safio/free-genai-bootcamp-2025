import streamlit as st
import random
from config import SELECT_KANA_DICT, CHECK_KANA_DICT


def change_character():
    """Change the current character to a random one."""
    st.session_state.character = random.choice(SELECT_KANA_DICT.get(st.session_state.mode))
    return


# Remove change_mode function since we only have Arabic mode
st.session_state.mode = "Arabic"

# Page configuration
st.set_page_config(
    page_title="Arabic to Latin",
    page_icon=":sa:")

# Page title and description
st.title("📝 Welcome to Arabic Learning App!")
st.subheader("Use this page to practice Arabic reading!")
st.divider()

# Initialize session state variables
if "character" not in st.session_state:
    st.session_state.character = random.choice(SELECT_KANA_DICT.get(st.session_state.mode))

# Display the current character
st.subheader(st.session_state.character)

# Button to generate a new character
st.button("New character?", on_click=change_character)

# Input and validation
st.write(f"Please write the Latin (romanized) reading for this Arabic character: {st.session_state.character}")

with st.form("arabic_form"):
    # User input
    user_romaji = st.text_input("Write your answer here", "")
    user_romaji_lower_case = user_romaji.lower()

    # Submit button
    submitted = st.form_submit_button("Submit")

    if submitted:
        # Check if the user input matches the expected Latin for the character
        if CHECK_KANA_DICT.get(st.session_state.mode).get(user_romaji_lower_case) == st.session_state.character:
            st.success(f'Yes! {st.session_state.character} is "{user_romaji_lower_case}"!', icon="✅")
            st.balloons()
        else:
            st.error(f'No, {st.session_state.character} is NOT "{user_romaji_lower_case}"!', icon="🚨")
