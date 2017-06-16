import { takeEvery, take, race, put, call } from 'redux-saga/effects';
import { PROMISE_ACTION } from './constants'

const getPayload = (data) => (data && data.payload) || data;

export function* handlePromiseAction(action) {
  const { data, params, defer: { resolve, reject }, reduxFormFallback } = action.payload;

  const [ { success, failure } ] = yield [
    race({
      success: take(params.SUCCESS),
      failure: take(params.FAILURE),
    }),
    put(params.trigger(data)),
  ];

  if (success) {
    if (reduxFormFallback) {
      yield call(resolve);
    } else {
      yield call(resolve, getPayload(success));
    }
  } else {
    yield call(reject, getPayload(failure));
  }
}

export default function* routinesWatcherSaga() {
  yield takeEvery(PROMISE_ACTION, handlePromiseAction);
}
