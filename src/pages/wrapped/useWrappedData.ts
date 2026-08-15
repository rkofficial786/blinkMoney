import { useCallback, useEffect, useState } from 'react';
import { fetchWrappedData } from '../../data/mockWrapped';
import { WrappedData, WrappedScenario } from '../../types/wrapped';

type Status = 'loading' | 'error' | 'success';

type State = {
  status: Status;
  data: WrappedData | null;
  error: string | null;
};

export function useWrappedData(scenario: WrappedScenario) {
  const [state, setState] = useState<State>({ status: 'loading', data: null, error: null });

  const load = useCallback(() => {
    setState({ status: 'loading', data: null, error: null });
    fetchWrappedData(scenario)
      .then(data => setState({ status: 'success', data, error: null }))
      .catch((err: Error) => setState({ status: 'error', data: null, error: err.message }));
  }, [scenario]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, retry: load };
}
