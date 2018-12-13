import { ModuleSocket as ModuleSocketClass } from "./websockets";
import { sleep as sleepFunc } from "./time";
import {
  needLoading as needLoadingFunc,
  doneLoading as doneLoadingFunc
} from "@/utils/loading";

export const ModuleSocket = ModuleSocketClass;
export const sleep = sleepFunc;
export const needLoading = needLoadingFunc;
export const doneLoading = doneLoadingFunc;
