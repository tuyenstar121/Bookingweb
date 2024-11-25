export const uploadToCloudinary = async (image) => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "instagram");
      data.append("cloud_name", "dpbwm7j8i");
  
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpbwm7j8i/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const fileData = await res.json();
      return fileData.url;
    }
  };
  