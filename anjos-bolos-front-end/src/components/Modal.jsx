import styles from "../styles/Modal.module.css";
import fechar from "../assets/close.svg"

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (  
    <div className={ styles.overlay } onClick={ onClose }>
      <div className={ styles.modal } onClick={ (e) => e.stopPropagation() }>
        { children }
        <button className={ styles["button-fechar"] } onClick={ onClose }>
            <img src={ fechar } alt="" />
        </button>
      </div>
    </div>
  );
}