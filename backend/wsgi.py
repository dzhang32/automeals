"""
WSGI entry point used by PythonAnywhere to serve the FastAPI application.
"""

import os
import sys

# Add the backend directory to the Python path.
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

try:
    from app.main import app
    from asgiref.wsgi import WsgiToAsgi

    # Wrap the ASGI app with WSGI adapter
    application = WsgiToAsgi(app)
except ImportError:
    # Fallback: if asgiref is not installed, this will show an error
    def application(_, start_response):
        start_response("500 Internal Server Error", [("Content-Type", "text/plain")])
        return [b"Error: asgiref is required but not installed."]
