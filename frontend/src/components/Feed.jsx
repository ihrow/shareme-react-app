import React, {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";

import {client} from "../client.js";
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import {feedQuery, searchQuery} from "../utils/data.js";

const Feed = () => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if(categoryId) {
      const query = searchQuery(categoryId)
      console.log("we are here")
      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
      console.log("we are there")
    } else {
      console.log("we are here 2")
      client.fetch(feedQuery).then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
  }, [categoryId])

  if(loading) return <Spinner message="We are adding new ideas to your feed!" />
  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  );
};

export default Feed;