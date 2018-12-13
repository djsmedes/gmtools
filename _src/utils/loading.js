import store from "@/store";

export function needLoading() {
  store.commit("needLoading");
}

export function doneLoading() {
  store.commit("doneLoading");
}
