#!/bin/bash

set -e

SOURCE="icons/stimmton-icon.svg"

inkscape "$SOURCE" \
  --export-filename="icons/stimmton-favicon-32.png" \
  --export-width=32 \
  --export-height=32

inkscape "$SOURCE" \
  --export-filename="icons/stimmton-icon-192.png" \
  --export-width=192 \
  --export-height=192

inkscape "$SOURCE" \
  --export-filename="icons/stimmton-icon-512.png" \
  --export-width=512 \
  --export-height=512

echo "Stimmton icons generated."