#! /bin/bash

ng build --aot --prod

rm ../burkel24.github.io/*.js &>/dev/null
rm ../burkel24.github.io/*.html &>/dev/null
rm ../burkel24.github.io/*.ico &>/dev/null
rm ../burkel24.github.io/*.map &>/dev/null
rm ../burkel24.github.io/*.css &>/dev/null
rm ../burkel24.github.io/*.txt &>/dev/null
rm ../burkel24.github.io/*.png &>/dev/null

cp preview.png dist/
cp dist/* ../burkel24.github.io/

cd ../burkel24.github.io/
git add --all
git commit -a -m "Deploy"
git push
cd -
