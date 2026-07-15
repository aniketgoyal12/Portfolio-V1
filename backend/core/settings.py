import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Use PyMySQL as MySQLdb wrapper
import pymysql
pymysql.install_as_MySQLdb()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Helper for parsing CSV environment variables safely
def parse_csv_env(var_name, default=""):
    value = os.getenv(var_name, default)
    return [item.strip().rstrip('/') for item in value.split(",") if item.strip()]

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-6v!u(ou#3bv!%3nclgxn9h#z3_0j*m*z=!uc4z0f#_2irr4n*p')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1')

ALLOWED_HOSTS = parse_csv_env('ALLOWED_HOSTS', 'localhost,127.0.0.1')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'projects',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be at the top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database configuration: fallback to SQLite if MySQL env vars are not set
import urllib.parse
mysql_url = os.getenv('MYSQL_URL') or os.getenv('MYSQLURL')
if mysql_url:
    urllib.parse.uses_netloc.append("mysql")
    url = urllib.parse.urlparse(mysql_url)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': url.path[1:],
            'USER': url.username,
            'PASSWORD': url.password,
            'HOST': url.hostname,
            'PORT': str(url.port or 3306),
            'OPTIONS': {
                'charset': 'utf8mb4',
            }
        }
    }
elif os.getenv('MYSQLDATABASE') or os.getenv('DB_NAME'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('MYSQLDATABASE') or os.getenv('DB_NAME'),
            'USER': os.getenv('MYSQLUSER') or os.getenv('DB_USER'),
            'PASSWORD': os.getenv('MYSQLPASSWORD') or os.getenv('DB_PASSWORD'),
            'HOST': os.getenv('MYSQLHOST') or os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('MYSQLPORT') or os.getenv('DB_PORT', '3306'),
            'OPTIONS': {
                'charset': 'utf8mb4',
            }
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Media Files Settings
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# SimpleJWT & Cookie Auth Settings
SIMPLE_JWT_COOKIE_SECURE = os.getenv('SIMPLE_JWT_COOKIE_SECURE', str(not DEBUG)).lower() in ('true', '1')
SIMPLE_JWT_ACCESS_COOKIE = 'access_token'
SIMPLE_JWT_REFRESH_COOKIE = 'refresh_token'

# HTTPS / Secure Cookie Configuration
SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE', str(not DEBUG)).lower() in ('true', '1')
CSRF_COOKIE_SECURE = os.getenv('CSRF_COOKIE_SECURE', str(not DEBUG)).lower() in ('true', '1')
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False

SESSION_COOKIE_SAMESITE = 'None' if SESSION_COOKIE_SECURE else 'Lax'
CSRF_COOKIE_SAMESITE = 'None' if CSRF_COOKIE_SECURE else 'Lax'

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'projects.auth.JWTCookieAuthentication',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': os.getenv('THROTTLE_ANON_RATE', '100/minute'),
        'contact': os.getenv('THROTTLE_CONTACT_RATE', '10/minute'),
    }
}

# CORS & CSRF configurations
CORS_ALLOWED_ORIGINS = parse_csv_env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')
CSRF_TRUSTED_ORIGINS = parse_csv_env('CSRF_TRUSTED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')
CORS_ALLOW_CREDENTIALS = True

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() in ('true', '1')
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER) or 'noreply@example.com'
OWNER_EMAIL = os.getenv('OWNER_EMAIL', EMAIL_HOST_USER) or 'owner@example.com'

