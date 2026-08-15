import { useCallback, useEffect, useState } from 'react';
import { fetchSquadData } from '../../data/mockSquad';
import { SquadData, SquadScenario } from '../../types/squad';

type Status = 'loading' | 'error' | 'success';

type State = {
  status: Status;
  data: SquadData | null;
  error: string | null;
};

export function useSquadData(scenario: SquadScenario) {
  const [state, setState] = useState<State>({ status: 'loading', data: null, error: null });

  const load = useCallback(() => {
    setState({ status: 'loading', data: null, error: null });
    fetchSquadData(scenario)
      .then(data => setState({ status: 'success', data, error: null }))
      .catch((err: Error) => setState({ status: 'error', data: null, error: err.message }));
  }, [scenario]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, setData: (updater: (d: SquadData) => SquadData) => {
    setState(s => (s.data ? { ...s, data: updater(s.data) } : s));
  }, retry: load };
}
