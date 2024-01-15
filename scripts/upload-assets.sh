#!/bin/bash
set -e

rsync -ahu --delete public/assets/ ../portfolio-static-files/assets
cd ../portfolio-static-files
git add .
git commit -m "$1"
git push
cd ../github
