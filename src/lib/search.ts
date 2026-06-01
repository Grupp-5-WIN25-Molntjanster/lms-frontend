export type SearchResult = {
  id: string
  title: string
  excerpt: string
  type: string
  url: string
}

export async function searchAll(
    query: string,
    signal?: AbortSignal
): Promise<SearchResult[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SEARCH_API_URL}/api/search?query=${encodeURIComponent(query)}`,
    { signal }
  )
  if (!res.ok) return []
  return res.json()
}