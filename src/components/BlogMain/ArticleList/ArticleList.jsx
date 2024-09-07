import React, { useEffect } from 'react';
import { Pagination, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { selectArticles, setArticles, setOffset } from '../../../redux/slices/articlesSlice';
import articlesApi from '../../../redux/query/articlesApi';
import userApi from '../../../redux/query/userApi';
import ArticleItem from '../ArticleItem/ArticleItem';

import style from './ArticleList.module.scss';

function ArticleList() {
  const { articles = [], offset } = useSelector(selectArticles);
  const [getUser] = userApi.useLazyGetUserQuery();
  const [getArticles, { data = [], isLoading, error }] = articlesApi.useLazyGetArticlesQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    getArticles({ offset: offset - 1, limit: 5 });
  }, [offset, getArticles]);

  useEffect(() => {
    if (data.articles) {
      dispatch(setArticles(data.articles));
    }
  }, [data, dispatch]);

  const handlePageChange = (page) => {
    dispatch(setOffset(page));
  };

  return (
    <div className={style.articleList}>
      {isLoading && (
        <div className={style.spin}>
          <p>Loading...</p>
          <Spin size="large" />
        </div>
      )}
      {error && (
        <Alert
          message="Something went wrong"
          description="Sorry, there was an error here"
          type="error"
          showIcon
        />
      )}
      {articles.map((article) => (
        <ArticleItem key={article.slug} article={article} />
      ))}
      <Pagination
        align="center"
        defaultCurrent={1}
        total={data.articlesCount}
        showSizeChanger={false}
        pageSize={5}
        onChange={handlePageChange}
      />
    </div>
  );
}

export default ArticleList;
