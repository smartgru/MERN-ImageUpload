import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import ImageList from './components/ImageList';
import './App.scss';

export const rest = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const App = () => {
  const [images, setImages] = useState([]);
  const accept = 'image/*';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: result } = await rest.get('/image');
        const files = result.map((file) => ({
          src: `data:${file.type};base64, ${file.base64}`,
          name: file.name,
          id: file.id,
        }));
        setImages(files);
      } catch (error) {
        console.log('ERROR: ', error);
      }
    };
    fetchData();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      const image = await uploadImage(file);
      images.push(image);
      setImages([...images]);
    });
  });

  const uploadImage = async (file) => {
    const body = new FormData();
    body.append('image', file);
    try {
      const { data } = await rest.post('/image/upload', body);
      return {
        src: `data:${data.type};base64, ${data.base64}`,
        name: data.name,
        id: data.id,
      };
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  const handleRemoveImage = async (event, index, id) => {
    event.preventDefault();
    try {
      const response = await rest.delete(`/image/${id}`);
      if (response.status === 200) {
        images.splice(index, 1);
        setImages([...images]);
      }
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  const handleReorder = async (from, to) => {
    if (from === to) return;
    try {
      const { data: result } = await rest.post('/image/reorder', { from, to });
      const files = result.map((file) => ({
        src: `data:${file.type};base64, ${file.base64}`,
        name: file.name,
        id: file.id,
      }));
      setImages(files);
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept });

  return (
    <div className="container">
      <div className="drop-zone" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <ImageList
        images={images}
        onRemoveImage={handleRemoveImage}
        onReorder={handleReorder}
      />
    </div>
  );
};

export default App;
