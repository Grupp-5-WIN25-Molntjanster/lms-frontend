"use client"
import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { HelpIcon } from "@/components/icons"
type FaqCardProps = {
  title: string
  summary: string
  content: string
}
export function FaqCard({ title, summary, content }: FaqCardProps) {
  const [open, setOpen] = useState(false)
  return (
    <Card className="flex flex-col gap-3">
      <HelpIcon className="h-8 w-8 text-primary" />
      <h3 className="text-base font-semibold text-secondary">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{summary}</p>
      {open && (
        <p className="text-sm text-secondary leading-relaxed border-t border-secondary/10 pt-3">
          {content}
        </p>
      )}
      <Button
        variant="secondary"
        size="sm"
        className="self-start mt-auto"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Show Less" : "Read More"}
      </Button>
    </Card>
  )
}