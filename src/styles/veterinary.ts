// app/css/veterinary.tsx
export const veterinaryStyles =
`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--primary-darkertransparent);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal {
          background: var(--primary-inverse);
          border-radius: 1rem;
          padding: 2rem;
          width: 90%;
          max-width: 400px;
          position: relative;
          box-shadow: 0 10px 25px var(--primary-lighttransparent);
        }
        .close-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          font-size: 1.25rem;
          color: var(--primary-darkgray);
          cursor: pointer;
        }
        .label {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: var(--primary-darkgray);
        }
        .input-code {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid var(--primary-lightgray);
          border-radius: 0.25rem;
          text-transform: uppercase;
          margin-bottom: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-code:focus {
          outline: none;
          border-color: var(--pico-primary);
          box-shadow: 0 0 0 3px var(--primary-darkblue);
        }
        .error {
          color: var(--primary-red);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          background-color: var(--pico-primary);
          color: var(--primary-inverse);
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .submit-btn:disabled {
          background-color: var(--primary-lightgray);
          cursor: not-allowed;
        }
        .submit-btn:not(:disabled):hover {
          background-color: var(--pico-primary);
        }
      `;