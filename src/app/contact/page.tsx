'use client';

import { useState } from 'react';
import { Send, Mail, MessageCircle, CheckCircle2 } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', type: 'feedback', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 1000));
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Message envoyé avec succès !</h2>
        <p className="text-sm text-zinc-400">Nous vous répondrons dans les plus brefs délais.</p>
        <button
          onClick={() => {
            setStatus('idle');
            setForm({ name: '', email: '', type: 'feedback', message: '' });
          }}
          className="mt-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white">Contact & Retours</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Signalement d&apos;erreur, suggestion de fonctionnalité ou question médicale.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-[#181818] p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="c-name" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Nom complet
              </label>
              <input
                id="c-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Dr. Thomas Martin"
                className="rounded-xl border border-zinc-800 bg-[#111111] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="c-email" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Email
              </label>
              <input
                id="c-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="vous@etudiant-medecine.fr"
                className="rounded-xl border border-zinc-800 bg-[#111111] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="c-type" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Type de demande
            </label>
            <select
              id="c-type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="rounded-xl border border-zinc-800 bg-[#111111] px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
            >
              <option value="feedback">Retour d&apos;expérience général</option>
              <option value="bug">Signaler un bug technique</option>
              <option value="content">Signaler une erreur sur un QCM</option>
              <option value="feature">Suggestion de fonctionnalité</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="c-message" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Message
            </label>
            <textarea
              id="c-message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Expliquez-nous en détail votre demande…"
              className="resize-none rounded-xl border border-zinc-800 bg-[#111111] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-3 text-sm font-semibold text-white transition-colors shadow-lg shadow-red-900/30 disabled:opacity-60"
          >
            {status === 'sending' ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Envoi en cours…</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Envoyer le message</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 flex justify-center gap-6 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <Mail className="h-3.5 w-3.5" /> contact@medquiz.fr
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" /> Communauté Discord
        </span>
      </div>
    </div>
  );
}
