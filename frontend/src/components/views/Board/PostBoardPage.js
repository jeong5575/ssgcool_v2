import React, {  useMemo,useState,useRef  } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Typography, Button, Form, message } from 'antd';
import axios from 'axios';
// Import the required language packs
import { styled } from 'styled-components';
import { useSelector } from 'react-redux';
import AWS from 'aws-sdk';


AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY',
});


const { Title } = Typography;

const Container = styled.div`
  width: 500px;
  margin: 0 auto;
`;

const PostBoardPage = (props) => {
  const user = useSelector((state) => state.user);

  const [content, setContent] = useState('');
  // Define the quillRef using the useRef hook
  const quillRef = useRef(null);

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  
    input.addEventListener("change", async () => {
      const editor = quillRef.current.getEditor();
      const file = input.files[0];
      const range = editor.getSelection(true);
  
      try {
        // Create an instance of the S3 service
        const s3 = new AWS.S3();
  
        // Set your S3 bucket name
        const bucketName = "your-s3-bucket-name";
  
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
        console.log(error);
      }
    });
  };

  const onEditorChange = (value) => {
    setContent(value);
    console.log(content);
  };


  const onSubmit = (event) => {
    event.preventDefault();

    if (user.userData && !user.userData.isAuth) {
      return alert('Please Log in first');
    }

    const variables = {
      content: content,
      userID: user.userData._id,
    };

    axios
      .post('/api/blog/createPost', variables)
      .then((response) => {
        if (response.data.success) {
          message.success('Post Created!');
          setContent(''); // Clear the editor content after successful submission

          setTimeout(() => {
            props.history.push('/blog');
          }, 2000);
        } else {
          message.error('Failed to create post.');
        }
      })
      .catch((error) => {
        message.error('An error occurred while creating the post.');
        console.error(error);
      });
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike","blockquote","code-block"],
          
          [{ list: "ordered" }, { list: "bullet" }],
          
          [{ align: [] }, "link"],[{"image": imageHandler}],
        ],
      },
    }
  }, [])


  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'code-block', // Enable the 'code-block' format
  ];

  return (
    <Container>
      <div style={{ textAlign: 'center' }}>
        <Title level={2}>Editor</Title>
      </div>
      <ReactQuill
        value={content}
        onChange={onEditorChange}
      
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder="Write something..."
      />

      <Form onSubmit={onSubmit}>
        <div style={{ textAlign: 'center', margin: '2rem' }}>
          <Button size="large" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default PostBoardPage;
