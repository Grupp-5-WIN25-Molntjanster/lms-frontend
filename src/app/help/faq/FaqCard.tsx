"use client"

import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { HelpIcon } from "@/components/icons"

type FaqCardProps = {
  id: string
  title: string
  summary: string
  content: string
}

export function FaqCard({ id, title, summary, content }: FaqCardProps) {
  const [open, setOpen] = useState(false)
  return (
    <Card id={id} className="flex flex-col gap-3">
      <HelpIcon className="h-8 w-8 text-primary" />
      <h3 className="text-base font-semibold text-secondary">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{summary}</p>
      {open && (
        <p className="text-sm text-secondary leading-relaxed border-t border-secondary/10 pt-3">
          {content}
        </p>
      )}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="self-start mt-auto flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-400 transition-colors"
      >
        {open ? "Show Less" : "Read More"}
        <span>{open ? "↑" : "→"}</span>
      </button>
    </Card>
  )
}