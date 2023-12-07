#!/bin/bash

# Run this file in the root of the repository to set up all dependencies for the
# tool and generate the required .env file.

# Choose the name of the Conda environment (default: spacy)
CONDA_ENV_NAME="spacy"

# Which Pipeline do you want to install? See https://spacy.io/usage for all.
PIPELINE="en_core_web_sm" # Default: en_core_web_sm (English small)

# Now set up

# 1. Create an empty Conda environment
conda create --name $CONDA_ENV_NAME python=3.9

# 2. Activate said environment
conda activate $CONDA_ENV_NAME

# 3. Install SpaCy into the environment
conda install -c conda-forge spacy

# 4. Install the appropriate NLP pipeline
python -m spacy download $PIPELINE

# 5. Create the correct dotenv for the tool
EXEC=$(which python)
echo "SPACY_VENV_PYTHON_EXEC=$EXEC" > dist/.env
