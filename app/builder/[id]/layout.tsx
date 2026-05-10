import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume Builder - Create Your CV',
  description: 'Build your professional resume with our AI-powered builder',
}

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
