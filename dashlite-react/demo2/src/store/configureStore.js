import { configureStore } from "@reduxjs/toolkit";
import { createInjectorsEnhancer } from "redux-injectors";
import createSagaMiddleware from "redux-saga";
import throttle from "lodash.throttle";
import { loadState, saveState } from "./localStorage";
import { createReducer } from "./reducers";

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
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        serializableCheck: {
          // Ignore these field paths in all actions
          ignoredActionPaths: ["payload.callback", "payload.file", "payload.formData"],
        },
      }),
      ...middlewares,
    ],
    /* istanbul ignore next line */
    devTools:
      process.env.NODE_ENV !== "production" || (process.env.PUBLIC_URL || "").length > 0
        ? {
            shouldHotReload: false,
          }
        : false,
    enhancers,
    // preloadedState: persistedState
  });

  store.subscribe(
    throttle(() => {
      const persistedStateCache = loadState();
      const state = store.getState();

      saveState({
        system: {
          data: {
            cache: {
              ...(state.system && state.system?.data && state.system?.data?.cache
                ? state.system.data.cache
                : persistedStateCache?.system?.data?.cache),
            },
          },
        },
        qrScan: {
          data: {
            ...(state.qrScan && state.qrScan?.data ? state.qrScan.data : persistedStateCache?.qrScan?.data),
          },
        },
        profile: {
          data: {
            ...(state.profile && state.profile?.data ? state.profile.data : persistedStateCache?.profile?.data),
          },
        },
      });
    }, 1000)
  );

  return store;
}
