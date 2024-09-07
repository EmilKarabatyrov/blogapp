import React from 'react';

import cl from '../CreateArticle/CreateArticle.module.scss';

import EditArtilcleForm from './EditArtilcleForm/EditArtilcleForm';

function EditArticle() {
  return (
    <div className={cl.container}>
      <h2 className={cl.title}>Edit article</h2>
      <EditArtilcleForm />
    </div>
  );
}

export default EditArticle;
