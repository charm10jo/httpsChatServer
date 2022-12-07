# 1
FROM node:16 AS builder
# 2 컨테이너 내부 경로
WORKDIR /app
# 3.1앱 의존성 설치
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# 와일드카드를 사용
COPY package*.json ./
# 3.2 앱 소스 추가(?)
COPY . .
# 4
RUN npm install
# 5
RUN npm run build


# STEP 2
#6
FROM node:16-alpine

#6.1 Korean Fonts
RUN apk --update add fontconfig
RUN mkdir -p /usr/share/fonts/nanumfont
RUN wget http://cdn.naver.com/naver/NanumFont/fontfiles/NanumFont_TTF_ALL.zip
RUN unzip NanumFont_TTF_ALL.zip -d /usr/share/fonts/nanumfont
RUN fc-cache -f && rm -rf /var/cache/*

#6.2 bash install
RUN apk add bash

#6.3 Language
ENV LANG=ko_KR.UTF-8 \
    LANGUAGE=ko_KR.UTF-8

#6.4 Set the timezone in docker
RUN apk --no-cache add tzdata && \
        cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
        echo "Asia/Seoul" > /etc/timezone

#7
WORKDIR /app
#8
# Node ENV
#ENV NODE_ENV=development
#9
COPY --from=builder /app ./
#10
CMD [ "node", "dist/main" ]