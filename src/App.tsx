import { GoogleOAuthProvider } from '@react-oauth/google';
import Todo from './components/Todo';

const App = () => {
  return (
    <div className='bg-stone-900 grid py-4 min-h-screen'>
      <GoogleOAuthProvider clientId="823184677324-l406j76unaqa8qgrqr86pgkv8sr3euef.apps.googleusercontent.com">
        <Todo />
      </GoogleOAuthProvider>
    </div>
  )
}

export default App;