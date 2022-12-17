FROM jarredsumner/bun:edge
WORKDIR /app
COPY . .
EXPOSE 5000
ENTRYPOINT ["bun", "src/main.js"]

### touch Dockerfile
### docker build -t s .; docker run -it --rm -p 5000:5000 s