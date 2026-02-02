import React from "react";

const FileIcon: React.FC<{ width?: number; height?: number }> = ({
  width = 24,
  height = 25,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 25"
    fill="none"
  >
    <path
      d="M14 2.01953H6C5.46957 2.01953 4.96086 2.23024 4.58579 2.60532C4.21071 2.98039 4 3.4891 4 4.01953V20.0195C4 20.55 4.21071 21.0587 4.58579 21.4337C4.96086 21.8088 5.46957 22.0195 6 22.0195H18C18.5304 22.0195 19.0391 21.8088 19.4142 21.4337C19.7893 21.0587 20 20.55 20 20.0195V8.01953L14 2.01953Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2.01953V8.01953H20"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 13.0195H8"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17.0195H8"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 9.01953H9H8"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FileIcon;
