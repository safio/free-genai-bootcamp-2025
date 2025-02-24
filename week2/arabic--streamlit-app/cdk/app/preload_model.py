import logging
import os
from huggingface_hub import snapshot_download
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)


def download_model():
    """
    Downloads the Arabic OCR model from the Hugging Face Hub if it doesn't already exist locally.
    """
    # Use a writable directory - either tmp or user's home directory
    model_dir = Path("../../models/arabic-ocr")
    model_dir.mkdir(parents=True, exist_ok=True)
    
    # Check if directory is empty
    if not any(model_dir.iterdir()):
        logging.info("Downloading Arabic OCR model...")
        snapshot_download(repo_id="gagan3012/Florence-2-FT-ArabicOCR", local_dir=model_dir)
        logging.info("Model downloaded successfully")
    else:
        logging.info("Model already exists. Skipping download.")


if __name__ == "__main__":
    download_model()