"use client"

import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { HelpIcon } from "@/components/icons"
import { TicketFormModal } from "./tickets/TicketFormModal"

export function HelpBanner() {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Card padding="lg" className="mb-6 flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-3">
          <HelpIcon className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-bold text-secondary">Need some help?</h2>
            <p className="text-sm text-muted">Want answer right away? Select your reference below for our answers.</p>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)} size="lg">
          Help
        </Button>
      </Card>
      <TicketFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}