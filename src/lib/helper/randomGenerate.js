export const getRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  let bgColor = "#" + randomColor;
  localStorage.setItem("bgColor", JSON.stringify(bgColor));
  return bgColor;
};

export const getFirstLetters = (name) => {
  const nameArray = name?.split(" ") || [];
  let newImage;
  if (nameArray?.length >= 2) {
    newImage = nameArray[0].charAt(0) + nameArray[1].charAt(0);
  } else newImage = nameArray[0]?.slice(0, 2);
  return newImage;
};

export const getNoProfileImageBackground = () => {
  let bgColor = JSON.parse(localStorage.getItem("bgColor"));
  if (!bgColor) {
    bgColor = getRandomColor();
  }
  return bgColor;
};

export const getCreatedTime = (time) => {
  let createdDate = new Date(time).toDateString();
  createdDate = createdDate.split(" ");
  let date = createdDate[1] + " " + createdDate[2] + ", " + createdDate[3];
  return date;
};
