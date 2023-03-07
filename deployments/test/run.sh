port=9001
dbname=casciffo_db_test
dbuser=vp
dbpwd=vp123456
dbport=5432

if [ -z "$1" ]
then
	echo "Running with default values."
fi

echo "e.g ./run.sh -p=9000 -dbu=vp -dbn=casciffo_db_test -dbp=vp123456"

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


echo "Launching the app!"
java -jar casciffo.jar --port=$port --db-name=$dbname --db-user=$dbuser --db-pwd=$dbpwd --db-port=$dbport