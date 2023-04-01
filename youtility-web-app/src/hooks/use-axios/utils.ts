import { AxiosError } from 'axios';
import { Dispatcher, ReducerAction, State, ReducerActionType } from './types';

export const AXIOS_ABORT_ERROR_CODE = 'ERR_CANCELED';

export const getReducer =
  <T>() =>
  (state: State<T>, { type, payload }: ReducerAction<T>): State<T> => {
    switch (type) {
      case ReducerActionType.LOADING:
        return {
          ...state,
          loading: !!payload.loading,
        };
      case ReducerActionType.DATA:
        return {
          ...state,
          error: null,
          loading: false,
          data: payload.data,
        };
      case ReducerActionType.ERROR:
        return {
          ...state,
          loading: false,
          error: payload.error,
        };
      default:
        return state;
    }
  };

export const getDispatcher = <T>(dispatch: Dispatcher<T>) => ({
  setLoading: (loading: boolean) =>
    dispatch({
      type: ReducerActionType.LOADING,
      payload: {
        loading,
      },
    }),
  setError: (error: AxiosError) =>
    dispatch({
      type: ReducerActionType.ERROR,
      payload: {
        error,
      },
    }),
  setData: (data: T) =>
    dispatch({
      type: ReducerActionType.DATA,
      payload: {
        data,
      },
    }),
});
