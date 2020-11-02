#!/bin/bash


if [[ -z "$user" && -z "$server" && -z "$destination" ]]; then
    echo "No env vars found. Loading up .env file ..."
    set -o allexport
    [[ -f ../.env ]] && source ../.env
    set +o allexport
else
    echo "Env vars found."
fi


while true; do
    read -p "Do you wish compile the jekyll pages before uploading (y/n)? " yn
    case $yn in
        [Yy]* ) cd ../docs_jekyll; bash build.sh; cd ../bin; break;;
        [Nn]* ) break;; #exit;;
        * ) echo "Please answer y or n.";;
    esac
done


function addTrackerToDemos() {
    # Read tracker code into file
    if [ ! -f ../docs_jekyll/_tracker.js ]; then
	echo "WARN No tracker code found."
	return
    fi

    mkdir -p ../demos_with_tracker
    cp -r ../demos/* ../demos_with_tracker

    # How to replace text in a file with contents of a differnt file using sed
    #    https://stackoverflow.com/questions/6790631/use-the-contents-of-a-file-to-replace-a-string-using-sed
    str="<\/body>"
    fileToInsert=../demos_with_tracker/_tmp_tracker.js
    cat ../docs_jekyll/_tracker.js > ../demos_with_tracker/_tmp_tracker.js
    echo "</body>" >> ../demos_with_tracker/_tmp_tracker.js
    
    for d in ../demos_with_tracker/*; do
	if [ -d "$d" ]; then
	    for f in "$d"/*.html; do
		if [ -f "$f" ]; then
		    cp "$f" ../demos_with_tracker/_tmp.html
		    sed -e "/$str/r $fileToInsert" -e "/$str/d" ../demos_with_tracker/_tmp.html > "$f"
		    rm ../demos_with_tracker/_tmp.html 
		fi
	    done
	fi
    done
}


addTrackerToDemos
# exit 1


echo "Uploading to $server ..."

# rsync -avH ../docs_jekyll/_site/*  -e ssh user@server:/your/destination/path
rsync -avH ../docs_jekyll/_site/*  -e ssh $user@$server:$destination
rsync -avH ../demos_with_tracker/* -e ssh $user@$server:"$destination/repo/demos/"
rsync -avH ../dist                 -e ssh $user@$server:"$destination/repo/"
rsync -avH ../lib                  -e ssh $user@$server:"$destination/repo/"
rsync -avH ../screenshots          -e ssh $user@$server:"$destination/repo/"
rsync -avH ../src                  -e ssh $user@$server:"$destination/repo/"
rsync -avH ../tests                -e ssh $user@$server:"$destination/repo/"
rsync -avH ../*.*                  -e ssh $user@$server:"$destination/repo/"

# Clear demos with tracker dir
rm -rf ../demos_with_tracker
