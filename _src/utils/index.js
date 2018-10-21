import { ModuleSocket as ModuleSocketClass } from "./websockets";
import { sleep as sleepFunc } from "./time";

export const ModuleSocket = ModuleSocketClass;
export const sleep = sleepFunc;
