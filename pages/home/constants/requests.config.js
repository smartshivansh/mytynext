const config = {
  headers: {
    "x-auth-token": localStorage.getItem("token"),
  },
};

const formConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
    "x-auth-token": localStorage.getItem("token"),
  },
};

const formProgressConfig = (progress) => ({
  headers: {
    "Content-Type": "multipart/form-data",
    "x-auth-token": localStorage.getItem("token"),
  },
  onUploadProgress: progress,
});

export { config, formConfig, formProgressConfig };
