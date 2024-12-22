import React, { useState, useEffect } from 'react';

let setToastState;

const Toast = (() => {
  const ToastComponent = () => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [bgColor, setBgColor] = useState('#333');

    setToastState = (msg, color = '#333') => {
      setMessage(msg);
      setBgColor(color);
      setVisible(true);
    };

    useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 2000); 

        return () => clearTimeout(timer);
      }
    }, [visible]);

    if (!visible) return null;

    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '65px', 
        right: '10px', 
        backgroundColor: bgColor, 
        color: '#fff', 
        padding: '10px 10px', 
        borderRadius: '8px', 
        opacity: visible ? 1 : 0, 
        transition: 'opacity 0.3s ease' 
      }}>
        {message}
      </div>
    );
  };
  ToastComponent.show = (msg, color) => {
    setToastState && setToastState(msg, color);
  };

  return ToastComponent;
})();

export default Toast;
