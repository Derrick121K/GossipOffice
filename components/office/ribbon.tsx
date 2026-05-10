import { ReactNode, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export type RibbonCommand = {
  id: string
  label: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'lg'
  layout?: 'inline' | 'iconAbove'
}

export type RibbonGroup = {
  id: string
  label: string
  commands: RibbonCommand[]
}

export type RibbonTab = {
  id: string
  label: string
  groups: RibbonGroup[]
}

export function Ribbon({
  tabs,
  activeTabId,
  onActiveTabChange,
  density = 'comfortable',
}: {
  tabs: RibbonTab[]
  activeTabId: string
  onActiveTabChange: (id: string) => void
  density?: 'compact' | 'comfortable'
}) {
  const active = useMemo(() => {
    return tabs.find((t) => t.id === activeTabId) ?? tabs[0]
  }, [tabs, activeTabId])

  if (!tabs.length) return null

  const isCompact = density === 'compact'

  return (
    <div className="border-b border-border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40">
      <div className="px-3 sm:px-4">
        <div className="flex items-center gap-1 h-11 overflow-x-auto">
          {tabs.map((t) => {
            const isActive = t.id === active?.id
            return (
              <Button
                key={t.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onActiveTabChange(t.id)}
                className={`shrink-0 rounded-none px-3 ${
                  isActive
                    ? 'border-b-2 border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className={`px-3 sm:px-4 ${isCompact ? 'py-1.5' : 'py-2.5'}`}>
        <div className="flex items-stretch gap-4 overflow-x-auto">
          {active?.groups.map((g, idx) => (
            <div key={g.id} className="flex items-stretch gap-4 shrink-0">
              <div className="flex items-center gap-2">
                {g.commands.map((c) => {
                  const layout = c.layout ?? 'inline'
                  const size = c.size ?? 'sm'
                  const isLarge = size === 'lg'
                  return (
                    <Button
                      key={c.id}
                      type="button"
                      variant={c.variant ?? 'outline'}
                      size={isLarge ? 'default' : 'sm'}
                      onClick={c.onClick}
                      disabled={c.disabled}
                      className={
                        layout === 'iconAbove'
                          ? `flex-col h-auto ${isCompact ? 'py-2 px-3' : 'py-3 px-4'} gap-1`
                          : 'gap-2'
                      }
                    >
                      {c.icon ? (
                        <span className={layout === 'iconAbove' ? 'text-muted-foreground' : ''}>
                          {c.icon}
                        </span>
                      ) : null}
                      <span className={layout === 'iconAbove' ? 'text-xs leading-tight' : ''}>
                        {c.label}
                      </span>
                    </Button>
                  )
                })}
              </div>
              <div className="flex flex-col justify-end pb-0.5">
                <div className="text-[10px] text-muted-foreground leading-none text-center">
                  {g.label}
                </div>
              </div>
              {idx < (active.groups.length - 1) && (
                <Separator orientation="vertical" className="h-auto" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

