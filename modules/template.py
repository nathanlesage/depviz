# Loads templates and fills them with data
import os

APP_NAME = 'DepViz'

def view(tpl_name, data, return_code = 200):
  # Make sure we always have a title
  if not 'title' in data:
    data['title'] = APP_NAME
  
  # And that it always starts with the server name
  if not data['title'].startswith('CRECxplorer'):
    data['title'] = f'{APP_NAME} | ' + data['title']

  # All paths relative to the module's root
  tpl_path = f"modules/templates/{tpl_name}.htm"

  if not os.path.isfile(tpl_path):
    return view("404", {'body': f"View file {tpl_name} not found"}, return_code=404)

  # Load the layout
  layout = ""
  with open ("modules/layout.htm", "r") as fp:
    layout = fp.read()
  layout = layout.replace("$URL$", os.environ['SERVER_PATH'])
  layout = layout.replace("$title$", data['title'])

  with open(tpl_path, "r") as fp:
    content = fp.read()

    # Before running the variables, we need to replace a few common ones
    content = content.replace("$URL$", os.environ['SERVER_PATH'])

    for key, value in data.items():
      content = content.replace(f"${key}$", str(value))

    # The callers are allowed to add some variables into their data so that we
    # can make the experience better, e.g. the full app URL
    content = content.replace("$URL$", os.environ['SERVER_PATH'])

    # As a final step, wrap the template in the layout
    content = layout.replace("$body$", content)
    return (return_code, "text/html", content)
