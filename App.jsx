:root {
  --navy: #0f1f3d;
  --navy-light: #1a3260;
  --gold: #c9a84c;
  --gold-light: #e2c97e;
  --gold-pale: #f5edd6;
  --cream: #faf8f4;
  --white: #ffffff;
  --gray-100: #f4f4f6;
  --gray-200: #e8e8ed;
  --gray-400: #9999aa;
  --gray-600: #555566;
  --gray-800: #222233;
  --success: #2d7a4f;
  --danger: #c0392b;
  --radius: 10px;
  --shadow-sm: 0 1px 4px rgba(15,31,61,0.07);
  --shadow-md: 0 4px 20px rgba(15,31,61,0.10);
  --shadow-lg: 0 8px 40px rgba(15,31,61,0.13);
  --transition: all 0.22s cubic-bezier(.4,0,.2,1);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--gray-800);
  min-height: 100vh;
  font-size: 15px;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 10px; }

.btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 20px; border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
  cursor: pointer; border: none; transition: var(--transition);
  text-decoration: none;
}
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-primary { background: var(--navy); color: var(--white); }
.btn-primary:hover:not(:disabled) { background: var(--navy-light); }
.btn-gold { background: var(--gold); color: var(--navy); }
.btn-gold:hover:not(:disabled) { background: var(--gold-light); }
.btn-outline { background: none; border: 1px solid var(--gray-200); color: var(--gray-600); }
.btn-outline:hover:not(:disabled) { border-color: var(--navy); color: var(--navy); }
.btn-danger { background: var(--danger); color: white; }
.btn-sm { padding: 6px 14px; font-size: 12px; }

.card {
  background: var(--white); border-radius: var(--radius);
  border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.card-header {
  padding: 18px 22px 14px; border-bottom: 1px solid var(--gray-200);
  display: flex; align-items: center; justify-content: space-between;
}
.card-header h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-weight: 600; color: var(--navy);
}
.card-body { padding: 20px 22px; }

.badge {
  font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 500;
}
.badge-active { background: #e6f4ee; color: var(--success); }
.badge-alumni { background: var(--gold-pale); color: #8a6914; }
.badge-pledge { background: #eef2ff; color: #3a4fd4; }
.badge-admin { background: #fde8e8; color: #8a1a1a; }

.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label {
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--gray-600);
}
.form-group input,
.form-group select,
.form-group textarea {
  border: 1px solid var(--gray-200); border-radius: 8px;
  padding: 9px 13px; font-family: 'DM Sans', sans-serif;
  font-size: 14px; color: var(--gray-800); background: var(--white); outline: none;
  transition: var(--transition);
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--navy); box-shadow: 0 0 0 3px rgba(15,31,61,0.07);
}
.form-group textarea { resize: vertical; min-height: 80px; }

.avatar {
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif; font-weight: 700; flex-shrink: 0;
}

.loading {
  display: flex; align-items: center; justify-content: center;
  padding: 60px; color: var(--gray-400); font-size: 14px;
  flex-direction: column; gap: 12px;
}
.spinner {
  width: 28px; height: 28px; border: 3px solid var(--gray-200);
  border-top-color: var(--navy); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-msg {
  background: #fde8e8; border: 1px solid #f5c2c2;
  color: #8a1a1a; padding: 10px 14px; border-radius: 8px; font-size: 13px;
}
.success-msg {
  background: #e6f4ee; border: 1px solid #b7dfca;
  color: var(--success); padding: 10px 14px; border-radius: 8px; font-size: 13px;
}
