import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import UserCardSearch from "./UserCardSearch.jsx";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./Loading";
import { searchForUser } from "../redux/actions.js/userAction.js";
import { resetSearchUser } from "../redux/reducer.js/userReducer.js";
const SearchUser = ({ onClose }) => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const { users, loading } = useSelector((state) => state.search);

  useEffect(() => {
    if (search.length > 0) {
      dispatch(searchForUser(search));
    } else {
      dispatch(resetSearchUser());
    }
  }, [search]);
  const handleClickOutside = (e) => {
    if (e.target.id === "modal-background") {
      onClose();
    }
  };
  return (
    <div
      id="modal-background"
      className=" box-border fixed left-0 right-0 top-0 bottom-0 bg-slate-600 bg-opacity-40 z-10"
      onClick={handleClickOutside}
    >
      <div className="w-full  max-w-lg mx-auto mt-10">
        <div className=" bg-white h-12 flex rounded-lg">
          <input
            type="text"
            placeholder="search with name, email.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full outline-none bg-slate-100 px-2 box-border rounded-lg"
          />
          <div className="flex justify-center items-center w-14 h-full bg-slate-300 rounded-r-lg">
            <IoSearchOutline className=" h-9 w-8" />
          </div>
        </div>
        {/* display Search User */}
        <div className="bg-white mt-2 w-full h-full p-4 rounded text-center max-h-[70vh] overflow-auto">
          {/* No User Found */}

          {search.length <= 0 && !loading ? (
            <p>Search or start a new chat</p>
          ) : (
            users?.length === 0 && !loading && <p>No contact found!</p>
          )}
          {loading && (
            <div className=" flex justify-center items-center">
              <Loading />
            </div>
          )}
          {!loading &&
            users?.length !== 0 &&
            users?.map((user, index) => (
              <UserCardSearch
                key={index}
                user={user}
                onClose={onClose}
                search={search}
              />
            ))}
        </div>
      </div>
      <div>
        <button
          onClick={onClose}
          className=" absolute top-5 right-10 p-2 text-2xl lg:text-4xl hover:text-white"
        >
          <IoMdClose />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
