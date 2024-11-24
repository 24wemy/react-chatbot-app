import React from 'react';

const CountryList = () => {
  const countries = ['Indonesia', 'USA', 'Japan', 'Germany', 'France'];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Daftar Negara</h2>
      <ul>
        {countries.map((country, index) => (
          <li key={index}>{country}</li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
