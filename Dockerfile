FROM node:22-alpine
WORKDIR /app
COPY strona/ ./
# zad. 40: widok auta ten sam co w mvp/ (ramki, lupa, wzorzec obok, podpowiedź)
COPY mvp/widok-auta/widok.js ./public/widok.js
ENV PORT=3000
EXPOSE 3000
CMD ["node", "serwer.mjs"]
