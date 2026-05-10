'use client'

import { Card } from '@/components/ui/card'

export default function SecurityPage() {
  const COMPANY_NAME = 'GossipOffice'
  const SECURITY_EMAIL = 'security@example.com' // TODO: replace
  const DISCLOSURE_POLICY = 'Please email us with steps to reproduce and any relevant logs/screenshots.' // TODO: replace

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Security</h1>
          <p className="text-muted-foreground">Security notes and recommendations for {COMPANY_NAME}.</p>
        </div>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Local-first security</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {COMPANY_NAME} saves your files locally in your browser. Anyone with access to your device and browser profile may
            access those files. Use a device password and a trusted browser profile.
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">API keys & environment variables</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            The Groq API key is read from server environment variables (<span className="font-medium">GROQ_API_KEY</span>).
            Never commit keys to git or share them publicly.
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Recommendations</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Use a separate browser profile for work documents if needed.</li>
            <li>Don’t paste passwords, banking details, or secrets into AI prompts.</li>
            <li>Keep your OS/browser updated.</li>
            <li>Clear site data only if you intend to delete local files.</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Vulnerability disclosure</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            If you believe you’ve found a security issue, contact us at <span className="font-medium">{SECURITY_EMAIL}</span>.
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">{DISCLOSURE_POLICY}</div>
        </Card>
      </div>
    </main>
  )
}

