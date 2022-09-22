#!/bin/bash

export PATH=$PATH:/usr/bin:/usr/local/bin
cd $HOME/railway
if [ "$1" = "up" ]; then
	h=0
	m=$(($RANDOM%60));
	# run spider
	date >> log
	node railway.js up &>> log
	echo >> log
	# delete last cron job
	crontab -l > all.cron
	sed -i "/railway.sh up/d" all.cron 
	echo "$m $h * * * $HOME/railway/railway.sh down" >> all.cron
	crontab all.cron
elif [ "$1" = "down" ]; then
	h=9
	m=$(($RANDOM%60));
	# run spider
	date >> log
	node railway.js down &>> log
	echo >> log
	# delete last cron job
	crontab -l > all.cron
	sed -i "/railway.sh down/d" all.cron 
	echo "$m $h * * * $HOME/railway/railway.sh up" >> all.cron
	crontab all.cron
fi


