#!/bin/bash
filename="/Users/apavlovic/Desktop/master rad/kartografski-web-klijent/public/logo64.png"
hostname="ftpupload.net"
username="epiz_32051996"
password="Auel8Vtoue"
ftp -un $hostname <<EOF
quote USER $username
quote PASS $password
binary
put $filename
quit
EOF
