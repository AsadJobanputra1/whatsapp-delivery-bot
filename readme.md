# Overview
This utility will read a csv file containing recipient phone numbers, 
message body, and scheduled times, and will send messages at the 
scheduled time.


# Pre-requisites
* nodejs 18+
* run pupeteer (i.e. runtime must be able to run chrome headless)
* whatsapp account, personal or business account

#install dependencies
```
sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

brew install gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```
# Config
See .env file for variable to configure:
- location of csv data file
- how often the csv file should be re-processed
- manager phone number that is informed when service starts


# Sample Data file
Create CSV file named data/info.csv

Example File:
id,recipient,phonenumber,date,time,message
1,Asad,14162304207,2023/06/24,17:45,from csv
2,TopuVai,8801400815518,2023/06/24,16:45,some new message 1
3,john,8801400815518,2023/06/24,16:45,some new message 2
4,alice,8801400815518,2023/06/24,16:10,some new message 3

id - incremental int, not used
recipient - anything, not used
phone - number with country code (14162304207) ; can only send message for names in your contacts
time - executes at server time, don't enter many entries that run at the same time, it can cause a crash.
message - is the message to be sent


# Code flow
The code is written in function-based programming style.  No need for major layers of code here.

On startup, the whatsapp client is started. whatsAppClient.initialize()
If its not authenticated, then admin gets a QR code in the command line, and has to use mobile app
to authenticate the server app.  Then if it is authenticated, then the authentication session is saved locally
no need to re-authenticate on every started.

whatsAppClient.on 'ready' event (L31)
When the whatsapp client is ready (authentication complete), then 
it processes the csv file

processing the csv file involves:
readCSVfile
clear all existing schedules
loop through all records in CSV file
    add schedule job for every file in CSV


when the scheduler triggers
then the system will sendWhatsappMessage

references:
whatsapp project
https://wwebjs.dev/guide/#installation