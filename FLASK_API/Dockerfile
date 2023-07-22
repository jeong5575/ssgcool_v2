FROM python:3.9-slim
#base이미지

WORKDIR /app
#/app 디렉토리를 생성하고 그안에서 작업이 이루어진다.

COPY . .
# 현재 폴더에 있는 파일들을 /app 폴더로 복사한다.

RUN pip install -r requirements.txt
#requirements.txt 에 명시되어있는 패키지들을 설치한다.

CMD gunicorn --bind 0.0.0.0:4000 app:app
#5000번 포트로 들어오는 요청을 app 모듈의 app 객체와 연결 해준다.