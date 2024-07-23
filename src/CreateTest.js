import React, { useState } from 'react';
import './CreateTest.css'; // Import the CSS file
import { useAuth } from './AuthContext';

const CreateTest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const { user, loading } = useAuth();

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setCategories(prevCategories =>
      checked ? [...prevCategories, value] : prevCategories.filter(c => c !== value)
    );
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    setImages(prevImages =>
      prevImages.map((img, i) => (i === index ? { ...img, file } : img))
    );
  };

  const handleImageTitleChange = (e, index) => {
    const title = e.target.value;
    setImages(prevImages =>
      prevImages.map((img, i) => (i === index ? { ...img, title } : img))
    );
  };

  const addImageField = () => {
    setImages(prevImages => [...prevImages, { file: null, title: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        user_id: user.userId, // 사용자 ID 추가
        title: title,
        description: description
    };
    console.log(user.userId, title, description)
    try {
        const response = await fetch(`http://172.10.7.117/api/plots`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }
};

  return (
    <div className="create-test-container">
      <div className="background">
      <h1>플롯 만들기</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Categories:</label>
          <div className="checkbox-group">
            <div>
              <input
                type="checkbox"
                id="category1"
                value="드라마"
                onChange={handleCategoryChange}
              />
              <label htmlFor="category1">드라마</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="category2"
                value="영화"
                onChange={handleCategoryChange}
              />
              <label htmlFor="category2">영화</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="category3"
                value="게임"
                onChange={handleCategoryChange}
              />
              <label htmlFor="category3">게임</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="category4"
                value="애니메이션"
                onChange={handleCategoryChange}
              />
              <label htmlFor="category4">애니메이션</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="category5"
                value="음악"
                onChange={handleCategoryChange}
              />
              <label htmlFor="category5">음악</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="category6"
                value="음식"
                onChange={handleCategoryChange}
              />
              <label htmlFor="category6">음식</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="category7"
                value="스포츠"
                onChange={handleCategoryChange}
              />
              <label htmlFor="category7">스포츠</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="category8"
                value="기타"
                onChange={handleCategoryChange}
              />
              <label htmlFor="category8">기타</label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Upload Images:</label>
          {images.map((img, index) => (
            <div key={index} className="image-upload-group">
              <input
                type="file"
                onChange={(e) => handleImageChange(e, index)}
                required
              />
              <input
                type="text"
                placeholder="Image Title"
                value={img.title}
                onChange={(e) => handleImageTitleChange(e, index)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addImageField}>Add Another Image</button>
        </div>
        <button type="submit">Create Test</button>
      </form>
      </div>
    </div>
  );
};

export default CreateTest;
