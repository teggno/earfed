// export const corsProxyUrl = "https://cors-anywhere.herokuapp.com";
export const corsProxyUrl = "";
const showImageUrlThumbPrefix =
  "https://res.cloudinary.com/adwise-ch/image/fetch/t_show_thumb";
const showImageUrlMediumPrefix =
  "https://res.cloudinary.com/adwise-ch/image/fetch/t_show_medium";

export function showImageUrlThumb(showImageUrl) {
  return `${showImageUrlThumbPrefix}/${encodeURIComponent(showImageUrl)}`;
}

export function showImageUrlMedium(showImageUrl) {
  return `${showImageUrlMediumPrefix}/${encodeURIComponent(showImageUrl)}`;
}
