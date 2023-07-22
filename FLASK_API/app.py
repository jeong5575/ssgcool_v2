from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MariaDB 설정
app.config['HOST'] = '15.164.153.191'  # 데이터베이스 호스트
app.config['USER'] = 'team2'  # 데이터베이스 사용자명
app.config['PASSWORD'] = 'team2'  # 데이터베이스 암호
app.config['DB'] = 'team2'  # 데이터베이스 이름
app.config['CURSORCLASS'] = 'DictCursor'

mysql = pymysql.connect(
    host=app.config['HOST'],
    user=app.config['USER'],
    password=app.config['PASSWORD'],
    db=app.config['DB'],
    cursorclass=pymysql.cursors.DictCursor
)

# 게시글 목록 가져오기
@app.route('/flask/posts', methods=['GET'])
def get_posts():
    boardtype = request.args.get('boardtype')  # 클라이언트에서 보낸 boardtype 요청 파라미터 가져오기

    with mysql.cursor() as cursor:
        if boardtype:  # boardtype이 주어진 경우 해당 유형에 맞는 게시글만 필터링
            cursor.execute("SELECT * FROM board WHERE board_type=%s", (boardtype,))
        else:  # boardtype이 주어지지 않은 경우 모든 게시글을 가져옴
            cursor.execute("SELECT * FROM board")

        posts = cursor.fetchall()

    return jsonify(posts)


# 게시글 작성
@app.route('/flask/createPosts', methods=['POST'])
def create_post():
    data = request.get_json()
    title = data['title']
    content = data['content']
    email = data['email']
    board_type = data['boardType']
    time = datetime.now()
    with mysql.cursor() as cursor:
        cursor.execute("INSERT INTO board (board_type, time, title, content, email) VALUES (%s,%s, %s, %s, %s)",
                       (board_type,time, title, content, email))
        mysql.commit()

    return jsonify({'message': '게시글이 작성되었습니다.'})

if __name__ == '__main__':
    app.run(debug=True, port=4000)