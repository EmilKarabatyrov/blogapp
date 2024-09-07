import React from 'react';

import AddArtilcleForm from './AddArtilcleForm/AddArtilcleForm';
import cl from './CreateArticle.module.scss';

function CreateArticle() {
  return (
    <div className={cl.container}>
      <h2 className={cl.title}>Create new article</h2>
      <AddArtilcleForm />
    </div>
  );
}

export default CreateArticle;
