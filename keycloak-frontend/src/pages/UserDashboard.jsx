import React, { useState, useEffect, useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import WelcomeScreen from '../components/layout/WelcomeScreen.jsx';
import UserModal from '../components/users/UserModal.jsx';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  const { keycloak, initialized } = useKeycloak();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = useCallback(() => {
    if (keycloak.authenticated) {
      setLoading(true);
      setError(null);
      axios.get('http://localhost:8080/keycloak/user/all', {
        headers: { Authorization: `Bearer ${keycloak.token}` },
      })
      .then(response => setUsers(response.data))
      .catch(err => {
        console.error("Error al obtener usuarios:", err);
        setError("No se pudieron cargar los usuarios.");
      })
      .finally(() => setLoading(false));
    }
  }, [keycloak]);

  const handleSaveUser = (userData) => {
    const isEditMode = !!editingUser;
    const url = isEditMode 
      ? `http://localhost:8080/keycloak/user/update/${editingUser.id}`
      : 'http://localhost:8080/keycloak/user/create';
    const method = isEditMode ? 'put' : 'post';

    axios[method](url, userData, {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    })
    .then(() => {
      alert(`¡Usuario ${isEditMode ? 'actualizado' : 'creado'} exitosamente!`);
      closeModal();
      fetchUsers();
    })
    .catch(err => {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} usuario:`, err);
      alert(`Error al ${isEditMode ? 'actualizar' : 'crear'} el usuario.`);
    });
  };

  const handleDeleteUser = (userId, username) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${username}"?`)) {
      axios.delete(`http://localhost:8080/keycloak/user/delete/${userId}`, {
        headers: { Authorization: `Bearer ${keycloak.token}` },
      })
      .then(() => {
        alert('¡Usuario eliminado exitosamente!');
        fetchUsers();
      })
      .catch(err => {
        console.error("Error al eliminar usuario:", err);
        alert('Error al eliminar el usuario.');
      });
    }
  };
  
  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      fetchUsers();
    } else if (initialized) {
      setLoading(false);
    }
  }, [initialized, keycloak.authenticated, fetchUsers]);

  if (!initialized) {
    return <div className={styles.loadingText}>Conectando...</div>;
  }

  if (!keycloak.authenticated) {
    return <WelcomeScreen />;
  }

  return (
    <>
      <UserModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        onSave={handleSaveUser}
        initialData={editingUser}
      />

      <div className={styles.dashboardCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Panel de Administración</h1>
          <button 
            onClick={openCreateModal}
            className={styles.createUserButton}
          >
            Crear Usuario
          </button>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className={styles.loadingText}>Cargando usuarios...</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{user.username}</td>
                    <td className={styles.tableCell}>{user.email || 'N/A'}</td>
                    <td className={styles.tableCell}>{user.firstName || 'N/A'}</td>
                    <td className={styles.tableCell}>{user.lastName || 'N/A'}</td>
                    <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                      <button onClick={() => openEditModal(user)} className={styles.updateButton}>Actualizar</button>
                      <button onClick={() => handleDeleteUser(user.id, user.username)} className={styles.deleteButton}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!loading && users.length === 0 && !error && (
            <p className={styles.noUsersText}>No se encontraron usuarios en el realm.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
