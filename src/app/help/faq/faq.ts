export type Faq = {
  id: number
  title: string
  summary: string
  content: string
  displayOrder: number
}
export async function getFaqs(): Promise<Faq[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_FAQ_API_URL}/api/faqs`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error("Failed to fetch FAQs")
  return res.json()
}