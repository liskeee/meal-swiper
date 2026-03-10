// Image generation via nano-banana-pro + upload to Cloudflare R2

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import fs from 'node:fs'

const execFileAsync = promisify(execFile)

const NANO_BANANA = path.join(
  process.env.HOME,
  '.npm-global/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py'
)

const IMAGES_DIR = path.join(import.meta.dirname, '..', 'generated-images')

// Cloudflare R2 config (from env)
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const R2_BUCKET = process.env.R2_BUCKET || 'meal-swiper-images'
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

async function uploadToR2(filePath, objectKey) {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  if (!apiToken) throw new Error('Missing CLOUDFLARE_API_TOKEN env var')
  if (!R2_ACCOUNT_ID) throw new Error('Missing CLOUDFLARE_ACCOUNT_ID env var')
  if (!R2_PUBLIC_URL) throw new Error('Missing R2_PUBLIC_URL env var')

  const imageBuffer = fs.readFileSync(filePath)

  const url = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${encodeURIComponent(objectKey)}`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'image/png',
    },
    body: imageBuffer,
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`R2 upload failed (${response.status}): ${err.slice(0, 200)}`)
  }

  return `${R2_PUBLIC_URL}/${objectKey}`
}

export async function generateImage(meal, geminiApiKey) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true })

  const slug = slugify(meal.nazwa)
  const filename = `${slug}.png`
  const outputPath = path.join(IMAGES_DIR, filename)

  const prompt = `${meal.prompt_zdjecia || meal.nazwa}, food photography, appetizing, high quality, natural light`

  console.log(`📸 Generuję: ${meal.nazwa.slice(0, 50)}...`)

  // 1. Generate image locally
  try {
    await execFileAsync('python3', [NANO_BANANA, '--prompt', prompt, '--filename', outputPath], {
      env: { ...process.env, GEMINI_API_KEY: geminiApiKey },
      timeout: 90000,
    })
  } catch (err) {
    console.warn(
      `   ⚠️  Błąd generowania: ${(err.stderr || err.message || '').toString().slice(0, 100)}`
    )
    return null
  }

  if (!fs.existsSync(outputPath)) {
    console.warn(`   ⚠️  Plik nie istnieje po generowaniu`)
    return null
  }

  const sizeKB = Math.round(fs.statSync(outputPath).size / 1024)
  console.log(`   ✅ Zdjęcie wygenerowane (${sizeKB}KB)`)

  // 2. Upload to R2
  const objectKey = `meals/${slug}.png`
  try {
    const url = await uploadToR2(outputPath, objectKey)
    console.log(`   ✅ R2: ${url}`)
    return url
  } catch (err) {
    console.warn(`   ⚠️  R2 upload failed: ${err.message}`)
    return null
  }
}
