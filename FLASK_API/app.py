from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MariaDB 설정
app.config['HOST'] = 'database-1.cz2djirsoort.ap-northeast-1.rds.amazonaws.com'  # 데이터베이스 호스트
app.config['USER'] = 'admin'  # 데이터베이스 사용자명
app.config['PASSWORD'] = '123456789'  # 데이터베이스 암호
app.config['DB'] = 'team2'  # 데이터베이스 이름
app.config['CURSORCLASS'] = 'DictCursor'

mysql = pymysql.connect(
    host=app.config['HOST'],
    user=app.config['USER'],
    password=app.config['PASSWORD'],
    db=app.config['DB'],
    cursorclass=pymysql.cursors.DictCursor
)


@app.route('/flask/getip')
def index():
    # 현재 호스트 주소를 가져옴
    server_ip = request.host.split(':')[0]
    return jsonify({'server_ip': server_ip})

# 게시글 목록 가져오기
@app.route('/flask/posts', methods=['GET'])
def get_posts():
    boardtype = request.args.get('boardtype')  # 클라이언트에서 보낸 boardtype 요청 파라미터 가져오기

    with mysql.cursor() as cursor:
        if boardtype:  # boardtype이 주어진 경우 해당 유형에 맞는 게시글만 필터링
            cursor.execute("SELECT * FROM board2 WHERE board_type=%s ORDER BY B_numb DESC; ", (boardtype,))
        else:  # boardtype이 주어지지 않은 경우 모든 게시글을 가져옴
            cursor.execute("SELECT * FROM board2")

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
        cursor.execute("INSERT INTO board2 (board_type, time, title, content, email) VALUES (%s,%s, %s, %s, %s)",
                       (board_type,time, title, content, email))
        mysql.commit()

    return jsonify({'message': '게시글이 작성되었습니다.'})


# 게시글 삭제
@app.route('/flask/deletePost', methods=['POST'])
def delete_post():
    data = request.get_json()
    B_numb = data['B_numb']
   
    with mysql.cursor() as cursor:
        cursor.execute("DELETE FROM board2 WHERE B_numb = %s", (B_numb,))
        mysql.commit()

    return jsonify({'message': '게시글이 삭제되었습니다.'})

#답글 불러오기
@app.route('/flask/comments/<int:post_id>', methods=['GET'])
def get_comments(post_id):
    # Filter comments based on the post_id
     
    c_numb = post_id 
    with mysql.cursor() as cursor:
        cursor.execute("SELECT  C_numb, answer, TIME, B_numb, email FROM comments2 WHERE B_numb=%s", (c_numb,))
      

        comments = cursor.fetchall()

    return jsonify(comments)


#답글 작성하기
@app.route('/flask/createComments', methods=['POST'])
def post_comments():
    # Filter comments based on the post_id
   
    data = request.get_json()
    answer = data['answer']
    email = data['email']   
    B_numb = data['boardNumber']
    time = datetime.now()
    with mysql.cursor() as cursor:
        cursor.execute("INSERT INTO comments2 ( time, answer, B_numb, email) VALUES (%s,%s, %s, %s)",
                       (time, answer,B_numb, email))
        mysql.commit()
    return jsonify({'message': '댓글이 작성되었습니다.'})


# 답글 삭제
@app.route('/flask/deleteComment', methods=['POST'])
def delete_comments():
    data = request.get_json()
    C_numb = data['C_numb']
   
    with mysql.cursor() as cursor:
        cursor.execute("DELETE FROM comments2 WHERE C_numb = %s", (C_numb,))
        mysql.commit()

    return jsonify({'message': '답글이 삭제되었습니다.'})

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=4000)