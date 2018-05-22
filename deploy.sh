quasar build -m pwa
rm -rf ~/docker/nginx/html/*
cp -rf ./dist/pwa-mat/* ~/docker/nginx/html