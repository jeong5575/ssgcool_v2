import React, {  useMemo,useState,useRef  } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Typography, Button, Form, message, Input } from 'antd';
import axios from 'axios';
// Import the required language packs
import { styled } from 'styled-components';
import { useSelector } from 'react-redux';
import AWS from 'aws-sdk';
import { useNavigate   } from 'react-router-dom';

const accessKeyId = process.env.REACT_APP_ACCESSS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_SECRET_ACCESS_KEY;

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});


const { Title } = Typography;

const Container = styled.div`
  width: 500px;
  margin: 0 auto;
`;

const PostBoardPage = (props) => {
  const user = useSelector((state) => state.user.register);

  console.log(props)
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [boardType, setboardType] =  useState('QnA');
  // Define the quillRef using the useRef hook
  const QuillRef = useRef(null);

  
  const handleButtonClick = (type) => {
    console.log(type);
    setboardType(type);
  };
  const navigate = useNavigate();
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
    console.log("clicked");
    console.log(content);
    if (user && !user.isAuth) {
      return alert('Please Log in first');
    }

    const variables = {
      content: content,
      userID: user._id,
      title: title,
      email: user.email,
      boardType: boardType,
      nickname: user.name
    };
    console.log(variables)
    axios
    .post('/flask/createPosts', variables)
    .then(() => {
        message.success('게시글 등록 완료!');
        setContent(''); // Clear the editor content after successful submission

        setTimeout(() => {
          navigate("/board")
        }, 1000);
            }
    )
    .catch((error) => {
      message.error('An error occurred while creating the post.');
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

  return (
    <Container>
      <div>
        <Button onClick={() => handleButtonClick('free')}>자유게시판</Button>
        <Button onClick={() => handleButtonClick('Study')}>스터디모집</Button>
        <Button onClick={() => handleButtonClick('QnA')}>질문</Button>
      </div>
       <Form onFinish={onSubmit}>
       
      <div style={{ textAlign: 'center' }}>
        <Title level={2}>{boardType}</Title>
      </div>
      <Form.Item>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
            style={{ fontWeight: 'bold', fontSize: '18px' }}
          />
        </Form.Item>
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
            등록하기
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default PostBoardPage;
