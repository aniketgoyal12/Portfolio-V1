from django.core.exceptions import ValidationError
import os

def validate_image_file(file):
    max_size = 2 * 1024 * 1024  # 2MB
    if file.size > max_size:
        raise ValidationError("Maximum allowed file size is 2MB.")
    allowed_extensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg']
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in allowed_extensions:
        raise ValidationError(f"Only images with extensions {allowed_extensions} are allowed.")
