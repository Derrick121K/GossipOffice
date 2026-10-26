'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Check, Download, FileText, ReceiptText, Save, Sparkles, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCV } from '@/lib/store'
import { exportTextToDocx, exportTextToPdf } from '@/lib/tools-docs'

type TemplateId = 'payslip' | 'invoice' | 'budget' | 'minutes' | 'leave' | 'letter'
type Field = { key: string; label: string; placeholder?: string; multiline?: boolean; number?: boolean }

const templates: { id: TemplateId; title: string; category: string; description: string; icon: typeof FileText; fields: Field[] }[] = [
  { id: 'payslip', title: 'Employee payslip', category: 'Work & payroll', description: 'Prepare a clear monthly payslip in South African rand.', icon: ReceiptText, fields: [
    { key: 'company', label: 'Employer / business', placeholder: 'Company name' }, { key: 'employee', label: 'Employee full name', placeholder: 'Employee name' }, { key: 'employeeNumber', label: 'Employee number', placeholder: 'EMP-001' }, { key: 'period', label: 'Pay period', placeholder: 'October 2026' }, { key: 'payDate', label: 'Payment date', placeholder: '31 October 2026' }, { key: 'gross', label: 'Gross pay (R)', number: true, placeholder: '18000' }, { key: 'overtime', label: 'Overtime / bonus (R)', number: true, placeholder: '0' }, { key: 'paye', label: 'PAYE (R)', number: true, placeholder: 'Enter verified amount' }, { key: 'uif', label: 'UIF employee contribution (R)', number: true, placeholder: 'Enter verified amount' }, { key: 'pension', label: 'Pension / other deductions (R)', number: true, placeholder: '0' }, { key: 'notes', label: 'Notes', multiline: true, placeholder: 'Optional notes or payment reference' }
  ] },
  { id: 'invoice', title: 'Invoice', category: 'Business', description: 'A simple invoice with customer, line items and payment details.', icon: FileText, fields: [
    { key: 'company', label: 'Business name', placeholder: 'Your business' }, { key: 'customer', label: 'Bill to', placeholder: 'Customer / company' }, { key: 'number', label: 'Invoice number', placeholder: 'INV-2026-001' }, { key: 'date', label: 'Invoice date', placeholder: '26 October 2026' }, { key: 'items', label: 'Items and amounts', multiline: true, placeholder: 'Website setup — R1,500\nMaintenance — R500' }, { key: 'payment', label: 'Payment details', multiline: true, placeholder: 'Bank, account holder and reference' }, { key: 'notes', label: 'Notes / terms', multiline: true, placeholder: 'Payment due within 7 days' }
  ] },
  { id: 'budget', title: 'Monthly budget', category: 'Personal finance', description: 'Plan income, expenses and your monthly balance.', icon: Wallet, fields: [
    { key: 'owner', label: 'Budget owner', placeholder: 'Name or household' }, { key: 'period', label: 'Month', placeholder: 'October 2026' }, { key: 'income', label: 'Total income (R)', number: true, placeholder: '15000' }, { key: 'expenses', label: 'Expenses (one per line)', multiline: true, placeholder: 'Rent — 4500\nFood — 2200\nTransport — 1200' }, { key: 'goals', label: 'Savings goal / notes', multiline: true, placeholder: 'Save R1,000 this month' }
  ] },
  { id: 'minutes', title: 'Meeting minutes', category: 'Work & study', description: 'Capture decisions, actions, owners and due dates.', icon: CalendarDays, fields: [
    { key: 'meeting', label: 'Meeting title', placeholder: 'Weekly project meeting' }, { key: 'date', label: 'Date and time', placeholder: '26 October 2026, 10:00' }, { key: 'attendees', label: 'Attendees', multiline: true, placeholder: 'Names and roles' }, { key: 'agenda', label: 'Agenda and discussion', multiline: true, placeholder: '1. Project status\n2. Risks' }, { key: 'decisions', label: 'Decisions made', multiline: true, placeholder: 'Decision and rationale' }, { key: 'actions', label: 'Actions, owners and due dates', multiline: true, placeholder: 'Action — Owner — Due date' }
  ] },
  { id: 'leave', title: 'Leave application', category: 'Work & payroll', description: 'A reusable leave request for an employee and manager.', icon: BriefcaseBusiness, fields: [
    { key: 'employee', label: 'Employee name', placeholder: 'Full name' }, { key: 'company', label: 'Employer', placeholder: 'Company name' }, { key: 'leaveType', label: 'Leave type', placeholder: 'Annual / sick / family responsibility' }, { key: 'start', label: 'Start date', placeholder: '2026-11-02' }, { key: 'end', label: 'End date', placeholder: '2026-11-06' }, { key: 'reason', label: 'Reason / handover notes', multiline: true, placeholder: 'Optional details' }, { key: 'manager', label: 'Manager / approver', placeholder: 'Approver name' }
  ] },
  { id: 'letter', title: 'Professional letter', category: 'Personal & business', description: 'Draft a formal letter for work, school or everyday administration.', icon: FileText, fields: [
    { key: 'sender', label: 'Your name / organisation', placeholder: 'Sender' }, { key: 'recipient', label: 'Recipient', placeholder: 'Person or organisation' }, { key: 'date', label: 'Date', placeholder: '26 October 2026' }, { key: 'subject', label: 'Subject', placeholder: 'Purpose of letter' }, { key: 'body', label: 'Message', multiline: true, placeholder: 'Write your letter here…' }, { key: 'signoff', label: 'Sign-off', placeholder: 'Kind regards' }
  ] }
]

