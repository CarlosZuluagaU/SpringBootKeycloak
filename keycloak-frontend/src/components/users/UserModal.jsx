import React, { useState, useEffect } from 'react';
import styles from './UserModal.module.css';

// initialData es opcional. Si se proporciona, el modal funciona en modo "Edición".
const UserModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  const isEditMode = initialData !== null;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        username: initialData.username || '',
        email: initialData.email || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
      });
    } else {
      // Resetea el formulario para el modo de creación
      setFormData({ username: '', email: '', firstName: '', lastName: '', password: '' });
    }
  }, [initialData, isOpen]); // Se actualiza cuando cambia el usuario o cuando se abre/cierra

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>{isEditMode ? 'Actualizar Usuario' : 'Crear Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">Nombre</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Apellido</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            {/* El campo de contraseña solo aparece en el modo de creación */}
            {!isEditMode && (
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
            )}
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
