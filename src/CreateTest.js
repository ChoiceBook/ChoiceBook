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
            item_image_url: `http://172.10.7.117/uploads/${imageResult.file.path}`,
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
                  id="1"
                  value="1" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label htmlFor="category1">드라마</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="2"
                  value="2" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label htmlFor="category2">영화</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="3"
                  value="3" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label htmlFor="category3">게임</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="4"
                  value="4" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label htmlFor="category4">애니메이션</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="5"
                  value="5" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label htmlFor="category5">음악</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="6"
                  value="6" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label htmlFor="category6">음식</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="7"
                  value="7" // ID 값으로 설정
                  onChange={handleCategoryChange}
                />
                <label htmlFor="category7">스포츠</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="8"
                  value="8" // ID 값으로 설정
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
            <button type="button" onClick={addImageField}>
              Add Another Image
            </button>
          </div>
          <button type="submit">Create Test</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;
