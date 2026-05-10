import { ReactNode } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export function OfficeShell({
  leftRail,
  ribbon,
  main,
  rightPanel,
  mobileTopBar,
  topChrome,
  statusBar,
}: {
  leftRail: ReactNode
  ribbon: ReactNode
  main: ReactNode
  rightPanel?: ReactNode
  mobileTopBar?: ReactNode
  topChrome?: ReactNode
  statusBar?: ReactNode
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[300px_1fr]">
      {mobileTopBar ? (
        <div className="lg:hidden border-b border-border bg-card/30 px-3 py-2">
          {mobileTopBar}
        </div>
      ) : null}

      <aside className="hidden lg:block border-r border-border bg-card/30">
        <ScrollArea className="h-full">
          <div className="p-4 lg:p-5">{leftRail}</div>
        </ScrollArea>
      </aside>

      <section className="min-w-0 flex flex-col">
        <div className="sticky top-16 z-30">
          {topChrome ? (
            <div className="border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
              <div className="px-3 sm:px-4 lg:px-6 py-2">
                {topChrome}
              </div>
            </div>
          ) : null}
          <div>{ribbon}</div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_320px]">
          <div className="min-w-0 p-3 sm:p-4 lg:p-6">{main}</div>
          {rightPanel ? (
            <>
              <Separator className="hidden xl:block" orientation="vertical" />
              <aside className="hidden xl:block bg-card/20">
                <ScrollArea className="h-full">
                  <div className="p-3 sm:p-4 lg:p-5">{rightPanel}</div>
                </ScrollArea>
              </aside>
            </>
          ) : null}
        </div>

        {statusBar ? (
          <div className="border-t border-border bg-card/30 px-3 sm:px-4 lg:px-6 py-2 text-xs text-muted-foreground">
            {statusBar}
          </div>
        ) : null}
      </section>
    </div>
  )
}

