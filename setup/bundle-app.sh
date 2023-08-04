#!/bin/bash

workDir="$(dirname $(realpath -s $0))/.."
envd="test"
envpath=""
if [ -z "$1" ]; then
    echo "Setting up test app..."
    echo "You can set the environment by running bundle-app.sh [env] where env can be \"prod\" or \"test\"."
    echo "Default is \"test\""
elif [ "$1" = "test" ]; then
    echo "Setting up test app..."
    envd="test"
else
    echo "Setting up production app..."
    envd="prod"
fi

envpath="$workDir/deployments/$envd"
mkdir -p $envpath
cd "$workDir/casciffo-front-end" || exit 1

echo "Installing front-end modules..."
npm install

echo
echo "Creating production build..."
npm run build

cd "$workDir/casciffo-spring-backend" || exit 2

echo
echo "Creating /webapp folder for static file serving..."
echo "This will remove the previous /webapp folder."
echo "If the folder already exists you'll be prompted with Are you sure? [y/n] - This confirms whether you'll want to remove the folder."
echo "To ensure the correct procedure we encourage you to say y."
rm -rf "$envpath/webapp"
mkdir "$envpath/webapp"

echo
echo "Copying optimized production build from front-end to /webapp..."
rsync -av --remove-source-files "$workDir/casciffo-front-end/build/" "$envpath/webapp/"

echo "Creating environment variables..."
source env.sh

echo "Bundling the app..."
./gradlew clean build -x test

mv "build/libs/casciffo-spring-backend-1.0.0.jar" "$envpath"

cd "$workDir/setup" 

if [ "$env" = "test" ]; then
        rm -f "$envpath/casciffo-test.jar"
        mv "$envpath/casciffo-spring-backend-1.0.0.jar" "$envpath/casciffo-test.jar"
else
        rm -f "$envpath/casciffo.jar"
        mv "$envpath/casciffo-spring-backend-1.0.0.jar" "$envpath/casciffo.jar"
fi

echo
echo "Done!"
echo "Run the app with the file run.sh!"

