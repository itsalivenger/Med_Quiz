'use client';

import { useState } from 'react';
import { Send, Mail, MessageCircle, CheckCircle2 } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactPage() {
  const [form,   setForm]   = useState({ name: '', email: '', type: 'feedback', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Stub: replace with real submission (e.g. POST /api/contact)
    await new Promise(r => setTimeout(r, 1200));
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Message sent!</h2>
        <p className="text-sm text-slate-500">We'll get back to you within 24 hours.</p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', email: '', type: 'feedback', message: '' }); }}
          className="mt-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white">Contact & Feedback</h1>
        <p className="mt-2 text-sm text-slate-500">Bug reports, feature requests, or just saying hi — we read everything.</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="c-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Name</label>
              <input id="c-name" type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Dr. Jane Smith"
                className="rounded-xl border border-slate-700/60 bg-slate-800/70 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="c-email" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email</label>
              <input id="c-email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@university.edu"
                className="rounded-xl border border-slate-700/60 bg-slate-800/70 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="c-type" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Type</label>
            <select id="c-type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="rounded-xl border border-slate-700/60 bg-slate-800/70 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20">
              <option value="feedback">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="content">Content Error</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="c-message" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Message</label>
            <textarea id="c-message" rows={5} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Tell us what's on your mind…"
              className="resize-none rounded-xl border border-slate-700/60 bg-slate-800/70 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20" />
          </div>

          <button type="submit" disabled={status === 'sending'}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02] hover:shadow-cyan-500/40 active:scale-95 disabled:opacity-60">
            {status === 'sending' ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Sending…</>
            ) : (
              <><Send className="h-4 w-4" /> Send Message</>
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 flex justify-center gap-6 text-xs text-slate-600">
        <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> support@medquiz.app</span>
        <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> Discord community</span>
      </div>
    </div>
  );
}
