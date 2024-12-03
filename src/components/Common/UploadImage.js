import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadToCloudinary } from '../../config/UploadToCloudinary';
import { useState } from 'react';
import { useEffect } from 'react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function UploadImage({ onChange, defaultImage }) {
  const [urlImg, setUrlImg] = useState(defaultImage)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (urlImg) {
      onChange(urlImg)
    }
  }, [urlImg])

  const handleChooseImage = async (event) => {
    try {
      setIsLoading(true)
      const res = await uploadToCloudinary(event.target.files[0])
      setUrlImg(res)
      setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Button
        disabled={isLoading}
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ my: 2 }}
      >
        {urlImg ? 'Sửa hình ảnh' : 'Thêm hình ảnh'}
        <VisuallyHiddenInput
          type="file"
          onChange={handleChooseImage}
          multiple
        />
      </Button>

      {
        urlImg && <img alt={urlImg} src={urlImg} width={'100%'} />
      }
    </>
  );
}
