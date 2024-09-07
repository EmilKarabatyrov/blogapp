import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Alert } from 'antd';

import { setLogin } from '../../../redux/slices/identificationSlice';
import { setUser } from '../../../redux/slices/loginedUserSlice';
import userApi from '../../../redux/query/userApi';

import cl from './SignIn.module.scss';

function SignIn() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginUser, { data, isSuccess, isError }] = userApi.useLoginUserMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.user?.token) {
      sessionStorage.setItem('token', data?.user?.token);
    }
    if (data?.user) {
      dispatch(setUser(data.user));
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setLogin(true));
      navigate('/articles');
    }
  }, [isSuccess]);

  return (
    <div className={cl.container}>
      <h2 className={cl.title}>Sign In</h2>
      <form
        action="#"
        className={cl.form}
        onSubmit={handleSubmit((user) => {
          loginUser({ user });
        })}
      >
        <label htmlFor="email">Email address</label>
        <input
          type="text"
          id="email"
          placeholder="Email address"
          {...register('email', {
            required: 'Please fill in this field',
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Invalid email address',
            },
          })}
        />
        <p>{errors.email?.message}</p>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          {...register('password', {
            required: 'Please fill in this field',
          })}
        />
        <p>{errors.password?.message}</p>
        <div className={cl.createContainer}>
          <button type="submit" className={cl.create}>
            Login
          </button>
        </div>
      </form>

      <div className={cl.signUp}>
        <span>
          Don’t have an account? 
          {' '}
          <Link to="/sign-up">Sign Up</Link>
          .
        </span>
      </div>
      {isError && (
        <div className={cl.alert}>
          <Alert
            message="Incorrect data"
            description="Check if you entered your email or password correctly."
            type="error"
            closable
            showIcon
          />
        </div>
      )}
    </div>
  );
}

export default SignIn;
