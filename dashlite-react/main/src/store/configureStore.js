import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash.throttle';
import { createReducer } from './reducers';
import { loadDocumentCookieState, saveDocumentCookieState } from './cookieHandle';

// const persistedState = loadState();

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const store = configureStore({
    reducer: createReducer(),
    middleware: [
      ...getDefaultMiddleware({
        serializableCheck: {
          // Ignore these field paths in all actions
          ignoredActionPaths: ['payload.callback'],
        },
      }),
      ...middlewares,
    ],
    devTools:
      /* istanbul ignore next line */
      process.env.NODE_ENV !== 'production' || process.env.PUBLIC_URL.length > 0,
    enhancers,
    // preloadedState: persistedState
  });

  store.subscribe(
    throttle(() => {
      const persistedStateCache = loadState() || {};
      const persistedSessionData = persistedStateCache?.session?.data;
      const currentStore = store.getState() || {};
      const { session, theme, device } = currentStore;
      const storeAuth = session?.data.auth;
      const loadData = (key) => ({
        data: { ...(currentStore[key] ? currentStore[key]?.data : persistedStateCache[key]?.data) },
      });
      const sharedCookie = loadDocumentCookieState();
      const cookieAuth = sharedCookie?.auth;
      let sessionCache = {};
      if (!persistedSessionData?.auth?.rememberMe) {
        if (storeAuth && Object.keys(storeAuth || {}).length > 0) {
          if (!storeAuth.isLogout) {
            sessionCache = {
              auth: {
                ...storeAuth,
              },
            };
          } else {
            sessionCache = {
              auth: {},
            };
          }
        } else {
          // handle refresh not clear and restore
          sessionCache = {
            auth: {
              ...cookieAuth,
            },
          };
        }
      } else {
        sessionCache = {
          auth: {},
        };
      }

      // saveSessionStorage(sessionCache);
      saveDocumentCookieState(sessionCache);

      saveState({
        checkout: loadData('checkout'),
        product: loadData('product'),
        user: loadData('user'),
        theme: {
          ...theme,
        },
        // order: loadData('order'),
        session: {
          data: {
            ...(session
              ? {
                  ...session.data,
                  auth: {
                    ...(storeAuth?.rememberMe ? storeAuth : {}),
                  },
                }
              : persistedSessionData),
          },
        },
        config: loadData('config'),
        device: {
          ...device,
        },
      });
    }, 1000)
  );

  return store;
}
