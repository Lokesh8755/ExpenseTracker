import Home from './HomePage/Home';
import {SnackbarProvider} from 'notistack';

const App = () => {
  return (
    <SnackbarProvider>
      <div>
      <Home/>
      </div>
    </SnackbarProvider>

  )
}

export default App
