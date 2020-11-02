#!/bin/sh

# Run JSDoc to generate the jekyll pages in markdown text format.
# Destination directory of the markdown files is ./docs_jekyll/docs/
# The used layout file is located in ./docs_jekyll/jsdoc_template/layout.tmpl (consult jsdoc config file for details).
../node_modules/.bin/jsdoc --debug -r ../src/ -c jsdoc.config.json -d ../docs_jekyll/docs
