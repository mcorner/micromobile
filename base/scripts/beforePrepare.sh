#!/bin/bash

npm install
rm -rf www
mkdir www
cp -r src/* www

if [ "$CORDOVA_ENV" == "production" ]
then
  browserify -g [envify --NODE_ENV 'production'] -g browserify-css -t [ babelify --presets [ es2015 react es2017 stage-0  ] ] src/js/app.jsx | uglifyjs -m -c dead_code > www/js/app.js && ls -l www/js/app.js
else
  browserify -g browserify-css -t [ babelify --presets [ es2015 react es2017 stage-0  ] ] src/js/app.jsx -o www/js/app.js
fi


#browserify -g [envify --NODE_ENV 'production'] -t [ babelify --presets [ es2015 react es2017 stage-0  ] ] src/js/app.jsx | uglifyjs -m -c dead_code -b ascii_only=true> www/js/app.js
