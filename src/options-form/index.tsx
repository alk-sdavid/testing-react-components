import { useEffect, useState } from 'react';
import { fetchOptions, saveOptions } from '../api';

interface OptionsType {
  [key: string]: boolean;
}

export function OptionsForm({
  canUpdate,
  sendNotification,
}: {
  canUpdate?: boolean;
  sendNotification: (message: string, type: 'success' | 'error') => void;
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [options, setOptions] = useState<OptionsType>({});
  const isReadOnly = !canUpdate || isSaving;

  useEffect(() => {
    const fetch = async () => {
      try {
        setFetching(true);
        const response = await fetchOptions();
        setOptions(response);
      } catch (error) {
        console.error(error);
        sendNotification('Failed to fetch options', 'error');
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [sendNotification]);

  const onConfirm = () => {
    setSaving(true);
    const save = async () => {
      try {
        await saveOptions(options);
        sendNotification('Options saved', 'success');
        setModalOpen(false);
      } catch (error) {
        console.error(error);
        sendNotification('Failed to save', 'error');
      } finally {
        setSaving(false);
      }
    };
    save();
  };

  const onCancel = () => {
    setModalOpen(false);
  };

  return isFetching ? (
    <div>Fetching options...</div>
  ) : (
    <>
      <ul>
        {Object.entries(options).map(([key, value]) => (
          <li key={key}>
            <input
              type="checkbox"
              id={`option-${key}`}
              checked={value}
              readOnly={isReadOnly}
              onChange={() => {
                setOptions((state) => ({ ...state, [key]: !state[key] }));
              }}
            />
            <label htmlFor={`option-${key}`}>Option {key.toUpperCase()}</label>
          </li>
        ))}
      </ul>
      <button onClick={() => setModalOpen(true)} disabled={isReadOnly}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>
      {isModalOpen ? (
        <div role="dialog">
          {canUpdate ? (
            <>
              <button onClick={onCancel} disabled={isSaving}>
                Cancel
              </button>
              <button onClick={onConfirm} disabled={isSaving}>
                Confirm
              </button>
            </>
          ) : (
            <>
              <div>Forbidden action</div>
              <button onClick={onCancel} disabled={isSaving}>
                Cancel
              </button>
            </>
          )}
        </div>
      ) : null}
    </>
  );
}
