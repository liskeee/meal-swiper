export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { fetchMealsFromNotion } from '@/lib/notion'

export async function GET() {
  const notionToken = process.env.NOTION_TOKEN
  const mealsDbId = process.env.MEALS_DB_ID

  if (!notionToken || !mealsDbId) {
    return NextResponse.json(
      { error: 'Missing NOTION_TOKEN or MEALS_DB_ID environment variables' },
      { status: 500 }
    )
  }

  try {
    const meals = await fetchMealsFromNotion(notionToken, mealsDbId)
    return NextResponse.json(meals, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching meals:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
