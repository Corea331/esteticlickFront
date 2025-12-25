import { User, Edit, Image as ImageIcon } from 'lucide-react';
import './profilelayout.css';

const ProfileLayout = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'info', label: 'Datos', icon: User },
    { id: 'edit', label: 'Editar', icon: Edit },
    { id: 'avatar', label: 'Avatar', icon: ImageIcon },
  ];

  return (
    <div className="profile-layout">
      {/* Tabs de navegación interna */}
      <div className="profile-tabs-container">
        <div className="profile-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                className={`profile-tab ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                aria-selected={isActive}
              >
                <Icon size={18} className="me-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido del tab activo */}
      <div className="profile-content-container">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;