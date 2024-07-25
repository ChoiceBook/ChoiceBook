import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CreateTest.css'; // Import the CSS file
import { useAuth } from './AuthContext';
import HomeButton from './HomeButton';

const CreateTest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setCategories(prevCategories =>
      checked ? [...prevCategories, parseInt(value)] : prevCategories.filter(c => c !== parseInt(value))
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

  const deleteImageField = (index) => {
    setImages(prevImages => prevImages.filter((img, i) => i !== index));
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create the plot
      const plotData = {
        user_id: user.userId,
        title: title,
        description: description,
      };

      const plotResponse = await fetch(`http://172.10.7.117/api/plots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plotData),
      });

      if (!plotResponse.ok) {
        throw new Error('Failed to create plot');
      }

      const plotResult = await plotResponse.json();
      const plotId = plotResult.plotId;
      console.log('Plot created successfully:', plotResult);

      // Step 2: Link categories to the plot
      const categoryData = categories.map((categoryId) => ({
        plot_id: plotId,
        category_id: categoryId,
      }));

      await Promise.all(
        categoryData.map(async (catData) => {
          const categoryResponse = await fetch(`http://172.10.7.117/api/plotcategories`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(catData),
          });

          if (!categoryResponse.ok) {
            throw new Error('Failed to link categories');
          }
        })
      );

      console.log('Categories linked successfully');

      // Step 3: Upload items and link images
      await Promise.all(
        images.map(async (img, index) => {
          const itemData = {
            plot_id: plotId,
            item_name: img.title
          };

          // Create the item
          const itemResponse = await fetch(`http://172.10.7.117/api/items`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
          });

          if (!itemResponse.ok) {
            throw new Error('Failed to create item');
          }

          const itemResult = await itemResponse.json();
          const itemId = itemResult.itemId;
          console.log('Item created successfully:', itemResult);

          // Upload the image
          const formData = new FormData();
          formData.append('title', itemId);
          formData.append('image', img.file);
          
          console.log(itemId);
          const imageResponse = await fetch(`http://172.10.7.117/api/upload`, {
            method: 'POST',
            body: formData,
          });

          if (!imageResponse.ok) {
            throw new Error('Failed to upload image');
          }

          const imageResult = await imageResponse.json();
          console.log('Image uploaded successfully:', imageResult);

          // Update the item with the image URL
          const updateData = {
            item_image_url: `http://172.10.7.117/${imageResult.file.path}`,
          };
          console.log('URL:', imageResult.file.path);
          const updateResponse = await fetch(`http://172.10.7.117/api/items/${itemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          });

          if (!updateResponse.ok) {
            throw new Error('Failed to update item with image URL');
          }

          console.log('Item updated with image URL successfully');
        })
      );

      console.log('All items created and images uploaded successfully');

      navigate('/'); // Adjust the path as needed
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="create-test-container">
      <HomeButton />
      <div className="background">
        <button className="close-button" onClick={handleClose}>X</button>
        <h1>플롯 생성하기</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목</label>
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
            <label htmlFor="description">설명</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>카테고리</label>
            <div className="checkbox-group">
              <div>
                <input
                  type="checkbox"
                  id="1"
                  value="1" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label2 htmlFor="category1">드라마</label2>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="2"
                  value="2" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label2 htmlFor="category2">영화</label2>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="3"
                  value="3" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label2 htmlFor="category3">게임</label2>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="4"
                  value="4" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label2 htmlFor="category4">애니메이션</label2>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="5"
                  value="5" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label2 htmlFor="category5">음악</label2>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="6"
                  value="6" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label2 htmlFor="category6">음식</label2>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="7"
                  value="7" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label2 htmlFor="category7">스포츠</label2>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="8"
                  value="8" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label2 htmlFor="category8">기타</label2>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label><br/><br/>항목 및 이미지 업로드</label>
            {images.map((img, index) => (
              <div key={index} className="image-upload-group">
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, index)}
                  required
                />
                <input
                  type="text"
                  placeholder="항목 이름"
                  value={img.title}
                  onChange={(e) => handleImageTitleChange(e, index)}
                  required
                />
                <button type="delete" className="delete-button" onClick={() => deleteImageField(index)}>삭제</button>
              </div>
            ))}
            <button type="button" onClick={addImageField}>
              항목 추가하기
            </button>
          </div>
          <button type="submit">플롯 생성하기</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;
