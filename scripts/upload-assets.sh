#!/bin/bash
set -e

rsync -ahu --delete public/assets/ ../portfolio-static-files-development/assets
cd ../portfolio-static-files-development
git add .
git commit -m "$1"
git push
cd ../github
