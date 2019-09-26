import React from 'react';

// From StackOverflow: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');

  return d;
}

const SVGCircle = ({ radius, color, svgClass, circleSize, currentRadius }) => {
  return (
    <svg className={svgClass}>
      <path
        fill='none'
        stroke={color}
        strokeOpacity='0.3'
        strokeWidth='5'
        d={describeArc(circleSize, circleSize, currentRadius, 0, 359.99999)}
      />
      <path
        fill='none'
        stroke={color}
        strokeOpacity='0.6'
        strokeWidth='5'
        d={describeArc(circleSize, circleSize, currentRadius, 0, radius)}
      />
    </svg>
  );
};

export default React.memo(SVGCircle);
