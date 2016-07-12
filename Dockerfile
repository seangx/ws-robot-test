FROM node:4.4.7-wheezy
COPY robot-test /robot-test
ENTRYPOINT cd /robot-test&&node app.js