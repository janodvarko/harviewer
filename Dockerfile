FROM node:14 as builder

COPY . /work

WORKDIR /work

RUN npm install && npm run clean-build


FROM nginx

COPY --from=builder /work/webapp-build /usr/share/nginx/html
