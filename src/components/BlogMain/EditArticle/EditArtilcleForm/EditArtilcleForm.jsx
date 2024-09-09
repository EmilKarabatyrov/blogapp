import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import uniqueId from 'lodash/uniqueId';
import { Alert } from 'antd';
import { useSelector } from 'react-redux';

import articlesApi from '../../../../redux/query/articlesApi';
import { selectLoginValue } from '../../../../redux/slices/identificationSlice';

import cl from './EditArtilcleForm.module.scss';

function EditArtilcleForm() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { login } = useSelector(selectLoginValue)
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
  });
  const [error, setError] = useState(null);

  const { data: article } = articlesApi.useGetOneArticleQuery(slug);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true)
    const tagValues = tags.map((tag) => tag.value);
    const articleData = {
      title: data.title ? data.title : article?.article.title,
      body: data.body ? data.body : article?.article.body,
      description: data.description
        ? data.description
        : article?.article.description,
      tagList: tagValues,
    };
    const token = sessionStorage.getItem('token');
    fetch(`https://blog.kata.academy/api/articles/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ article: articleData }),
    })
      .then((response) => {
        setLoading(false)
        if (!response.ok) {
          throw new Error('Network response was not okay');
        }
        navigate('/');
      })
      .catch(() => {
        setError('An error occurred while updating the article. Please try again.')
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!login) {
      navigate(`/articles/${slug}`);
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      title: article?.article.title,
      body: article?.article.body,
      description: article?.article.description,
    }));
    if (article?.article.tagList) {
      const tagList = article?.article.tagList;
      const arrToObj = tagList.map((item) => ({
        value: item,
      }));
      setTags(arrToObj);
    }
  }, [article, login]);

  const tagChange = (index, event) => {
    const newTagFields = [...tags];
    newTagFields[index].value = event.target.value;
    setTags(newTagFields);
  };
  const deleteTag = (id) => {
    setTags(tags.filter((item) => item.id !== id));
  };
  const addTag = () => {
    setTags([...tags, { id: uniqueId(), value: '' }]);
  };

  return (
    <form className={cl.form} onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert message={error} type="error" showIcon />}
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        placeholder="Title"
        value={formData.title}
        {...register('title', {
          required: !formData.title ? 'Please fill in this field' : '',
          onChange: handleChange,
        })}
      />
      <p>{errors?.title?.message}</p>
      <label htmlFor="short-title">Short description</label>
      <input
        type="text"
        id="short-title"
        placeholder="Title"
        value={formData.description}
        {...register('description', {
          required: !formData.description ? 'Please fill in this field' : '',
          onChange: handleChange,
        })}
      />
      <p>{errors?.description?.message}</p>
      <label htmlFor="text">Text</label>
      <textarea
        name=""
        id="text"
        placeholder="Text"
        value={formData.body}
        {...register('body', {
          required: !formData.body ? 'Please fill in this field' : '',
          onChange: handleChange,
        })}
      />
      <p>{errors?.body?.message}</p>
      <label htmlFor="tags">Tags</label>
      <div className={cl.tags}>
        <div className={cl.tagInputs}>
          {tags.map((tag, index) => (
            <div>
              <input
                type="text"
                className={cl.edit}
                placeholder="Tag"
                value={tag.value}
                onChange={(e) => tagChange(index, e)}
              />
              <button
                type="button"
                onClick={() => deleteTag(tag.id)}
                className={cl.delete}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addTag} className={cl.add}>
          Add tag
        </button>
      </div>
      <button type="submit" className={cl.send} disabled={loading}>
        Send
      </button>
    </form>
  );
}

export default EditArtilcleForm;
