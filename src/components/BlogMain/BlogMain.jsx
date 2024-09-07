import React from 'react';
import { Route, Routes } from 'react-router-dom';

import './BlogMain.scss';
import ArticleList from './ArticleList/ArticleList';
import OneArticle from './OneArticle/OneArticle';
import SignUp from './SignUp/SignUp';
import SignIn from './SignIn/SignIn';
import EditProfile from './EditProfile/EditProfile';
import CreateArticle from './CreateArticle/CreateArticle';
import EditArticle from './EditArticle/EditArticle';

function BlogMain() {
  return (
    <main className="blog-main">
      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:slug" element={<OneArticle />} />
        <Route path="/new-article" element={<CreateArticle />} />
        <Route path="/articles/:slug/edit" element={<EditArticle />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile" element={<EditProfile />} />
      </Routes>
    </main>
  );
}

export default BlogMain;
