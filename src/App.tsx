import { OptionsForm } from './options-form';
import './styles.css';

export default function App() {
  return (
    <div className="App">
      <OptionsForm sendNotification={() => {}} canUpdate />
    </div>
  );
}
