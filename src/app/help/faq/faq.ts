export type Faq = {
  id: number
  title: string
  summary: string
  content: string
  displayOrder: number
}
export async function getFaqs(): Promise<Faq[]> {
  const res = await fetch("http://localhost:5064/api/faqs", {
    headers: { "X-API-KEY": "a6c7e84b9d0c45cda31198d908011a64" },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error("Failed to fetch FAQs")
  return res.json()
}