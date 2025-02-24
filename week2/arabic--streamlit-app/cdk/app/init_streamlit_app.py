import streamlit as st
import importlib.util
import os

# Must be the first Streamlit command
st.set_page_config(
    page_title="Arabic Learning App",
    page_icon="📝",
    layout="centered",
)

# Initialize session state
if 'mode' not in st.session_state:
    st.session_state.mode = "Arabic"

st.title("Welcome to Arabic Learning App")
st.write("Please select a page from the sidebar to begin learning Arabic!")

st.sidebar.title("Navigation")
pages = {
    "Learn Arabic": "Learn the Arabic alphabet and their sounds",
    "Latin to Arabic": "Practice writing Arabic characters",
    "Arabic to Latin": "Practice reading Arabic characters",
}

for page, description in pages.items():
    st.sidebar.write(f"**{page}**: {description}")

# Get the current directory path
current_dir = os.path.dirname(os.path.abspath(__file__))

def load_page(page_name):
    """Load and execute a Python file as a module"""
    # Map page names to their corresponding file names
    page_file_map = {
        "Learn the Arabic alphabet and their sounds": "Learn_Arabic",
        "Practice writing Arabic characters": "Latin_to_Arabic",
        "Practice reading Arabic characters": "Arabic_to_Latin"
    }
    
    # Get the mapped file name or use the original page name
    file_name = page_file_map.get(page_name, page_name.replace(" ", "_"))
    page_path = os.path.join(current_dir, 'pages', f'{file_name}.py')
    if not os.path.exists(page_path):
        raise FileNotFoundError(f"Page not found: {page_path}")
    spec = importlib.util.spec_from_file_location(page_name, page_path)
    if spec is None:
        raise ImportError(f"Could not load module spec for {page_path}")
    module = importlib.util.module_from_spec(spec)
    if spec.loader is None:
        raise ImportError(f"No module loader available for {page_path}")
    spec.loader.exec_module(module)

selection = st.sidebar.radio("Go to", list(pages.keys()))

try:
    load_page(pages[selection])
except Exception as e:
    st.error(f"Error loading page {pages[selection]}: {str(e)}")
