import Elysia, { t } from "elysia";
import { findDomainTemplate } from "../lib/domain-templates";

export const proxy = new Elysia({ prefix: "proxy" })
  .get('', async ({ query: { url } }) => {
    const template = findDomainTemplate(url)

    if(!template) throw new Error("Template not found")

    const raw = await fetch(url, {
      headers: {
        ...template.headers,
        'origin': template.origin,
        'referer': template.referer
      }
    })
    if(!raw.ok) throw new Error(raw.statusText)
    const proxied = await raw.text()

    return proxied
  }, {
    query: t.Object({
      url: t.String({
        format: 'uri'
      })
    })
  })