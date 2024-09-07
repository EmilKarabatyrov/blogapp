import React, { useEffect } from 'react';
import './BlogHeader.scss';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { selectUnLoginedUser, setLogin } from '../../redux/slices/identificationSlice';
import { removeUser, selectLoginedUser, setUser } from '../../redux/slices/loginedUserSlice';
import userApi from '../../redux/query/userApi';

import img from './images/smiley-cyrus.jpg';

function BlogHeader() {
  const { login } = useSelector(selectUnLoginedUser);
  const { username, image } = useSelector(selectLoginedUser);
  const dispatch = useDispatch();
  const { data } = userApi.useGetUserQuery();

  useEffect(() => {
    if (data?.user) {
      dispatch(setLogin(true));
      dispatch(setUser(data.user));
    }
  }, [data, dispatch]);

  const logOut = () => {
    dispatch(setLogin(false));
    dispatch(removeUser());
  };

  return (
    <header className="blog-header">
      <div className="blog-header__container">
        <Link
          style={{ textDecoration: 'none' }}
          to="/"
          className="blog-header__title-link"
        >
          <div className="blog-header__title">Realworld Blog</div>
        </Link>
        {login ? (
          <div className="blog-header__authorized authorized">
            <Link to="/new-article">
              <button type="button" className="authorized__create">Create article</button>
            </Link>
            <Link to="/profile" className="authorized__profile">
              <span>{username}</span>
              <img src={image || img} alt="User" />
            </Link>
            <Link to="/sign-in">
              <button type="button" onClick={logOut} className="authorized__log-out">
                Log Out
              </button>
            </Link>
          </div>
        ) : (
          <div className="blog-header__unauthorized unauthorized">
            <Link to="/sign-in">
              <button type="button" className="unauthorized__sign-in">Sign In</button>
            </Link>
            <Link to="/sign-up">
              <button type="button" className="unauthorized__sign-up">Sign Up</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default BlogHeader;
