FROM node
ADD . app
ENV  MONGODB_URL=mongodb://3.6.229.134:27017/volleyballproject
ENV JWT_SECRET=dummy1
ENV SMTP_HOST=dummy1


RUN cd app&&npm i --silent
ENTRYPOINT cd app && npm run start --silent
