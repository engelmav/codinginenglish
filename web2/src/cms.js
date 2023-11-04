const getContent = async (locale, page, params = "") => {
  const url = `https://content.codinginenglish.com/${page}?_locale=${locale}${params}`;
  const res = await fetch(url);
  const content = await res.json();
  return content;
};

export default getContent;
