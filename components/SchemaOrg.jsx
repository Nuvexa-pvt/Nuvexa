/**
 * SchemaOrg — injects JSON-LD structured data for SEO & GEO/AEO.
 * Drop <SchemaOrg schema={...} /> anywhere in a server component.
 */
export default function SchemaOrg({ schema }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
