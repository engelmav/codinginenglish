import getContent from "./cms";

export async function getStaticProps(params) {
  console.log("getStaticProps params", params)
  let locale = params?.locale;
  if (locale === null || locale === undefined){
    locale = "en"
  }
  const headerContent = await getContent(locale, "header");
  const footerContent = await getContent(locale, "footer");
  return {
    props: {
      headerContent,
      footerContent
    },
  };
}