const amount = (v: string) => Number.parseFloat(v || '0') || 0
const zar = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v)

export default function EverydayTemplatesPage() {
  const [selected, setSelected] = useState<TemplateId>('payslip')
  const [values, setValues] = useState<Record<string, string>>({
    period: new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' }),
    payDate: new Date().toLocaleDateString('en-ZA')
  })
  const { createDocument } = useCV()
  const template = templates.find((item) => item.id === selected) ?? templates[0]
  const gross = amount(values.gross) + amount(values.overtime)
  const deductions = amount(values.paye) + amount(values.uif) + amount(values.pension)
  const net = gross - deductions

  const output = useMemo(() => {
    const v = (key: string) => values[key]?.trim() || '—'
    if (selected === 'payslip') return [
      v('company'), 'EMPLOYEE PAYSLIP', 'Pay period: ' + v('period'), 'Payment date: ' + v('payDate'), '',
      'Employee: ' + v('employee'), 'Employee number: ' + v('employeeNumber'), '', 'EARNINGS',
      'Basic / gross pay: ' + zar(amount(values.gross)), 'Overtime / bonus: ' + zar(amount(values.overtime)),
      'Total gross earnings: ' + zar(gross), '', 'DEDUCTIONS',
      'PAYE (entered by employer): ' + zar(amount(values.paye)), 'UIF (entered by employer): ' + zar(amount(values.uif)),
      'Pension / other deductions: ' + zar(amount(values.pension)), 'Total deductions: ' + zar(deductions), '',
      'NET PAY: ' + zar(net), '', 'Notes: ' + v('notes'), '',
      'Payroll check: Verify tax, UIF eligibility, contribution caps and all deductions against current SARS / payroll rules before issuing this payslip.'
    ].join('\n')
    if (selected === 'invoice') return [v('company'), 'INVOICE', 'Invoice number: ' + v('number'), 'Date: ' + v('date'), 'Bill to: ' + v('customer'), '', 'ITEMS / AMOUNTS', v('items'), '', 'PAYMENT DETAILS', v('payment'), '', 'Notes / terms: ' + v('notes')].join('\n')
    if (selected === 'budget') return ['MONTHLY BUDGET', 'Owner: ' + v('owner'), 'Period: ' + v('period'), 'Income: ' + zar(amount(values.income)), '', 'EXPENSES', v('expenses'), '', 'Savings goal / notes: ' + v('goals'), '', 'Enter expenses as one item per line. This template does not automatically parse the expense list into a total.'].join('\n')
    if (selected === 'minutes') return [v('meeting'), 'MEETING MINUTES', 'Date: ' + v('date'), '', 'ATTENDEES', v('attendees'), '', 'AGENDA & DISCUSSION', v('agenda'), '', 'DECISIONS', v('decisions'), '', 'ACTIONS / OWNERS / DUE DATES', v('actions')].join('\n')
    if (selected === 'leave') return ['LEAVE APPLICATION', 'Employee: ' + v('employee'), 'Employer: ' + v('company'), 'Leave type: ' + v('leaveType'), 'From: ' + v('start'), 'To: ' + v('end'), '', 'Reason / handover notes', v('reason'), '', 'Manager / approver: ' + v('manager'), 'Employee signature: ____________________', 'Approval: ____________________'].join('\n')
    return [v('sender'), v('date'), '', 'To: ' + v('recipient'), 'Subject: ' + v('subject'), '', v('body'), '', v('signoff'), v('sender')].join('\n')
  }, [selected, values, gross, deductions, net])

  const set = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }))
  const save = () => {
    createDocument('doc', template.title + ' — ' + (values.employee || values.company || values.owner || values.meeting || values.subject || new Date().toLocaleDateString()), output, { templateId: selected, templateName: template.title })
    toast.success('Saved to GossipOffice Files on this device')
  }
  const downloadPdf = async () => {
    await exportTextToPdf(output, selected + '-' + new Date().toISOString().slice(0, 10) + '.pdf')
    toast.success('PDF exported')
  }
  const downloadDocx = async () => {
    await exportTextToDocx(output, selected + '-' + new Date().toISOString().slice(0, 10) + '.docx')
    toast.success('Word document exported')
  }

  return <main className="min-h-[calc(100vh-4rem)] bg-muted/20"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to Office Tools</Link>
    <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium"><Sparkles className="h-3.5 w-3.5 text-primary" /> Everyday productivity</div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Templates for real life</h1><p className="mt-2 max-w-2xl text-muted-foreground">Create useful documents for work, study, business and home. Fill in the form, preview your result, then save or export it.</p></div><div className="flex flex-wrap gap-2"><span className="rounded-lg border bg-background px-3 py-2 text-sm">Phone friendly</span><span className="rounded-lg border bg-background px-3 py-2 text-sm">DOCX + PDF</span><span className="rounded-lg border bg-background px-3 py-2 text-sm">Local-first</span></div></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="space-y-3"><div className="rounded-xl border bg-background p-3"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Template library</p>
        {templates.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setSelected(item.id)} className={'mb-1 flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ' + (selected === item.id ? 'bg-primary/10 text-foreground ring-1 ring-primary/30' : 'hover:bg-muted')}><Icon className="mt-0.5 h-4 w-4 shrink-0" /><span className="min-w-0"><span className="block text-sm font-medium">{item.title}</span><span className="block text-xs text-muted-foreground">{item.category}</span></span>{selected === item.id && <Check className="ml-auto h-4 w-4 text-primary" />}</button> })}
      </div><div className="rounded-xl border bg-background p-4"><p className="text-sm font-semibold">More than a CV builder</p><p className="mt-1 text-sm text-muted-foreground">Saved files remain in this browser profile until you export a backup or move to cloud storage.</p><Link href="/files" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">Manage Files →</Link></div></aside>
      <section className="min-w-0 space-y-4"><div className="rounded-xl border bg-background p-4 sm:p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-xl font-semibold">{template.title}</h2><p className="mt-1 text-sm text-muted-foreground">{template.description}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs">{template.category}</span></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">{template.fields.map((field) => <label key={field.key} className={'block space-y-1.5 ' + (field.multiline ? 'sm:col-span-2' : '')}><span className="text-sm font-medium">{field.label}</span>{field.multiline ? <textarea value={values[field.key] ?? ''} onChange={(e) => set(field.key, e.target.value)} placeholder={field.placeholder} rows={4} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" /> : <input type={field.number ? 'number' : 'text'} min={field.number ? 0 : undefined} step={field.number ? '0.01' : undefined} value={values[field.key] ?? ''} onChange={(e) => set(field.key, e.target.value)} placeholder={field.placeholder} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />}</label>)}</div>
        {selected === 'payslip' && <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-lg bg-muted/60 p-3"><p className="text-xs text-muted-foreground">Gross earnings</p><p className="mt-1 text-lg font-semibold">{zar(gross)}</p></div><div className="rounded-lg bg-muted/60 p-3"><p className="text-xs text-muted-foreground">Deductions entered</p><p className="mt-1 text-lg font-semibold">{zar(deductions)}</p></div><div className="rounded-lg bg-primary/10 p-3"><p className="text-xs text-muted-foreground">Estimated net pay</p><p className="mt-1 text-lg font-semibold">{zar(net)}</p></div><p className="sm:col-span-3 text-xs text-muted-foreground">PAYE and UIF are manually entered. This is a document generator, not a tax engine or payroll compliance service. Verify figures before paying employees.</p></div>}
        <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={save} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"><Save className="h-4 w-4" /> Save to Files</button><button type="button" onClick={() => void downloadPdf()} className="inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium hover:bg-muted"><Download className="h-4 w-4" /> Export PDF</button><button type="button" onClick={() => void downloadDocx()} className="inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium hover:bg-muted"><Download className="h-4 w-4" /> Export DOCX</button></div>
      </div><div className="rounded-xl border bg-background p-4 sm:p-6"><div className="mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><h2 className="font-semibold">Live preview</h2></div><pre className="max-h-[560px] overflow-auto whitespace-pre-wrap break-words rounded-lg border bg-white p-5 font-sans text-sm leading-6 text-slate-900">{output}</pre></div></section>
    </div>
  </div></main>
}
