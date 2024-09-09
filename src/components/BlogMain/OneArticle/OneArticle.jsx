import React, { useEffect, useState } from 'react';
import { HeartOutlined, ExclamationCircleFilled, HeartFilled } from '@ant-design/icons';
import Markdown from 'react-markdown';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Alert, Flex, Modal, Spin } from 'antd';
import { useSelector } from 'react-redux';

import articlesActionsApi from '../../../redux/query/articlesActionsApi';
import articlesApi from '../../../redux/query/articlesApi';
import { selectLoginedUser } from '../../../redux/slices/loginedUserSlice';

import cl from './OneArticle.module.scss';
import img from './images/smiley-cyrus.jpg';
import markdown from './markdown';

function OneArticle() {
  const { slug: slugArticle } = useParams();
  const navigate = useNavigate();
  const { confirm } = Modal;
  const [error, setError] = useState(null);

  const [getOneArticle, { data: article, isLoading }] = articlesApi.useLazyGetOneArticleQuery();

  const [deleteArticle, { isSuccess }] = articlesActionsApi.useDeleteArticleMutation();
  const { username } = useSelector(selectLoginedUser);
  const [favorited, setFavorited] = useState(article?.article.favorited);
  const [favoritesCount, setFavoritesCount] = useState(article?.article.favoritesCount);

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure to delete this article?',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteArticle(slugArticle);
      },
    });
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    fetch(`https://blog.kata.academy/api/articles/${article?.article.slug}`, {
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
    if (!token) return;
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

  useEffect(() => {
    getOneArticle(slugArticle).catch((err) => setError(err.message));
    console.log(article)
    if (isSuccess) {
      navigate('/articles');
    }
  }, [article, isSuccess]);

  return (
    <>
      {error && (
        <Alert message="Error" description={error} type="error" showIcon />
      )}
      {isLoading ? (
        <div className={cl.spin}>
          <Flex align="center" justify="center">
            <Spin size="large" loading={isLoading} />
          </Flex>
        </div>
      ) : (
        <div className={cl.article}>
          <div className={cl.top}>
            <div className={cl.title}>
              <h1 className={cl.text}>
                {article?.article.title.length > 50
                  ? `${article?.article.title.substring(0, 50)}...`
                  : article?.article.title}
              </h1>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
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
              <p className={cl.count}>{favoritesCount}</p>
            </div>
            <div className={cl.person}>
              <div className={cl.info}>
                <h2 className={cl.name}>{article?.article.author.username}</h2>
                <h2 className={cl.date}>
                  {article?.article.createdAt
                    ? format(article?.article.createdAt, 'PP')
                    : 'Нет даты'}
                </h2>
              </div>
              <img
                className={cl.image}
                src={
                  article?.article.author.image
                    ? article?.article.author.image
                    : img
                }
                alt=""
              />
            </div>
          </div>
          <div className={cl.bottom}>
            <div className={cl.tags}>
              {article?.article.tagList.length !== 0 ? (
                article?.article.tagList
                  .slice(0, 5)
                  .map((tag) => <span key={article?.article.slug}>{tag}</span>)
              ) : (
                <div className={cl.notags}>Not found tags</div>
              )}
            </div>
            <div className={cl.text}>{article?.article.body}</div>
            {username === article?.article.author.username ? (
              <div className={cl.changers}>
                <button
                  type="button"
                  className={cl.delete}
                  onClick={showDeleteConfirm}
                >
                  Delete
                </button>
                <Link to={`/articles/${article?.article.slug}/edit`}>
                  <button type="button" className={cl.edit}>
                    Edit
                  </button>
                </Link>
              </div>
            ) : null}
          </div>
          <Markdown>{markdown}</Markdown>
        </div>
      )}
    </>
  );
}

export default OneArticle;
