import { useAlert } from '../../../context/alertcontext';
import Alert from './alert';
import './Alert.css';

const AlertContainer = () => {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="alert-container">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onDismiss={() => removeAlert(alert.id)}
        >
          {alert.children}
        </Alert>
      ))}
    </div>
  );
};

export default AlertContainer;