// import axios from 'axios';

let API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL);
//folder, productId
export const createImage = async (file, folderName, productId) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folderName', folderName);
  formData.append('productID', productId);
  try {
    // const response = await axios.post(API_URL, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      // No establezcas manualmente el encabezado "Content-Type" aquí
      body: formData,
    });
    console.log("response uploading image: ", response);
    if (response.data.status) {
      return {
        status: true,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg,
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: error.message,
    };
  }
};
