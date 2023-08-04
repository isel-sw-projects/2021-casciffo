#!/bin/bash

workDir="$(dirname "$(realpath -s "$0")")/.."

# read/write/execute permissions to jar files
find "$workDir/deployments" -type f -name "*.jar" -exec chmod 755 {} \;

# read/write/execute permissions to bash files
find "$workDir/setup" -type f -name "*.sh" -exec chmod 755 {} \;

# read/write permissions to directories
find "$workDir" -type d -exec chmod 755 {} \;

echo "In case there are permission problems you can manually address them with the command"
echo "find [projectDirectory] -type d -exec chmod 755 {} \;"
echo "find [projectDirectory] -type f -exec chmod 755 {} \;"
