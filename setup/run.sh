#!/bin/bash
@echo off
dbuser=vp
dbpwd=vp123456
dbport=5432
workDir="$(dirname "$(realpath -s "$0")")/.."


if [ -z "$1" ]; then
    echo "You can set the environment by running run.sh [env] where env can be \"prod\" or \"test\"."
    echo "Default is \"test\""
	if [ ! -f $workDir/deployments/test/casciffo.jar ]; then
		echo "File not found!"
		echo "Please run the respective bundle script!"
		exit 1
	fi
    echo "Running test app..."
    envd="test"
	port=9001
	dbname=casciffo_db_test
	appname=casciffo.jar
elif [ "$1" = "test" ]; then
	if [ ! -f $workDir/deployments/test/casciffo-test.jar ]; then
		echo "File not found!"
		echo "Please run the respective bundle script!"
		exit 1
	fi
    echo "Running test app..."
    envd="test"
	port=9001
	dbname=casciffo_db_test
	appname=casciffo-test.jar
elif [ "$1" = "prod" ]; then
	if [ ! -f $workDir/deployments/prod/casciffo.jar ]; then
		echo "File not found!"
		echo "Please run the respective bundle script!"
		exit 1
	fi
    echo "Running production app..."
    envd="prod"
	port=9000
	dbname=casciffo_db
	appname=casciffo.jar
fi

app_path="$workDir/deployments/$envd/$appname"

while getopts ":p:P:d:u:w:h" option; do
	case $option in
		p)	port=$OPTARG;;
		P)	dbport=$OPTARG;;
		d)	dbname=$OPTARG;;
		u)	dbuser=$OPTARG;;
		w)	dbpwd=$OPTARG;;
		h)	echo "This script launches the CASCIFFO application with 5 optional and 1 mandatory settings, these are:"
			echo "	prod|test	[MANDATORY]	The application environment, either prod or test, MUST be first argument."
			echo "	-p			[OPTIONAL] 	The port on which the app wil listen."
			echo "	-P			[OPTIONAL] 	The postgres listening port."
			echo "	-d			[OPTIONAL] 	The database name."
			echo "	-u			[OPTIONAL] 	The database user name."
			echo "	-w			[OPTIONAL] 	The password for the database user."
			echo "For values with spaces use double quotation marks, i.e -u \"user name one\"."
			echo "An example with the default values on how to use the script can be:"
			echo "./run.sh -p $port -P $dbport -d $dbname -u $dbuser -w $dbpwd"
			exit;;
		\?) echo "Invalid options, please use -h for help."
			exit;;
	esac
done

echo "Launching the app!"
java -jar $app_path --port=$port --db_name=$dbname --db_user=$dbuser --db_pwd=$dbpwd --db_port=$dbport
