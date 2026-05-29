import { useEffect, useState } from 'react';
import FormField from '../components/FormField.jsx';
import { collections } from '../data/constants.js';
import { getById, upsertDoc } from '../services/firestoreService.js';
import { useToast } from '../contexts/ToastContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Settings() {
  const toast = useToast();
  const { changePassword } = useAuth();
  const [settings, setSettings] = useState({ centerName: 'Ideal Coaching Center', logoUrl: '', address: '', phone: '', email: '', invoiceFooter: '', qrBaseUrl: location.origin });
  const [password, setPassword] = useState({ current: '', next: '' });

  useEffect(() => {
    getById(collections.settings, 'app').then(data => data && setSettings(s => ({ ...s, ...data })));
  }, []);

  async function save(e) {
    e.preventDefault();
    await upsertDoc(collections.settings, 'app', { ...settings, updatedAt: new Date().toISOString() });
    toast.push('Settings saved.', 'success');
  }

  async function updatePass(e) {
    e.preventDefault();
    await changePassword(password.current, password.next);
    toast.push('Password changed.', 'success');
    setPassword({ current: '', next: '' });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <div className="card">
        <h2 className="mb-4 font-bold">Coaching Settings</h2>
        <form onSubmit={save} className="form-grid">
          {Object.keys(settings).map(key => <FormField key={key} label={key}><input value={settings[key]} onChange={e => setSettings({ ...settings, [key]: e.target.value })} /></FormField>)}
          <button className="btn btn-primary md:col-span-2">Save Settings</button>
        </form>
      </div>
      <div className="card">
        <h2 className="mb-4 font-bold">Change Password</h2>
        <form onSubmit={updatePass} className="grid gap-4">
          <FormField label="Current Password"><input type="password" value={password.current} onChange={e => setPassword({ ...password, current: e.target.value })} /></FormField>
          <FormField label="New Password"><input type="password" value={password.next} onChange={e => setPassword({ ...password, next: e.target.value })} /></FormField>
          <button className="btn btn-primary">Update Password</button>
        </form>
      </div>
    </div>
  );
}
