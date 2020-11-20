// export const corsProxyUrl = "https://cors-anywhere.herokuapp.com";
export const corsProxyUrl = "";
const showImageThumbPrefixUrl =
  "https://res.cloudinary.com/adwise-ch/image/fetch/t_show_thumb";

export function showImageThumbUrl(showImageUrl) {
  return `${showImageThumbPrefixUrl}/${encodeURIComponent(showImageUrl)}`;
  //   return showImageUrl;
}
