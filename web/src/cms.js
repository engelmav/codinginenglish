const getContent = async (locale, page) => {
  const url = `https://content.codinginenglish.com/${page}?_locale=${locale}`;
  const res = await fetch(url);
  const content = await res.json()
  return content;
}


export default getContent;