
import { useSelector } from 'react-redux';
import Layout from '../../../hoc/Layout';
import Comment from './Comment';
import axios from 'axios';
import React, {  useMemo,useState,useRef,useEffect  } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Typography, Button, Form, message, Input } from 'antd';
// Import the required language packs
import { styled } from 'styled-components';
import AWS from 'aws-sdk';
import { Navigate, useNavigate} from 'react-router-dom'

const PostDetailPage = (props) => {


const imageHandler = async () => {
    

  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();
  console.log("이미지핸들러")
  input.addEventListener("change", async () => {
    const editor = QuillRef.current.getEditor();
    const file = input.files[0];
    const range = editor.getSelection(true);

    try {
      // Create an instance of the S3 service
      const s3 = new AWS.S3();

      // Set your S3 bucket name
      const bucketName = "ssgcool";

      // Create a unique name for the image using the current timestamp
      const imageName = `image/${Date.now()}_${file.name}`;

      // Upload the file to AWS S3
      await s3.upload({
        Bucket: bucketName,
        Key: imageName,
        Body: file,
        ContentType: file.type,
      }).promise();

      // Generate the image URL
      const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageName}`;
      // Insert the image URL into the editor
      editor.insertEmbed(range.index, "image", imageUrl);
      editor.setSelection(range.index + 1);
    } catch (error) {
     console.log(error)
    }
  });
};


const onSubmit = (event) => {
  if (user && !user.isAuth) {
    return alert('Please Log in first');
  }
  const variables = {
    answer: content,
    userID: user._id,
    title: title,
    email: user.email,
    boardType: boardType,
    boardNumber: selectedPost.B_numb
  };
  axios
  .post('/flask/createComments', variables)
  .then(() => {
  
      setContent(''); // Clear the editor content after successful submission

      setTimeout(() => {
        window.location.reload();
      }, 2000);
          }
  )
  .catch((error) => {
    message.error('An error occurred while creating the comment.');
    console.error(error);
  });
};
const modules = useMemo(
  () => ({
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike", "blockquote","code-block"],
        [{ size: ["small", false, "large", "huge"] }, { color: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { align: [] },
          
        ],
        ["image"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }),
  []
);


const selectedPost = useSelector((state) => state.post.selectedPost);

const [boardNumber, setboardNumber] =  useState('');

const user = useSelector((state) => state.user.register);

const [content, setContent] = useState('');
const [title, setTitle] = useState('');
const [boardType, setboardType] =  useState('질문');
// Define the quillRef using the useRef hook
const QuillRef = useRef(null);
const navigate = useNavigate();

const deletePost = async () => {
  const variables = {
    answer: content,
    userID: user._id,
    title: title,
    email: user.email,
    boardType: boardType,
    B_numb: selectedPost.B_numb
  };
  axios
  .post('/flask/deletePost', variables)
  .then(() => {
  
      setContent(''); // Clear the editor content after successful submission

      setTimeout(() => { message.success('게시글 삭제 완료');
      navigate('/board');
      }, 1000);
          }
  )
  .catch((error) => {
    message.error('게시글 삭제중 오류가 발생하였습니다.');
    console.error(error);
  });
};

const updatePost = async () => {
  try {
    const response = await axios.get(`/flask/updatePost`);
    setComments(response.data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

    const post = useSelector((state) => state.post.selectedPost);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchComments();
      }, []);
    
      
  const fetchComments = async () => {
    try {
      // Fetch comments from the backend API based on the selected post's ID (post.B_numb)
      const response = await axios.get(`/flask/comments/${post.B_numb}`);
      setComments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return ( <Layout>
  <div style={{ padding:'20px' ,border: '1px solid #ccc', borderRadius: '10px', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)', marginBottom: '50px' }}>
      <h1>{post.title}</h1>
      <p style={{ fontWeight: 'lighter'}}>{post.time && (
      <span>   {new Date(post.time).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
       
      })}</span>
    )}</p>
      <div style={{ borderBottom: '1px solid #ccc', marginBottom: '30px' }}></div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <p>작성자: {post.email}</p><div>
      {/* {post.email === user.email && <Button onClick={updatePost}>수정하기</Button>} */}
      {post.email === user.email && <Button onClick={deletePost}>삭제하기</Button>}
    </div>
      {/* Add any other details you want to show on the detailed post page */}
    </div>
    
     {/* Display comments */}
    
     <div>

     <h2>{comments.length}개의 답변이 있어요 </h2>
     



     <Form onFinish={onSubmit}>
       
       <ReactQuill
                ref={(element) => {
                   if (element !== null) {
                     QuillRef.current = element;
                   }
                 }}
                 value={content}
                 onChange={setContent}
                 modules={modules}
                 theme="snow"
                 placeholder="내용을 입력해주세요."
               />
 
      
         <div style={{ textAlign: 'center', margin: '2rem' }}>
           <Button size="large" htmlType="submit">
            답글 달기
           </Button>
         </div>
       </Form>

    
        {comments.map((comment) => (
          <div  key={comment.commentId} style={{  marginBottom: '10px',padding:'5px' ,border: '1px solid #ccc', borderRadius: '10px',boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)' }}>
            <Comment comment={comment} /> 
          </div>
        ))}
      </div>
      
      {/* 이미지 사이즈 조정 */}
      <style>{`
        img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </Layout>
  );
};

export default PostDetailPage;