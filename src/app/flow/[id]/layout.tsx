import type React from "react"
import { notFound } from "next/navigation"
import FlowNavigationBar from "@/components/layout/flow-navigation-bar"
import { FlowProvider } from "@/contexts/flow-context"
import { SimulationProvider } from "@/contexts/simulation-context"
import { loadFlowWithContent } from "@/actions/flow-actions"
import FlowSidebar from "@/components/layout/flow-sidebar"
import { ReactFlowProvider } from "@xyflow/react"

// Force dynamic rendering for this layout since it requires database access
export const dynamic = "force-dynamic"

interface FlowLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function FlowLayout({ children, params }: FlowLayoutProps) {
  const { id } = await params
  const { flow, error } = await loadFlowWithContent(id)

  if (error || !flow) {
    notFound()
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <FlowProvider key={id} initialFlow={flow}>
        <SimulationProvider>
          <FlowNavigationBar />
          <div className="flex flex-1 overflow-hidden divide-x border-border">
            <FlowSidebar />
            <div className="flex-1 overflow-hidden bg-background">
              <ReactFlowProvider>{children}</ReactFlowProvider>
            </div>
          </div>
        </SimulationProvider>
      </FlowProvider>
    </div>
  )
}
