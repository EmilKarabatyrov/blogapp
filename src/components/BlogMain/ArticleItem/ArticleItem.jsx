import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Alert } from 'antd';

import style from '../ArticleList/ArticleList.module.scss';

import img from './images/smiley-cyrus.jpg';

function ArticleItem({ article }) {
  const [favorited, setFavorited] = useState(article.favorited);
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    fetch(`https://blog.kata.academy/api/articles/${article.slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFavorited(data.article.favorited);
        setFavoritesCount(data.article.favoritesCount);
      })
      .catch(() => {
        setError('sorry, we can\'t display the articles at the moment');
      });
  }, [article.slug]);

  function onFavorite(slug) {
    const token = sessionStorage.getItem('token');
    fetch(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not okay');
        }
        return response.json();
      })
      .then((data) => {
        setFavorited(true);
        setFavoritesCount(data.article.favoritesCount);
      })
      .catch(() => {
        setError('sorry, we can\'t display the articles at the moment');
      });
  }

  function onNoFavorite(slug) {
    const token = sessionStorage.getItem('token');
    fetch(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not okay');
        }
        return response.json();
      })
      .then((data) => {
        setFavorited(false);
        setFavoritesCount(data.article.favoritesCount);
      })
      .catch(() => {
        setError('sorry, we can\'t display the articles at the moment');
      });
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
        <div className={style.text}>{article.description}</div>
      </div>
    </div>
  );
}

export default ArticleItem;
