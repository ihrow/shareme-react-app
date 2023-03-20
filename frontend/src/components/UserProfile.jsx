import React, {useState, useEffect} from 'react';
import {AiOutlineLogout} from "react-icons/ai";
import {useParams, useNavigate} from "react-router-dom";
import {googleLogout} from "@react-oauth/google";

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from "./MasonryLayout.jsx";
import Spinner from "./Spinner.jsx";

const randomImage = `https://source.unsplash.com/random/?nature,water,photography,technology`;

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'
const inactiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'


const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();


  useEffect(() => {
    const query = userQuery(userId);

    client
      .fetch(query)
      .then((res) => {
        setUser(res[0]);
      })
  }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      const query = userCreatedPinsQuery(userId);

      client
        .fetch(query)
        .then((res) => {
          setPins(res);
        })
    } else if (text === 'Saved') {
      const query = userSavedPinsQuery(userId);

      client
        .fetch(query)
        .then((res) => {
          setPins(res);
        })
    }

  }, [text, userId]);



  if (!user) return <Spinner message="Loading user profile..." />;
  return (
    <div className="relative bp-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner-picture"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="profile-picture"
            />
            <h1 className="font-bold dash-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg"
                  onClick={() => {
                    googleLogout();
                    localStorage.removeItem('user');
                    navigate('/login');
                  }}
                >
                  <AiOutlineLogout fontSize={21} color="red" />
                </button>
                )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('created');
              }}
              className={`${activeBtn === 'created' ? activeBtnStyles : inactiveBtnStyles}`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('saved');
              }}
              className={`${activeBtn === 'saved' ? activeBtnStyles : inactiveBtnStyles}`}
            >
              Saved
            </button>
          </div>
          {pins?.length > 0 ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No pins found :(
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;