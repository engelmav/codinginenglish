const useSanityData = (query) => {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      // Fetch data from Sanity using a GROQ query
      const fetchData = async () => {
        try {
          const query = `*[_type == "your-schema-type"]`; // Replace with your own GROQ query
          const result = await client.fetch(query);
          setData(result);
        } catch (error) {
          console.error('Error fetching data from Sanity:', error);
        }
      };
  
      fetchData();
    }, []);
  
    return data;
  };