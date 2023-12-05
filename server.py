from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

from modules.render_home import render_home
from modules.load_resource import load_resource
from modules.template import view
from modules.util import RedirectTo

import traceback
import os

# This is a list of raw files that the server will serve from the public directory
RAW_FILES = [
  ".css",
  ".js",
  ".ico"
]

def handle_request(request_path: str, query_params: dict[str, list[str]], full_path: str):
  # Check if we can serve a raw file
  for ext in RAW_FILES:
    if request_path.endswith(ext):
      return load_resource(request_path)
  
  # There is only a single route supported. It can have an optional sentence passed as a GET query param
  sentence = query_params['sentence'][0] if 'sentence' in query_params and len(query_params['sentence']) > 0 else ''

  return_code, content_type, content = render_home(sentence)
  return (return_code, content_type, content)
  
  # return view("404", { 'body': f"Could not find path {request_path}!" }, return_code=404)

class RequestHandler(BaseHTTPRequestHandler):
  """This class parses requests to the DepViz"""
  def do_GET(self):
    # Handle a GET request. First, retrieve the relevant information for the
    # actual handlers, such as query parameters and the path. This is necessary
    # because self.path returns everything after the server path
    this_host, this_port = self.server.server_address
    if this_host == "127.0.0.1":
      this_host = "localhost" # Better output

    # We use urlparse to first dissect the full URL that has been requested
    parsed = urlparse(f"http://{this_host}:{this_port}{self.path}")
    request_path = parsed.path
    # Then, we use parse_qs to transform an eventual query string into a dictionary
    # If the query is empty, the dictionary will also be empty (not None!)
    request_query = parse_qs(parsed.query) # Returns a dictionary of query parameters
    
    # At this point, we have all info and can actually begin to handle the request
    try:
      code, content_type, response = handle_request(request_path, request_query, self.path)
    except RedirectTo as e:
      newurl = f"http://{this_host}:{this_port}{e}"
      self.send_response(301)
      self.send_header('Location', newurl)
      self.end_headers()
      self.wfile.write(bytes(f"Redirecting to {newurl} ...", "utf-8", "surrogateescape"))
      return # Do not output anything anymore
    except BrokenPipeError as e:
      return # The client aborted the loading of a page, so we cannot answer this request.
    except Exception as e:
      traceback.print_exc() # For better output
      code, content_type, response = view("500", { 'body': f"The server could not handle the request: {e}"}, return_code=500)

    self.send_response(code)
    self.send_header("Content-type", content_type)
    self.end_headers()

    # Either write as-is, or convert beforehand
    if type(response) is bytes:
      self.wfile.write(response)
    else:
      self.wfile.write(bytes(response, "utf-8", "surrogateescape"))

def start_server():
  """Starts the CRECxplorer and begins listening"""
  print("Starting CRECxplorer ...")
  SERVER_HOST = "localhost"
  SERVER_PORT = 8080
  SERVER_PATH = f"http://{SERVER_HOST}:{SERVER_PORT}"
  os.environ['SERVER_PATH'] = SERVER_PATH

  server = HTTPServer((SERVER_HOST, SERVER_PORT), RequestHandler)
  print(f"Server started at {SERVER_PATH} -- press Ctrl+C to stop")
  try:
    server.serve_forever()
  except KeyboardInterrupt:
    print("\nShutting down server ...")
    server.server_close()
    print("Server shut down. Goodbye!")

if __name__ == "__main__":
  start_server()
