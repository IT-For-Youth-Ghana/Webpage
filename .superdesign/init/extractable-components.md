# Extractable components

## SiteHeader
- Source: `components/layout/site-header.tsx`
- Category: layout
- Description: Public navigation with the real ITFYG logo, desktop links and mobile menu.
- Extractable props: none; content is supplied by the site configuration.
- Hardcoded: responsive structure, CSS classes and icon geometry.

## SiteFooter
- Source: `components/layout/site-footer.tsx`
- Category: layout
- Description: Public footer with identity, navigation columns and contact details.
- Extractable props: none; content is supplied by the site configuration.
- Hardcoded: responsive structure and CSS classes.

## CapsuleShell
- Source: `components/capsule/capsule-shell.tsx`
- Category: basic
- Description: Shared media-and-content capsule geometry used by hero and page intros.
- Extractable props: tone, variant, media, children.
- Hardcoded: capsule class names and animation hook.
