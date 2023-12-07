import spacy
import sys
import os
import json

if __name__ == "__main__":
  if len(sys.argv) < 3:
    raise ValueError("Too few arguments. Usage: parse.py <infile> <outfile>")

  infile = sys.argv[1]
  outfile = sys.argv[2]

  if not os.path.isfile(infile):
    raise ValueError("Infile not found.")

  with open(infile, "r") as fp:
    sentence = fp.read().strip()

  # Load pipeline and parse sentence
  nlp = spacy.load('en_core_web_sm')
  doc = nlp(sentence).to_json()

  with open(outfile, "w") as fp:
    json.dump(doc, fp, skipkeys=True, indent="  ")
