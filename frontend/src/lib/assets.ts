export const resolveArticleImage = (imagePath: string): string => {
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path starting with /uploads, prepend backend URL
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:5000${imagePath}`;
  }

  // If it's just a filename, assume it's in uploads/articles/
  if (!imagePath.includes('/')) {
    return `http://localhost:5000/uploads/articles/${imagePath}`;
  }

  // Otherwise, prepend backend URL
  return `http://localhost:5000/uploads/${imagePath}`;
};