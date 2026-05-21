import { DashboardShell } from "@/components/layout/DashboardShell"
import { getFaqs } from "./faq/faq"
import { FaqCard } from "./faq/FaqCard"
import { HelpBanner } from "./HelpBanner"

export default async function HelpPage() {
  const faqs = await getFaqs()
  return (
    <DashboardShell title="Help Center" subtitle="Ger a question about your courses or your account? We’re here to help.">
      <HelpBanner />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {faqs.map((faq) => (
          <FaqCard
            key={faq.id}
            title={faq.title}
            summary={faq.summary}
            content={faq.content}
          />
        ))}
      </div>
    </DashboardShell>
  )
}