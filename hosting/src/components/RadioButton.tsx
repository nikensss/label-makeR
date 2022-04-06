import { useState } from 'react';

type RadioButtonType = {
  value: string;
  groupName: string;
  label: string;
};
export const RadioButton = ({ value, groupName, label }: RadioButtonType) => {
  const [isHover, setIsHover] = useState(false);
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: 10,
      cursor: isHover ? 'pointer' : 'auto'
    },
    label: {
      fontFamily: ['Source Code Pro', 'Courier New', 'monospace'].join(',')
    }
  };

  const toggleHover = () => {
    setIsHover(!isHover);
  };

  return (
    <div style={styles.container}>
      <label style={styles.container} onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
        <input type='radio' value={value} name={groupName} />
        <span style={styles.label}>{label}</span>
      </label>
    </div>
  );
};
