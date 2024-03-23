"use client";

import { Provider } from "react-redux";
import {store} from '../redux/store';

export function Redux({children}) {
    return <Provider store={store}>{children}</Provider>;
}