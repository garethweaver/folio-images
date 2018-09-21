# Image to base64 thumbnails
A script I wrote to take full sized images, re-size them to 20px wide images and convert them to base64 strings.

## Setup
`npm install`

## Usage
1. Images go in the images folder
2. `gulp`

## Output
In the dist folder you'll find:
* The resized thumbnails
* Individual base64 json files in the `./json/` named after the original file
* A json file `base64.json` containing all the images as base64
