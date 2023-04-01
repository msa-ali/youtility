import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react';
import useAxios from './index';
const abortFn = jest.fn();
// @ts-ignore
global.AbortController = jest.fn(() => ({
  abort: abortFn,
}));
// mock axios
jest.mock('axios');
const mockRequest = jest.fn();
jest.mock('axios', () => {
  return {
    request: () => mockRequest,
  };
});
// const mockedAxios = axios as jest.Mocked<typeof axios>;
const MOCK_CONFIG = {
  url: 'http://dummyurl.com',
};
const response = {
  data: {
    users: [
      { id: 1, name: 'John Smith' },
      { id: 2, name: 'Ram Kumar' },
    ],
  },
  status: 200,
  statusText: 'Ok',
  headers: {},
  config: {},
};
describe('useAxios', () => {
  it('should test successful network call', () => {
    mockRequest.mockResolvedValue(response);
    const renderResult = renderHook(() => useAxios(MOCK_CONFIG));
    waitFor(() =>
      expect(renderResult.result.current[0]).toEqual({
        loading: false,
        error: null,
        data: response.data,
      }),
    );
  });
  it('should test failed network call', () => {
    const error = new Error('Something went wrong');
    mockRequest.mockRejectedValue(error);
    const renderResult = renderHook(() => useAxios(MOCK_CONFIG));
    waitFor(() =>
      expect(renderResult.result.current[0]).toEqual({
        loading: false,
        error,
        data: null,
      }),
    );
  });
  it('should abort netork call when component unmount', () => {
    mockRequest.mockResolvedValue(response);
    const renderResult = renderHook(() => useAxios(MOCK_CONFIG));
    renderResult.unmount();
    waitFor(() => expect(abortFn).toBeCalledTimes(1));
  });
  it('should not abort newtork call when component unmount when autoCancel is false', () => {
    abortFn.mockClear();
    mockRequest.mockResolvedValue(response);
    const renderResult = renderHook(() => useAxios(MOCK_CONFIG, false));
    renderResult.unmount();
    waitFor(() => expect(abortFn).not.toHaveBeenCalled());
  });
  it('should abort newtork call when user calls cancelRequest method', () => {
    abortFn.mockClear();
    mockRequest.mockResolvedValue(response);
    const renderResult = renderHook(() => useAxios(MOCK_CONFIG, false));
    renderResult.result.current[1].cancelRequest();
    waitFor(() => expect(abortFn).toBeCalledTimes(1));
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
