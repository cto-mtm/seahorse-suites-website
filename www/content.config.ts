import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    news: defineCollection({
      type: 'page',
      source: 'news/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        image: z.string().optional(),
        category: z.string().optional()
      })
    })
  }
})
