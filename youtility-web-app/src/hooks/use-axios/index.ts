import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import type { Action, CustomConfig, State } from './types';
import { AXIOS_ABORT_ERROR_CODE, getDispatcher, getReducer } from './utils';


axios.defaults.baseURL = process.env.BASE_URL || "http://localhost:8000/api";

/**
 * a custom reusable hook for axios.
 *  Note: always memoize your config object or keep it outside of your component to prevent infinite re-rendering
 * @param {AxiosRequestConfig<T>} config Axios Request Config.
 * @param {boolean} autoCancel if true, it will cancel the network request before component unmount
 * @returns {[State<T>, Action]}
 */
const useAxios = <T = unknown>(
  requestConfig: AxiosRequestConfig<T>,
  { autoCancel, initialValue, preventRequest }: CustomConfig<T> = {
    autoCancel: false,
  }
): [State<T>, Action] => {
  const [state, dispatch] = useReducer(getReducer<T>(), {
    loading: false,
    data: initialValue,
  });
  const abortControllerRef = useRef<AbortController>();

  const { setLoading, setData, setError } = useMemo(
    () => getDispatcher(dispatch),
    [],
  );
  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    let ignore = false;
    abortControllerRef.current = new AbortController();

    const performRequest = async () => {
      try {
        setLoading(true);
        const response = await axios.request({
          ...requestConfig,
          method: requestConfig.method || 'get',
          signal: abortControllerRef.current?.signal,
        });
        if (!ignore && response) {
          setData(response.data);
        }
      } catch (error) {
        if (!ignore && (error as AxiosError).code !== AXIOS_ABORT_ERROR_CODE) {
          setError(error as any);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    if (preventRequest) {
      preventRequest() && performRequest();
    } else {
      performRequest();
    }


    return () => {
      ignore = true;
      if (autoCancel) {
        cancelRequest();
      }
    };
  }, [autoCancel, cancelRequest, requestConfig, setData, setError, setLoading, preventRequest]);

  return [state, { cancelRequest }];
};
export default useAxios;
