import os
import sys
from pathlib import Path

# Add the parent directory of your Flask app (the 'src' folder) to the Python path.
# This is crucial so that the Netlify Function can find and import your Flask application modules.
# Assuming your structure is chatat_backend/src/main.py and chatat_backend/netlify_functions/main.py
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

# Import your Flask app instance from your main Flask application file.
# Make sure 'app' is the name of your Flask application instance in src/main.py
from main import app as flask_app

# Import the WSGI handler from serverless_wsgi
from serverless_wsgi import handle_request

def handler(event, context):
    """The main entry point for the Netlify Function.
    It receives the event and context from Netlify and passes them to the WSGI handler.
    """
    return handle_request(flask_app, event, context)