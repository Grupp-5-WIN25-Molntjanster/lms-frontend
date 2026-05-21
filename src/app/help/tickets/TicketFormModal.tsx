"use client"

import { useState, type FormEvent } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { XIcon, CheckIcon } from "@/components/icons"
import { createTicket } from "./ticket"
import type { TicketRequest, TicketResult } from "./ticket"

type TicketFormModalProps = {
  open: boolean
  onClose: () => void
}

type PageState = "form" | "submitting" | "success"

export function TicketFormModal({ open, onClose }: TicketFormModalProps) {
  const [page, setPage] = useState<PageState>("form")
  const [result, setResult] = useState<TicketResult | null>(null)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [subjectError, setSubjectError] = useState("")
  const [messageError, setMessageError] = useState("")

  if (!open) return null
  function validate(): boolean {
    let valid = true
    setNameError("")
    setEmailError("")
    setSubjectError("")
    setMessageError("")
    setError("")

    if (!name.trim()) { setNameError("Name is required"); valid = false }
    if (!email.trim()) { setEmailError("Email is required"); valid = false }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Invalid email format"); valid = false }
    if (!subject.trim()) { setSubjectError("Subject is required"); valid = false }
    if (!message.trim()) { setMessageError("Message is required"); valid = false }
    return valid
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setPage("submitting")
    try {
      const payload: TicketRequest = { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }
      const ticket = await createTicket(payload)
      setResult(ticket)
      setPage("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setPage("form")
    }
  }
  
  function handleClose() {
    setPage("form")
    setResult(null)
    setError("")
    setName(""); setEmail(""); setSubject(""); setMessage("")
    setNameError(""); setEmailError(""); setSubjectError(""); setMessageError("")
    onClose()
  }
  
  const disabled = page === "submitting"
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
      onKeyDown={(e) => { if (e.key === "Escape") handleClose() }}
    >
      <Card padding="lg" className="relative w-full max-w-lg">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-muted hover:text-secondary transition-colors"
          disabled={disabled}
        >
          <XIcon className="h-5 w-5" />
        </button>
        {page === "success" && result ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-quaternary/10">
              <CheckIcon className="h-7 w-7 text-quaternary" />
            </div>
            <h2 className="text-xl font-bold text-secondary">Ticket #{result.id} created successfully</h2>
            <p className="text-sm text-muted">We'll get back to you at <strong>{result.email}</strong>.</p>
            <Button variant="secondary" onClick={handleClose} className="mt-4">Close</Button>
          </div>
        ) : (
          /* ── Form state ── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold text-secondary">Submit a Ticket</h2>
              <p className="text-sm text-muted">We'll respond as soon as possible.</p>
            </div>
            {error && (
              <p className="rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary">{error}</p>
            )}
            <Input
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
              maxLength={50}
              disabled={disabled}
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              maxLength={50}
              disabled={disabled}
            />
            <Input
              label="Subject"
              placeholder="What is this about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              error={subjectError}
              maxLength={100}
              disabled={disabled}
            />
            {/* Message - textarea with same styling as Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">Message</label>
              <textarea
                placeholder="Describe your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                disabled={disabled}
                rows={5}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-muted resize-none ${
                  messageError
                    ? "border-primary/60 focus-within:border-primary"
                    : "border-secondary/15 focus-within:border-secondary/40"
                }`}
              />
              {messageError && <p className="text-xs text-primary">{messageError}</p>}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleClose} disabled={disabled}>
                Cancel
              </Button>
              <Button type="submit" disabled={disabled}>
                {disabled ? "Sending..." : "Send Ticket"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}