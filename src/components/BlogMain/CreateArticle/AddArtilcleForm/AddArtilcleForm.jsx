import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import uniqueId from 'lodash/uniqueId';

import articlesActionsApi from '../../../../redux/query/articlesActionsApi';

import cl from './AddArtilcleForm.module.scss';

function AddArtilcleForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [createArticle, { data: article, isSuccess, isLoading }] = articlesActionsApi.useCreateArticleMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(`/articles/${article?.article?.slug}`);
    }
  }, [isSuccess]);

  const [tags, setTags] = useState([{ id: uniqueId(), value: '' }]);

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
    <form
      className={cl.form}
      onSubmit={handleSubmit((data) => {
        const tagValues = tags.map((tag) => tag.value);
        createArticle({ article: { ...data, tagList: tagValues } });
      })}
    >
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        placeholder="Title"
        value={formData.title}
        {...register('title', {
          required: 'Please fill in this field',
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
          required: 'Please fill in this field',
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
          required: 'Please fill in this field',
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
      <button type="submit" className={cl.send} disabled={isLoading}>Send</button>
    </form>
  );
}

export default AddArtilcleForm;
