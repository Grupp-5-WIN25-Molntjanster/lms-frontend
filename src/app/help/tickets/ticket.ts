export type TicketRequest = {
  name: string
  email: string
  subject: string
  message: string
}
export type TicketResult = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  status: string
}
export async function createTicket(request: TicketRequest): Promise<TicketResult> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_TICKET_API_URL}/api/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TICKET_API_TOKEN}`,
    },
    body: JSON.stringify(request),
  })
  if (!res.ok) {
    const errorBody = await res.text().catch(() => "")
    throw new Error(errorBody || `Failed to create ticket (${res.status})`)
  }
  return res.json()
}