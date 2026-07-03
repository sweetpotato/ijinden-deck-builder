import { useLiveQuery } from 'dexie-react-hooks';
import { useObservable } from 'dexie-react-hooks';

const useAct = () => {
  const [data, set] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [path, setPath] = useState('');
  const [content, setContent] = useState(null);

  useLiveQuery(() => {
    if (data && !loading) {
      setContent(data);
      setLoading(false);
    }
  }, [data, loading, error, path], [data, loading, error, content]);

  useObservable(() => {
    setPath(path);
  });
