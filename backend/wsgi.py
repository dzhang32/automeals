"""
WSGI entry point used by PythonAnywhere to serve the FastAPI application.
"""

import os
import sys

from a2wsgi import ASGIMiddleware

from app.main import app

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Wrap the FastAPI (ASGI) app to make it WSGI-compatible
application = ASGIMiddleware(app)
