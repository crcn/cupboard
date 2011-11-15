txtund=$(tput sgr 0 1)    # Underline
txtbld=$(tput bold)       # Bold
txtred=$(tput setaf 1)    # Red
txtgrn=$(tput setaf 2)    # Green
txtylw=$(tput setaf 3)    # Yellow
txtblu=$(tput setaf 4)    # Blue
txtpur=$(tput setaf 5)    # Purple
txtcyn=$(tput setaf 6)    # Cyan
txtwht=$(tput setaf 7)    # White
txtwgr=$(tput setaf 8)    # Grey
txtrst=$(tput sgr0)       # Text reset


function green ()
{
	echo -en ${txtgrn}$1${txtrst};
}

function red ()
{
	echo -en ${txtred}$1${txtrst};
}

function yellow ()
{
	echo -en ${txtylw}$1${txtrst};
}

function grey ()
{
	echo -en ${txtwgr}$1${txtrst};
}
