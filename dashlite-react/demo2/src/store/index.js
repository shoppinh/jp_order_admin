import { createWrapper } from "next-redux-wrapper";
import { configureAppStore } from "./configureStore";

export const store = configureAppStore();

const makeStore = () => store;

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== "production",
  serializeState: (state) => JSON.stringify(state),
  deserializeState: (state) => JSON.parse(state),
});
