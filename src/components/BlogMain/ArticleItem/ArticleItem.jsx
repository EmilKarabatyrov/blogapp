import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Alert } from 'antd';

import style from '../ArticleList/ArticleList.module.scss';
import articlesActionsApi from '../../../redux/query/articlesActionsApi';

import img from './images/smiley-cyrus.jpg';

function ArticleItem({ article }) {
  const [favorited, setFavorited] = useState(article.favorited);
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  const [error, setError] = useState(null);
  const [setFavorite] = articlesActionsApi.useFavoriteAnArticleMutation()
  const [setNoFavorite] = articlesActionsApi.useNoFavoriteAnArticleMutation()
  useEffect(() => {
    setFavorited(article.favorited);
    setFavoritesCount(article.favoritesCount);
  }, [article]);

  function onFavorite(slug) {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    setFavorite({ slug })
    setFavorited(true);
    setFavoritesCount((prev) => prev + 1);
  }

  function onNoFavorite(slug) {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    setNoFavorite({ slug })
    setFavorited(false);
    setFavoritesCount((prev) => prev - 1);
  }

  function toggleFavorite() {
    if (!favorited) {
      onFavorite(article.slug);
    } else {
      onNoFavorite(article.slug);
    }
  }

  return (
    <div className={style.article}>
      {error && <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />}
      <div className={style.top}>
        <div className={style.title}>
          <Link className={style.link} to={`/articles/${article.slug}`}>
            <h1 className={style.text}>
              {article.title.length > 30
                ? `${article.title.substring(0, 30)}...`
                : article.title}
            </h1>
          </Link>
          {favorited ? (
            <HeartFilled
              style={{ color: '#FF0707', marginRight: 5 }}
              /* eslint-disable-next-line react/jsx-no-bind */
              onClick={toggleFavorite}
            />
          ) : (
            <HeartOutlined
              style={{ marginRight: 5 }}
              /* eslint-disable-next-line react/jsx-no-bind */
              onClick={toggleFavorite}
            />
          )}
          <p className={style.count}>{favoritesCount}</p>
        </div>
        <div className={style.person}>
          <div className={style.info}>
            <h2 className={style.name}>{article.author.username}</h2>
            <h2 className={style.date}>
              {article.createdAt ? format(article.createdAt, 'PP') : 'Нет даты'}
            </h2>
          </div>
          <img
            className={style.image}
            src={article.author.image ? article.author.image : img}
            alt=""
          />
        </div>
      </div>
      <div className={style.bottom}>
        <div className={style.tags}>
          {article.tagList.length !== 0 ? (
            article.tagList
              .slice(0, 4)
              .map((tag) => <span key={article.slug}>{tag}</span>)
          ) : (
            <div className={style.notags}>Not found tags</div>
          )}
        </div>
        <div className={style.text}>
          {article.description?.length > 100
            ? `${article.description?.substring(0, 101)}...`
            : article.description}
        </div>
      </div>
    </div>
  );
}

export default ArticleItem;
