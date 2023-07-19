from flask import Flask, jsonify, request
import pymysql

app = Flask(__name__)

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
@app.route('/api/posts', methods=['GET'])
def get_posts():
    with mysql.cursor() as cursor:
        cursor.execute("SELECT * FROM board")
        posts = cursor.fetchall()
    return jsonify(posts)

# 게시글 작성
@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    title = data['title']
    content = data['content']
    email = data['email']

    with mysql.cursor() as cursor:
        cursor.execute("INSERT INTO board (board_type, title, content, email) VALUES (%s, %s, %s, %s)",
                       ('게시판 종류', title, content, email))
        mysql.commit()

    return jsonify({'message': '게시글이 작성되었습니다.'})

if __name__ == '__main__':
    app.run()