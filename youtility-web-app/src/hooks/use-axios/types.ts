import { AxiosError } from 'axios';
import { Dispatch } from 'react';

export type State<T> = {
  loading: boolean;
  data?: T;
  error?: AxiosError | null;
};

export enum ReducerActionType {
  LOADING,
  DATA,
  ERROR,
}

export type Action = {
  cancelRequest: () => void;
};

export type ReducerAction<T> = {
  type: ReducerActionType;
  payload: Partial<State<T>>;
};

export type Dispatcher<T> = Dispatch<ReducerAction<T>>;

export type CustomConfig<T> = {
  autoCancel?: boolean;
  initialValue?: T,
  preventRequest?: () => boolean;
}