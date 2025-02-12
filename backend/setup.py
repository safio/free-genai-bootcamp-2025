from setuptools import setup, find_packages

setup(
    name="lang-portal",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.109.2",
        "uvicorn==0.27.1",
        "sqlalchemy==2.0.27",
        "aiosqlite==0.19.0",
        "pydantic==2.6.1",
        "python-multipart==0.0.9",
        "python-jose[cryptography]==3.3.0",
        "passlib[bcrypt]==1.7.4",
        "pytest==8.0.0",
        "httpx==0.26.0"
    ],
) 