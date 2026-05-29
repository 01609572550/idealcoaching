import { useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import FormField from '../components/FormField.jsx';
import { roles, collections } from '../data/constants.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCollection } from '../hooks/useCollection.js';
import { useToast } from '../contexts/ToastContext.jsx';

export default function Staff() {
  const { createStaff, saveStaff } = useAuth();
  const toast = useToast();
  const { data: users } = useCollection(collections.users);
  const [form, setForm] = useState({ username: '', password: '', name: '', role: roles.FEE_COLLECTOR });

  async function submit(e) {
    e.preventDefault();
    try {
      await createStaff(form);
      toast.push('Staff account created.', 'success');
      setForm({ username: '', password: '', name: '', role: roles.FEE_COLLECTOR });
    } catch (error) {
      toast.push(error.message, 'error');
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <div className="card">
        <h2 className="mb-4 font-bold">Create Staff</h2>
        <form onSubmit={submit} className="grid gap-4">
          <FormField label="Name"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Username"><input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></FormField>
          <FormField label="Password"><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></FormField>
          <FormField label="Role"><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>{Object.values(roles).map(role => <option key={role}>{role}</option>)}</select></FormField>
          <button className="btn btn-primary">Create Account</button>
        </form>
      </div>
      <DataTable columns={[
        { key:'name', label:'Name' },
        { key:'email', label:'Email' },
        { key:'role', label:'Role' },
        { key:'status', label:'Status' },
        { key:'action', label:'Action', render:r=><button className="btn" onClick={()=>saveStaff(r.id,{...r,status:r.status==='Inactive'?'Active':'Inactive'})}>Toggle</button> }
      ]} rows={users} />
    </div>
  );
}
