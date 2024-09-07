import React, { useEffect, useState } from 'react';
import { HeartOutlined, ExclamationCircleFilled } from '@ant-design/icons';
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
  const { slug } = useParams();
  const navigate = useNavigate();
  const { confirm } = Modal;
  const [error, setError] = useState(null);

  const [getOneArticle, { data: article, isLoading }] = articlesApi.useLazyGetOneArticleQuery();

  const [deleteArticle, { isSuccess }] = articlesActionsApi.useDeleteArticleMutation();
  const { username } = useSelector(selectLoginedUser);

  const [likesCount, setLikesCount] = useState(0);

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure to delete this article?',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteArticle(slug);
      },
    });
  };

  useEffect(() => {
    if (article) {
      setLikesCount(article.article.favoritesCount);
    }
  }, [article]);

  useEffect(() => {
    getOneArticle(slug).catch((err) => setError(err.message));
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
              <div className={cl.like}>
                <HeartOutlined />
              </div>
              <p className={cl.count}>{likesCount}</p>
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
