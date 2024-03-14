import Cookies from 'js-cookie';
export const imagePreview = (file) => {
  if (!file) return;
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      resolve(event.target.result);
    };
  });
};

export const prepareImageUrl = (imageUrl) => {
  const stripBackSlash = String(imageUrl).replace(/\\/g, '/');
  const url = String(stripBackSlash).replace('public/', '');
  return `${process.env.API_BASE_URL}/${url}`;
};

export const isAuthorized = (roles: string[]) => {
  const role = 'Patient';
  return roles.includes(role);
};
