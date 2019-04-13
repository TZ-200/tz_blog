import UpdateItem from '../components/UpdateItem'

// props.query.id はURLにくっついてるqueryパラメータ
// _app.jsで　return { pageProps }　しているために、その下位のコンポーネントでアクセスできる
// stateless componentではprops.query.idでアクセス
// React componentではthis.props.query.idでアクセス

// 下はDestructureしてる

const Sell = ({ query }) => (
    <div>
      <UpdateItem id={query.id} />
    </div>
  );
  
  export default Sell;