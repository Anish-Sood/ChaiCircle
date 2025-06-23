import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()


cloudinary.config(
    cloud_name="duntpleg0",
    api_key="339463373437339",  
    api_secret="CuCCdqERv9zqT_L_ZrYMUnynulUA" 
)

def upload_image(file, folder="social-media"):
    """Upload image to Cloudinary"""
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="image",
            transformation=[
                {'width': 800, 'height': 600, 'crop': 'limit'},
                {'quality': 'auto', 'fetch_format': 'auto'}
            ]
        )
        return result['secure_url']
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None

def upload_avatar(file):
    """upload avatar to Cloudinary with specific transformations"""
    try:
        result = cloudinary.uploader.upload(
            file,
            folder="social-media-avatars",
            resource_type="image",
            transformation=[
                {'width': 200, 'height': 200, 'crop': 'fill', 'gravity': 'face', 'radius': 'max'},
                {'quality': 'auto', 'fetch_format': 'auto'}
            ]
        )
        return result['secure_url']
    except Exception as e:
        print(f"cloudinary avatar upload error: {e}")
        return None