import React from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions } from './types';

interface Props extends PanelProps<PanelOptions> {}

export const CompassPanel: React.FC<Props> = ({ options, data, width, height }) => {
  // Find the heading in series with refId "A"
  const headingSeries = data.series.find(s => s.refId === 'A');
  const headingField = headingSeries?.fields.find(f => f.type === 'number');
  const heading = headingField?.values.get(headingField.values.length - 1);
  const normalizedHeading = heading !== undefined ? ((heading % 360) + 360) % 360 : undefined;

  // Find blocked start in series with refId "B"
  const startSeries = data.series.find(s => s.refId === 'B');
  const startField = startSeries?.fields.find(f => f.type === 'number');
  const blockedStart = startField?.values.get(startField.values.length - 1);

  // Find blocked end in series with refId "C"
  const endSeries = data.series.find(s => s.refId === 'C');
  const endField = endSeries?.fields.find(f => f.type === 'number');
  const blockedEnd = endField?.values.get(endField.values.length - 1);

  const getTextPosition = (angle: number) => {
    const radius = 55;
    const x = radius * Math.sin(angle * Math.PI / 180);
    const y = -radius * Math.cos(angle * Math.PI / 180);
    return { x, y };
  };

  // Helper to create SVG arc path
  const describeArc = (startAngle: number, endAngle: number, radius: number) => {
    const start = {
      x: radius * Math.sin(startAngle * Math.PI / 180),
      y: -radius * Math.cos(startAngle * Math.PI / 180)
    };
    const end = {
      x: radius * Math.sin(endAngle * Math.PI / 180),
      y: -radius * Math.cos(endAngle * Math.PI / 180)
    };

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");
  };

  return (
    <div style={{ width, height }} className="flex items-center justify-center">
      <svg viewBox="-100 -100 200 200" style={{ width: Math.min(width, height), height: Math.min(width, height) }}>
        <circle r="90" fill="none" stroke="#bbb" strokeWidth="4"/>
        <circle r="88" fill="#333" stroke="none"/>

        {/* Blocked range indicator if present */}
        {blockedStart !== undefined && blockedEnd !== undefined && (
          <g>
            <title>Blind spot</title>
            <path
              d={describeArc(blockedStart, blockedEnd, 89)}
              stroke="#f40"
              strokeWidth="6"
              fill="none"
              style={{ cursor: 'help' }}
            />
          </g>
        )}

        {/* Small marks first */}
        {[...Array(120)].map((_, i) => {
          const angle = i * 3;
          return (
            <line
              key={i}
              x1="0"
              y1="-85"
              x2="0"
              y2="-78"
              stroke="#ddd"
              strokeWidth="1"
              transform={`rotate(${angle})`}
            />
          );
        })}

        {/* Large marks without text */}
        {[...Array(8)].map((_, i) => {
          const angle = i * 45;
          return (
            <line
              key={i}
              x1="0"
              y1="-85"
              x2="0"
              y2="-70"
              stroke="#ddd"
              strokeWidth="2"
              transform={`rotate(${angle})`}
            />
          );
        })}

        <rect
          x="-2"
          y="-85"
          width="4"
          height="20"
          fill="red"
        />

        {/* Pointer above marks but below text */}
        {normalizedHeading !== undefined && (
          <g transform={`rotate(${normalizedHeading})`}>
            <path
              d="M -6,-65 L 6,-65 L 6,-20 L -6,-20 L -6,-65 L 0,-75 L 6,-65"
              fill="#999"
            />
          </g>
        )}

        {/* Text on top of everything */}
        {[...Array(8)].map((_, i) => {
          const angle = i * 45;
          const pos = getTextPosition(angle);
          return (
            <text
              key={i}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#ddd"
              fontSize="12"
            >
              {angle}
            </text>
          );
        })}

        <circle r="12" fill="white" stroke="#666" strokeWidth="1"/>
      </svg>
    </div>
  );
};
