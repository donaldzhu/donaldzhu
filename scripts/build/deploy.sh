#!/bin/bash
set -e

# gh-pages -d build "$@"
git checkout gh-pages
git checkout main -- public/assets
rsync -ahu --delete public/assets/ assets
rm -rf public
git add .
git commit -m "copied assets folder"
git push
git checkout main
