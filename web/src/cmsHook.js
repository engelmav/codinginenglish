// const [locale, setLocale] = useState(null);
// const [content, setContent] = useState({
//   joinGlobal: { title: "", blurbContent: "" },
// });
// console.log("initial content value:", content);
// useEffect(() => {
//   async function init() {
//     const lang = navigator.language;
//     const _locale = langToStrapiLocale(lang);
//     alert(`using locale ${locale}`);
//     setLocale(_locale);
//     const resp = await fetch(
//       `${settings.cmsUrl}/langing-page-blurbs?blurbname=joinGlobal&_locale=ca-es`
//     );
//     const respJson = await resp.json();
//     console.log(JSON.stringify(respJson));
//     const { title, blurbContent } = respJson[0];
//     console.log("got title", title, "and blurbContent", blurbContent);
//     setContent({ joinGlobal: { title, blurbContent } });
//   }
//   // init();
// }, []);

const langToStrapiLocale = (lang) => {
  let normalLang;
  const lcLang = lang.toLowerCase();
  if (lcLang.includes("-")) {
    normalLang = lcLang.split("-")[0];
  } else {
    normalLang = lcLang;
  }
  if (normalLang === "ca") {
    return "ca-es";
  } else if (normalLang === "en") {
    return normalLang;
  } else if (normalLang === "es") {
    return normalLang;
  } else {
    alert(`normalLang ${normalLang} not supported`);
  }
};
export { langToStrapiLocale };
