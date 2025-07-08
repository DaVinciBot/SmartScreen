#!/bin/bash
export DISPLAY=:0
log_file="/home/admin/service_log.txt"
cd /home/admin/SmartScreen
npm run start >> "$log_file" 2>&1  &
chromium-browser --kiosk "https://cast.davincibot.fr/public/receiver.html" >> "$log_file" 2>&1 & 
