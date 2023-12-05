# This file renders the home page
from .template import view
import spacy
from spacy.tokens.token import Token

# Set up the NLP model
print("Loading Spacy NLP pipeline ...")
nlp = spacy.load('en_core_web_sm')
print("Pipeline loaded!")

def render_home(sentence: str):
  return view("home", {
    'title': "Home",
    'sentence': sentence,
    'doc': nlp(sentence).to_json() if sentence.strip() != '' else ''
  })
# So we have set up a system based on the premise that there would be no implicit tax on our young people, that the whole country would bear that tax, but we have not put the burden on the whole country, nor have we put the burden on the other parts of our Federal budget which are not oriented toward defense.
