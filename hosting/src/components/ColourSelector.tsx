import React from 'react';

type ColourSelectorType = {
  defaultValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ColourSelector = ({ defaultValue, onChange }: ColourSelectorType) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          width: '100%',
          margin: 10
        }}
      >
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
          Background Colour
        </span>
        <input
          id='background-color-input'
          value={defaultValue}
          onChange={onChange}
          type={'color'}
        />
      </div>
    </>
  );
};
