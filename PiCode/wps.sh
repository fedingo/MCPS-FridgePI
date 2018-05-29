#!/bin/bash
# only run if there's no current wifi connection
sudo wpa_supplicant -Dnl80211 -iwlan0 -C/var/run/wpa_supplicant/ -c/etc/wpa_supplicant/wpa_supplicant.conf -dd
ssid_name='NOT_A_NETOWORK'
while  ! cat /etc/wpa_supplicant/wpa_supplicant.conf | grep -q "$ssid_name"; do
       # grab AP's that support WPS, sort by strength and select the strongest 
        sleep 3s
        wpa_cli scan | wpa_cli scan_results | grep WPS | sort -r -k3 | awk 'END{print $1}'  >/tmp/wifi
        read ssid < /tmp/wifi
        wpa_cli wps_pbc $ssid
        wpa_cli scan | wpa_cli scan_results | grep WPS | sort -r -k3 | awk 'END{print $NF}'  >/tmp/wifi_name
        read ssid_name < /tmp/wifi_name
        sleep 3s
done
rm /tmp/wifi
rm /tmp/wifi_name
wpa_cli -i wlan0 reconfigure
sleep 3s
python /home/pi/camera.py 192.168.43.99:8000 $DEV_NAME &
