#!/bin/bash
set -e

rsync -ahu --delete public/assets/ ../portfolio-static-files-development/assets
cd ../portfolio-static-files-development
git add assets/desktop/thumbnails
git commit -m "$1"
git push
git add assets/desktop/work
git commit -m "$1"
git push
git add assets/mobile/thumbnails
git commit -m "$1"
git push
git add assets/mobile/work
git commit -m "$1"
git push
git add .
git commit -m "$1"
git push
cd ../github
