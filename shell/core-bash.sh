source ./shell/bash-colors.sh



function package ()
{
	AVAIL=(brew port aptitube apt-get)

	for PKG in ${AVAIL[@]}
	do
		if [ `which $PKG` ]
		then
			grey "Executing $1 with $PKG\n";
			$PKG $@;
			return 0;
		fi
	done;
	
	AVSTR=${AVAIL[@]}
	
	# TODO stderr
	red "No package mananger found. Supported are: $AVSTR \n";
	
	exit 1;
}

function confirm ()
{
	echo -en $1 "[y/n]: ";
	
	
	read RESP;
	
	if [ $RESP = "y" ]
	then
		$2;
	fi;
}


function install-all() 
{
	for bin in $@
	do
		echo -n "Checking for $bin... ";

		if [ `which $bin` ]
		then
			green "yes";
		else
			red "no\n";

			grey "Installing $bin\n";

			install_$bin
		fi

		echo $BIN;
	done
}