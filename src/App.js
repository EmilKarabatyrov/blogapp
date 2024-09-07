import style from './App.module.scss';
import BlogHeader from './components/BlogHeader/BlogHeader';
import BlogMain from './components/BlogMain/BlogMain';

function App() {
  return (
    <div className={style.blog}>
      <BlogHeader />
      <BlogMain />
    </div>
  );
}

export default App;
