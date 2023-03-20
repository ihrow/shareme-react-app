import React, {useState, useEffect} from 'react';
import MasonryLayout from "./MasonryLayout.jsx";
import {client} from "../client.js";
import {feedQuery, searchQuery} from "../utils/data.js";
import Spinner from "./Spinner";


const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(searchTerm) {
      setLoading(true)
      const query = searchQuery(searchTerm)
      client.fetch(query)
        .then((data) => {
          setPins(data)
        })
        .finally(() => setLoading(false))
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message="Searching for pins" />}
      {pins && pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading
        && <div className="mt-10 text-center text-xl">No pins found for {searchTerm}</div>
        }
    </div>
  );
};

export default Search;