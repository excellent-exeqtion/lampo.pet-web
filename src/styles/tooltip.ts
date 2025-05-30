// app/css/tooltip.tsx
export const tooltipStyles =
  `
        .tooltip-container {
          position: relative;
          display: inline-block;
        }
        .tooltip-container .tooltip-text {
          visibility: hidden;
          width: max-content;
          background-color: white;
          color:rgb(1, 114, 173);
          border: 1px solid rgb(1, 114, 173);
          text-align: center;
          padding: 4px 8px;
          border-radius: 4px;
          position: absolute;
          font-size: 0.75rem;
          white-space: nowrap;
          z-index: 1600;
          font-weight: bold;
          opacity: 0;
        }
        .tooltip-left {
          top: 18%;
          right: 100%;
          margin-right: 0.5rem;
          transition: opacity 0.2s !important;
        }
        .tooltip-right {
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 0.5rem;
        }
        .tooltip-container:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
      `;