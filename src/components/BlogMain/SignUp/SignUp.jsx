import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'antd';

import { selectUnLoginedUser, setUser } from '../../../redux/slices/identificationSlice';
import userActionsApi from '../../../redux/query/userActionsApi';

import cl from './SignUp.module.scss';

function SignUp() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const { username, email, password } = useSelector(selectUnLoginedUser);
  const [createUser, { isSuccess, error: loginError }] = userActionsApi.useCreateUserMutation();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const handleCreateUser = async () => {
    try {
      await createUser({
        user: {
          username,
          email,
          password,
        },
      }).unwrap();
    } catch (err) {
      setError(err.message);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    if (password && username && email) {
      handleCreateUser();
    }
  }, [password, username, email]);
  useEffect(() => {
    if (isSuccess) {
      navigate('/sign-in');
    }
  }, [isSuccess]);

  return (
    <div className={cl.container}>
      {error && <Alert message="Error" description={error} type="error" showIcon />}
      <h2 className={cl.title}>Create new account</h2>
      <form
        onSubmit={handleSubmit((data) => {
          dispatch(setUser(data));
        })}
        className={cl.form}
      >
        <label htmlFor="name">Username</label>
        <input
          type="text"
          id="name"
          placeholder="Username"
          {...register('username', {
            required: 'Please fill in this field',
            minLength: {
              value: 3,
              message: 'Your username needs to be at least 3 characters.',
            },
            maxLength: {
              value: 20,
              message: 'Your username should be no more than 20 characters long',
            },
          })}
        />
        <p>{errors.username?.message}</p>
        <p>{loginError?.data?.errors.username}</p>
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
        <p>{loginError?.data?.errors.email}</p>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          {...register('password', {
            required: 'Please fill in this field',
            minLength: {
              value: 6,
              message: 'Your password needs to be at least 6 characters.',
            },
            maxLength: {
              value: 40,
              message: 'Your username should be no more than 40 characters long',
            },
          })}
        />
        <p>{errors.password?.message}</p>
        <label htmlFor="repeat password">Repeat Password</label>
        <input
          type="password"
          id="repeat password"
          placeholder="Password"
          {...register('repeatPassword', {
            required: 'Please fill in this field',
            validate: (val) => {
              if (watch('password') !== val) {
                return 'Your passwords do no match';
              }
            },
          })}
        />
        <p>{errors.repeatPassword?.message}</p>
        <hr />
        <div className={cl.agree}>
          <input
            type="checkbox"
            id="agree"
            value={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <label htmlFor="agree">
            I agree to the processing of my personal information
          </label>
        </div>
        <div className={cl.createContainer}>
          <button type="submit" className={cl.create} disabled={!checked}>
            Create
          </button>
        </div>
      </form>
      <div className={cl.signIn}>
        <span>
          Already have an account? 
          {' '}
          <Link to="/sign-in">Sign In</Link>
          .
        </span>
      </div>
    </div>
  );
}

export default SignUp;
