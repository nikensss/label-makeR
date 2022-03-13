type InputLabelType = {
  value: string;
};

export default function InputLabel({ value }: InputLabelType) {
  return (
    <>
      <span
        style={{
          color: 'rgba(0, 0, 0, 0.55)',
          padding: 0,
          fontSize: '0.75rem',
          fontFamily: 'Source Code Pro',
          fontWeight: 400,
          lineHeight: 1,
          marginBottom: 10
        }}
      >
        {value}
      </span>
    </>
  );
}
