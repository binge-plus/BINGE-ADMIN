#!/bin/bash

# Start Nodemon on server
APP_FILE="server.js"

# Start the Streamlit application in the background
nohup nodemon $APP_FILE  > nodemon-workflow-dashboard.log 2>&1 &