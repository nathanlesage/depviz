# Serves a file from the public directory
import os
from .template import view

CONTENT_TYPES = {
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.ico': 'image/x-icon'
}

def load_resource(path):
  # Prevent intrusion, we only allow files from the public directory
  filename = os.path.basename(path)
  abs_path = f"public/{filename}"
  print("LOADING RESOURCE", path)

  if not os.path.isfile(abs_path):
    return view("404", { 'title': "File not Found", 'body': f"The requested file {filename} was not found." }, return_code=404)

  # Determine the content type
  _, ext = os.path.splitext(filename)
  content_type = "text/plain"
  if ext in CONTENT_TYPES:
    content_type = CONTENT_TYPES[ext]

  # Read either as string or as binary
  mode = "r"
  if content_type.startswith("image/"):
    mode = "rb"

  # Load and return the data
  with open(abs_path, mode) as fp:
    return (200, content_type, fp.read())
