import { ReactNode } from 'react'
import { Save, Undo2, Redo2, FolderOpen, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
} from '@/components/ui/menubar'

export function OfficeTopChrome({
  appName = 'Office Tools',
  onOpenFiles,
  onSave,
  onOpenBackstage,
  extra,
}: {
  appName?: string
  onOpenFiles?: () => void
  onSave?: () => void
  onOpenBackstage?: () => void
  extra?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <Menubar className="h-9 shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="font-semibold">File</MenubarTrigger>
            <MenubarContent>
              <MenubarLabel>GossipOffice</MenubarLabel>
              <MenubarSeparator />
              <MenubarItem onSelect={onOpenBackstage} disabled={!onOpenBackstage}>
                <FileText className="w-4 h-4" />
                Backstage…
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onSelect={onOpenFiles}>
                <FolderOpen className="w-4 h-4" />
                Open Files
              </MenubarItem>
              <MenubarItem onSelect={onSave} disabled={!onSave}>
                <Save className="w-4 h-4" />
                Save
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="icon" disabled>
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSave} disabled={!onSave}>
            <Save className="w-4 h-4" />
          </Button>
        </div>

        <div className="ml-2 text-sm font-semibold truncate">{appName}</div>
      </div>

      <div className="flex items-center gap-2">
        {extra}
      </div>
    </div>
  )
}

export function OfficeStatusBar({
  left,
  right,
}: {
  left?: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0 truncate">{left}</div>
      <div className="shrink-0">{right}</div>
    </div>
  )
}

