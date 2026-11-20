FROM node:22-alpine
WORKDIR /app
COPY strona/ ./
ENV PORT=3000
EXPOSE 3000
CMD ["node", "serwer.mjs"]
