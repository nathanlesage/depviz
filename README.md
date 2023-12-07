# DepViz

> Quickly visualize dependency trees of English sentences

DepViz is a tiny visualization server that is built on top of Spacy to quickly
visualize a sentence's dependency tree for educational purposes.

## Table of Contents

- [DepViz](#depviz)
  - [Table of Contents](#table-of-contents)
  - [Purpose \& Usage](#purpose--usage)
  - [Installation](#installation)
    - [Required Software](#required-software)
    - [Installing DepViz](#installing-depviz)
  - [Updating](#updating)
  - [Running DepViz](#running-depviz)
  - [Developing](#developing)
  - [License](#license)

## Purpose & Usage

I created this tool because I am a visual learner and have no formal linguistic
background. This means that for me, visualizing the grammatical relationships
within sentences is a quick way to verify how certain sub-trees stick together.

When you run this tool, it will output the various words of a sentence colored
by their purpose. For example, the various types of nouns are colored in cyan,
verbs and related words are pink and purple, conjugations are red, and
miscellaneous words (such as punctuation) are gray.

Clicking on any token will highlight only the subtree that includes that word.
In other words, selecting the root verb of a sentence will only highlight the
direct children of it, but highlighting a conjucation of a sentence will
highlight both the root of the sub-clause as well as the chain of words that
lead back to the main sentence root.

Each arrow that appears while sub-trees are highlighted will point from a word
to its "head" and the arrow will be labelled with the grammatical dependency
relationship that connects the two words.

To un-highlight a tree, click the token again.

Hovering with the mouse over a token will give you a variety of information,
such as the part-of-speech (POS) tag, the dependency relation, whether it is a
named entity (NER), and more.

## Installation

For now, this tool is meant to be simple to maintain, which means that it
doesn't ship with a nice installer. Instead, you will need to use the relevant
toolchains to build it from source.

> This tool can be run either locally on your computer, or on a server.

### Required Software

Specifically, you will need (the newest version should work fine in all cases):

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en)
* The [Yarn](https://yarnpkg.com/) package manager
* [PHP](https://www.php.net/)
* [Python](https://www.python.org/) (**important**: >3.x)
* The [Conda](https://docs.conda.io/en/latest/) package manager (recommendation:
  [Miniforge](https://github.com/conda-forge/miniforge))

On macOS, you can install all of these tools using [Homebrew](https://brew.sh/).

On Linux (servers), the situation is similar, but with whichever package manager
you have available (`apt`, `yum`, etc.).

> **Note**: Especially Miniforge must be installed with the user that will be
> running the PHP script. If you install DepViz locally on your computer, you
> won't need to worry about it, but if you want to install it on a server, this
> will matter.

### Installing DepViz

After you have the required software, setting up DepViz is comparatively simple:

```bash
# First, navigate into the correct folder
cd /path/to/desired/folder
# Then, clone the repository
git clone https://github.com/nathanlesage/depviz
cd depviz
# Step three: Install the JS dependencies with Yarn:
yarn install --immutable
# Step four, build the package:
yarn build # This will output the files to ./dist
```

At this point, the tool itself will be set up. The next step is to set up the
toolchain that can perform the actual dependency parsing. For this, this tool
uses SpaCy. To install SpaCy, and set everything up, run the script
[`setup.sh`](./setup.sh) from the root directory of the tool. This will install
all required dependencies into a Conda environment and create the required
`.env`-file. You can also run the commands manually, or use an already existing
environment, if you already have SpaCy installed on your computer.

> **Note**: The `.env`-file needs to point to the Python executable within the
> given Conda environment. If you already have an environment and don't want to
> duplicate this, simply activate the given environment (`conda activate env`)
> and retrieve the correct path to Python by running `which python`. See the
> file `.env.example` for what the file needs to look like.

## Updating

Despite the setup looking daunting, after that setup, updating the tool is very
simple:

1. Run `git pull` from the directory
2. Run `yarn build` again
3. Reload the tool's website.

## Running DepViz

To run DepViz locally, a simple PHP development server suffices. Since you by
now already have everything set up, you can simply run `yarn serve`. This will
set up a development server at `localhost:8080`. Simply navigate to
[http://localhost:8080/index.htm](http://localhost:8080/index.htm) as soon as
the server is running.

To run DepViz on an actual web server, you'll need to configure Apache or nginx
or whichever webserver you use to point to the correct directory.

**The correct directory is `./dist`, not the repository root!** Especially when
you install the tool on a webserver, make sure that the domain points to
`./dist` so that path attacks aren't successful and website visitors cannot
access `parse.py` or other possibly sensitive files. There is an `.htaccess`
file in the public directory that will ensure that dotfiles cannot be accessed.

## Developing

DepViz is written in TypeScript, so to contribute you'll need knowledge in that.

During development, you can run the command `yarn watch` in one terminal window,
and `yarn serve` in another one, which will serve the server and incrementally
build on each change. Then you'll only need to reload the website to see any of
your changes.

## License

&copy; 2023 Hendrik Erz. This code is licensed via GNU GPL 3.0 (only). See the
LICENSE file for more information.
