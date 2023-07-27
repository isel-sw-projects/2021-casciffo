port=9001
dbname=casciffo_db_test
dbuser=vp
dbpwd=vp123456
dbport=5432

if [ ! -f ../deployments/test/casciffo-test.jar ]; then
    echo "File not found!"
	echo "Please run the bundle script with \"test\" as arguement (without the quotation marks)!"
	exit 1
fi

if [ -z "$1" ];
then
	echo "Running with default values."
fi

while getopts ":p:P:d:u:w:h" option; do
	case $option in
		p)	port=$OPTARG;;
		P)	dbport=$OPTARG;;
		d)	dbname=$OPTARG;;
		u)	dbuser=$OPTARG;;
		w)	dbpwd=$OPTARG;;
		h)	echo "This script launches the CASCIFFO application with 5 optional settings, these are:"
			echo "	-p		The port on which the app wil listen."
			echo "	-P		The postgres listening port."
			echo "	-d		The database name."
			echo "	-u		The database user name."
			echo "	-w		The password for the database user."
			echo "For values with spaces use double quotation marks, i.e -u \"user name one\"."
			echo "An example with the default values on how to use the script can be:"
			echo "./run.sh -p $port -P $dbport -d $dbname -u $dbuser -w $dbpwd"
			exit;;
		\?) echo "Invalid options, please use -h for help."
			exit;;
	esac
done

echo "Launching the app!"
java -jar ../deployments/casciffo-test.jar --port=$port --db_name=$dbname --db_user=$dbuser --db_pwd=$dbpwd --db_port=$dbport