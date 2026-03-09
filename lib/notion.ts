import type { Meal } from '@/types'

interface NotionPage {
  id: string
  properties: {
    Name?: { title?: Array<{ plain_text: string }> }
    Opis?: { rich_text?: Array<{ plain_text: string }> }
    Zdjecie?: { url?: string }
    Czas_przygotowania?: { number?: number }
    Kcal_baza?: { number?: number }
    Kcal_z_miesem?: { number?: number }
    Skladniki_baza?: { rich_text?: Array<{ plain_text: string }> }
    Skladniki_mieso?: { rich_text?: Array<{ plain_text: string }> }
    Tagi?: { multi_select?: Array<{ name: string }> }
  }
}

interface NotionQueryResponse {
  results: NotionPage[]
}

export async function fetchMealsFromNotion(
  notionToken: string,
  mealsDbId: string
): Promise<Meal[]> {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${mealsDbId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error('Notion API error:', error)
    throw new Error(`Failed to fetch meals: ${response.status}`)
  }

  const data: NotionQueryResponse = await response.json()

  return data.results.map((page) => {
    const props = page.properties
    return {
      id: page.id,
      nazwa: props.Name?.title?.[0]?.plain_text || 'Bez nazwy',
      opis: props.Opis?.rich_text?.[0]?.plain_text || '',
      photo_url: props.Zdjecie?.url || '',
      prep_time: props.Czas_przygotowania?.number || 0,
      kcal_baza: props.Kcal_baza?.number || 0,
      kcal_z_miesem: props.Kcal_z_miesem?.number || 0,
      skladniki_baza:
        props.Skladniki_baza?.rich_text?.[0]?.plain_text || '[]',
      skladniki_mieso:
        props.Skladniki_mieso?.rich_text?.[0]?.plain_text || '[]',
      tags: props.Tagi?.multi_select?.map((t) => t.name) || [],
    }
  })
}
