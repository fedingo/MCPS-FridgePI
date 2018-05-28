# MCPS-FridgePI
Client and Server side applications and Rasperry scripts for the Smart Fridge project for the Mobile and Cyber Physical System class.

# 1 Server-Side Application

https://github.com/matterport/Mask_RCNN/releases/download/v2.0/mask_rcnn_coco.h5
In this link you can download the model for the Mask_RCNN, that is necessary for the server to run.

# 1.1 Usage

To start up the Web Server:

    ./web-server.py [<host>][<port>]
    ./web-server.py [<port>]
    ./web-server.py
    
# 2 Client-side Application

React web interface for the user view.
Features:
- registration of a new user
- login of a user
- products list visualization
- addition of a new device
- recipes suggestions

# 2.2 Usage

- Change ```host``` variable in "App.js" file
- Install with ```npm install```
- To start up the application:
    ```npm start```

# 3 Raspberry-side Application

- Store every file inside PiCode directory into your home raspberry directory.
- Add a global variable ```$DEV_NAME``` as unique device identifier.
- Run ```wps.sh``` at startup. (e.g. insert the command into ```/etc/rc.local``` )

# 4 Documentation

Slides from the final presentation and the poster are inside the Documents folder.
