import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setUser } from '../../../redux/slices/loginedUserSlice';
import userActionsApi from '../../../redux/query/userActionsApi';
import userApi from '../../../redux/query/userApi';

import cl from './EditProfile.module.scss';

function EditProfile() {
  const { data } = userApi.useGetUserQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username, image, password, email } = useSelector(
    (state) => state.loginedUser.user,
  );
  const [changeUser, { isSuccess }] = userActionsApi.useChangeUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: image,
  });

  useEffect(() => {
    if (isSuccess) navigate('/');
    if (data?.user) {
      dispatch(setUser(data.user));
      setFormData({
        username: data.user.username || '',
        email: data.user.email || '',
        password: '',
        avatar: data.user.image || '',
      });
    }
  }, [data, isSuccess, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = (userData) => {
    changeUser({
      user: {
        username: userData.username || username,
        email: userData.email || email,
        password: userData.password || password,
        image: userData.avatar || null,
      },
    });
  };

  return (
    <div className={cl.container}>
      <h2 className={cl.title}>Edit Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={cl.form}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          placeholder="Username"
          {...register('username', {
            required: !formData.username && 'Please fill in this field',
            minLength: {
              value: 3,
              message: 'Your username needs to be at least 3 characters.',
            },
            maxLength: {
              value: 20,
              message:
                'Your username should be no more than 20 characters long',
            },
            onChange: handleChange,
          })}
        />
        <p>{errors.username?.message}</p>

        <label htmlFor="email">Email address</label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          placeholder="Email address"
          {...register('email', {
            required: !formData.email && 'Please fill in this field',
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Invalid email address',
            },
            onChange: handleChange,
          })}
        />
        <p>{errors.email?.message}</p>

        <label htmlFor="password">New password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          placeholder="New password"
          {...register('password', {
            minLength: {
              value: 6,
              message: 'Your password needs to be at least 6 characters.',
            },
            maxLength: {
              value: 40,
              message:
                'Your password should be no more than 40 characters long',
            },
            onChange: handleChange,
          })}
        />
        <p>{errors.password?.message}</p>

        <label htmlFor="avatar">Avatar Image (url)</label>
        <input
          type="url"
          id="avatar"
          name="avatar"
          value={formData.avatar}
          placeholder="Avatar Image"
          {...register('avatar', {
            pattern: {
              value:
                /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
              message: 'Invalid url',
            },
            onChange: handleChange,
          })}
        />
        <p>{errors.avatar?.message}</p>

        <hr />
        <div className={cl.saveContainer}>
          <button type="submit" className={cl.save}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
