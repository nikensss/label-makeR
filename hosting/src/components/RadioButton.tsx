import { Typography } from '@material-ui/core';

type RadioButtonType = {
  value: string;
  groupName: string;
  label: string;
};
export default function RadioButton({ value, groupName, label }: RadioButtonType) {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: 10
    }
  };
  return (
    <div style={styles.container}>
      <input type='radio' value={value} name={groupName} />
      <Typography>{label}</Typography>
    </div>
  );
}
