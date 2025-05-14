// app/css/veterinary.tsx
export const veterinaryStyles =
`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal {
          background: #fff;
          border-radius: 1rem;
          padding: 2rem;
          width: 90%;
          max-width: 400px;
          position: relative;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .close-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #333;
          cursor: pointer;
        }
        .modal-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #012d4a;
        }
        .description {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .label {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .input-code {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 0.25rem;
          text-transform: uppercase;
          margin-bottom: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-code:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        }
        .error {
          color: #dc3545;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .submit-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        .submit-btn:not(:disabled):hover {
          background-color: #0056b3;
        }
      `;