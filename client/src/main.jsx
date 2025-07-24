import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import store from './redux/store.js'
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import ErrorBoundary from './pages/crash/Crash.jsx';

store.subscribe(async () => {
  const state = await store.getState();
  await localStorage.setItem('user', JSON.stringify(state.auth));
})


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        {/* main route end */}
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>,
)
