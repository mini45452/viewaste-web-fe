import React, { useState } from 'react';

const SimplePage = () => {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to handle loading

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!fileName) return;

    setIsLoading(true); // Set loading to true when the upload starts
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://merdekarecycle.com:37100/hello_app/classify/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setWasteType(data.waste_type);
    } catch (error) {
      console.error('Error uploading image:', error);
      setWasteType('Error');
    } finally {
      setIsLoading(false); // Set loading to false when the fetch is complete
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Waste Classifier</h1>
        <div className="flex justify-center mb-4">
          {image ? (
            <img src={image} alt="Uploaded" className="w-full h-auto max-w-full max-h-96 object-contain" />
          ) : (
            <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No image selected</span>
            </div>
          )}
        </div>
        <div className="flex justify-center mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="upload"
          />
          <label
            htmlFor="upload"
            className="py-2 px-4 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none cursor-pointer"
          >
            Upload Image
          </label>
        </div>
        <div className="flex justify-center mb-4">
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="py-2 px-4 text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none cursor-pointer"
          >
            {isLoading ? 'Classifying...' : 'Classify Waste'}
          </button>
        </div>
        <p className="text-center text-gray-700">Filename: {fileName}</p>
        <p className="text-center text-gray-700">Waste type: {wasteType}</p>
      </div>
    </div>
  );
};

export default SimplePage;
