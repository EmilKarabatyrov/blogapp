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
  const [favorited, setFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [setFavorite] = articlesActionsApi.useFavoriteAnArticleMutation()
  const [setNoFavorite] = articlesActionsApi.useNoFavoriteAnArticleMutation()

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
    getOneArticle(slugArticle).then((response) => {
      if (response.error) {
        setError('sorry, we can\'t display the articles at the moment');
      } else {
        const { data } = response;
        setFavorited(data.article.favorited);
        setFavoritesCount(data.article.favoritesCount);
      }
    }).catch((err) => setError(err.message));
  }, [slugArticle]);

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
      onFavorite(article?.article.slug);
    } else {
      onNoFavorite(article?.article.slug);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      navigate('/articles');
    }
  }, [isSuccess]);

  useEffect(() => {
    getOneArticle(slugArticle).catch((err) => setError(err.message));
    if (isSuccess) {
      navigate('/articles');
    }
  }, [isSuccess]);

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
