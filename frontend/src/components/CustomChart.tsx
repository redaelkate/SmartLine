import React from 'react';
import Chart from 'react-apexcharts';

const CustomChart = (props) => {
  // Filter out invalid attributes
  const validProps = Object.keys(props).reduce((acc, key) => {
    if (key !== 'q') {
      acc[key] = props[key];
    }
    return acc;
  }, {});

  return <Chart {...validProps} />;
};

export default CustomChart;