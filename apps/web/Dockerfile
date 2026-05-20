FROM node:21.7.0
WORKDIR /app
RUN npm install -g pnpm
COPY . .
EXPOSE 3000
CMD ["pnpm", "start", "-p", "3000"]  
